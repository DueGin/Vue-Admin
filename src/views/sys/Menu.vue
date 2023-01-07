<template>
    <div>
        <el-form>
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%; margin-bottom: 20px"
                  row-key="id" border default-expand-all stripe>

            <el-table-column prop="name" label="名称" sortable/>

            <el-table-column prop="perms" label="权限编码"/>

            <el-table-column prop="icon" label="图标">
                <template #default="scope" >
                    <el-icon size="large">
                        <component :is="scope.row.icon"/>
                    </el-icon>
                </template>
            </el-table-column>

            <el-table-column prop="type" label="类型">
                <template #default="scope">
                    <el-tag size="small">菜单</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="path" label="菜单URL"/>

            <el-table-column prop="component" label="菜单组件">
                <template #default="scope">
                    <el-tag size="small" type="success" v-if="scope.row.menu===0">菜单</el-tag>
                    <el-tag size="small" v-else-if="scope.row.menu===1">目录</el-tag>
                    <el-tag size="small" type="info" v-else-if="scope.row.menu===2">按钮</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="orderNum" label="排序号" sortable/>

            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag size="small" type="success" v-if="scope.row.status===1">正常</el-tag>
                    <el-tag size="small" type="danger" v-else-if="scope.row.status===0">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="type" label="类型">
                <template #default="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" @click="delConfirmDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" title="添加菜单" width="50%">
            <template #footer>
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px"
                         class="menu-editForm" status-icon>
                    <el-form-item label="上级菜单" prop="parentId">
                        <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                            <template v-for="item in tableData">
                                <el-option :label="item.name" :value="item.id"/>
                                <template v-for="child in item.children">
                                    <el-option :label="child.name" :value="child.id">
                                        <span>{{ "- " + child.name }}</span>
                                    </el-option>
                                </template>
                            </template>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="editForm.name" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="权限编码" prop="perms">
                        <el-input v-model="editForm.perms"/>
                    </el-form-item>
                    <el-form-item label="图标" prop="icon">
                        <el-input v-model="editForm.icon" />
                    </el-form-item>
                    <el-form-item label="菜单URL" prop="path">
                        <el-input v-model="editForm.path"/>
                    </el-form-item>
                    <el-form-item label="菜单组件" prop="component">
                        <el-input v-model="editForm.component"/>
                    </el-form-item>

                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="editForm.type">
                            <el-radio :label=0>目录</el-radio>
                            <el-radio :label=1>菜单</el-radio>
                            <el-radio :label=2>按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="editForm.status">
                            <el-radio :label=1>正常</el-radio>
                            <el-radio :label=0>禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="排序号" prop="orderNum" label-width="100px">
                        <el-input-number v-model="editForm.orderNum" :min="1"/>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addMenuItem('editFormRef')">
                            提交
                        </el-button>
                        <el-button @click="resetForm('editFormRef')">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Menu",
    data() {
        return {
            dialogVisible: false,
            editForm: {},
            editFormRules: {
                parentId: [
                    {required: true, message: '请选择上级菜单', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                perms: [
                    {required: true, message: '请输入权限编码', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '请选择状态', trigger: 'blur'}
                ],
                orderNum: [
                    {required: true, message: '请填入排序号', trigger: 'blur'}
                ],
                status: [
                    {required: true, message: '请选择状态', trigger: 'blur'}
                ]
            },
            tableData: []

        }
    },
    created() {
        this.getMenuTree()
    },
    methods: {
        getMenuTree() {
            axios.get('/sys/menu/list').then(res => {
                this.tableData = res.data.data
            })
        },
        delConfirmDialog: (id) => {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/sys/menu/del/' + id).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                        // 重新获取列表
                        this.getMenuTree()
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addMenuItem(formName) { // 添加菜单
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 发送请求
                    console.log(this.editForm);
                    axios.post('/sys/menu/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
                        this.$message({
                            showClose: true,
                            message: '添加成功！',
                            type: 'success',
                            onClose: () => { // 消息弹窗消失时的回调函数
                                this.resetForm(formName)
                            }
                        })
                        // 刷新菜单列表
                        this.getMenuTree()
                        // 关闭表单弹窗
                        this.dialogVisible = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        editHandle(id) {
            axios.get('/sys/menu/info/' + id).then(res => {
                this.editForm = res.data.data
                this.dialogVisible = true
            })
        }
    },
}
</script>

<style scoped>

</style>