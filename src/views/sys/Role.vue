<template>
    <div>
        <el-form :inline="true" class="search-form">
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" :disabled="multipleSelection.length === 0" @click="delHandle">删除
                </el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                  border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>

            <el-table-column prop="name" label="名称" width="120"/>

            <el-table-column prop="code" label="唯一编码" show-overflow-tooltip/>

            <el-table-column prop="remark" label="描述" show-overflow-tooltip/>

            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template #default="scope">
                    <el-button type="text" @click="showEditPermForm(scope.row.id)">分配权限</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" @click="showEditForm(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[1, 10, 20, 50, 100]"
                       :current-page="current" :page-size="size" :total="total" @size-change="handleSizeChange"
                       :pager-count=5 @current-change="handleCurrentChange"/>

        <!--新增对话框-->
        <el-dialog v-model="dialogVisible" title="添加角色" width="40%">
            <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="100px"
                     class="role-editRoleForm" status-icon>

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editRoleForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editRoleForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editRoleForm.remark" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editRoleForm.status">
                        <el-radio :label=1>正常</el-radio>
                        <el-radio :label=0>禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addRole('editRoleFormRef')">立即创建</el-button>
                    <el-button @click="reSetRoleForm('editRoleFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--分配权限对话框-->
        <el-dialog title="分配权限" v-model="permDialogVisible" width="600px">
            <el-form :model="editPermForm" v-loading="permDialogLoading" element-loading-text="搏命加载中..">
                <el-tree :data="permTreeData" show-checkbox ref="permTreeRef" default-expand-all
                         node-key="id" :props="defaultProps"/>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="permDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updatePerm('permTreeRef')">确 定</el-button>
                </span>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Role",
    data() {
        return {
            searchForm: {},

            total: 0,
            size: 10,
            current: 1,

            dialogVisible: false,
            editRoleForm: {},
            permDialogLoading: false,

            tableData: [],

            editRoleFormRules: {
                name: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: '请输入唯一编码', trigger: 'blur'}
                ],
                status: [
                    {required: true, message: '请选择状态', trigger: 'blur'}
                ]
            },

            multipleSelection: [],

            permDialogVisible: false,
            editPermForm: {},
            permTreeData: []
        }
    },
    created() {
        this.getRoleList()
        this.getPermTree()
    },
    methods: {
        getPermTree() { // 获取权限列表
            axios.get('/sys/menu/list').then(res => {
                this.permTreeData = res.data.data
            })
        },
        getRoleList() { // 获取角色列表
            axios.get("/sys/role/list", {
                params: {
                    name: this.searchForm.name,
                    current: this.current,
                    size: this.size
                }
            }).then(res => {
                console.log(res.data.data.records)
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            })
        },
        delHandle() { // 删除角色
            if (this.multipleSelection.length) {
                let delList = JSON.parse(JSON.stringify(this.multipleSelection))
                let ids = []
                delList.forEach(item => {
                    ids.push(item.id)
                })
                axios.post('/sys/role/del', ids).then(res => {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: '删除成功！'
                    })
                })
                // 刷新角色列表
                this.getRoleList()
            }
        },
        addRole(formName) { // 添加角色
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/sys/role/' + (this.editRoleForm.id ? 'update' : 'save'), this.editRoleForm).then(res => {
                        this.$message({
                            showClose: true,
                            message: (this.editRoleForm.id ? '更新' : '新增') + '角色成功！',
                            type: 'success'
                        });
                        // 更新角色列表
                        this.getRoleList()
                        // 重置表单
                        this.reSetRoleForm(formName)
                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        showEditForm(id) { // 打开角色编辑框
            axios.get('/sys/role/' + id).then(res => {
                console.log(res.data)
                this.editRoleForm = res.data.data
                this.dialogVisible = true
            })
        },
        reSetRoleForm(formName) { // 重置角色编辑表单
            this.dialogVisible = false
            this.$refs[formName].resetFields();
            this.editRoleForm = {}
        },
        reSetPermForm(formName) { // 重置权限编辑表单
            this.permDialogVisible = false
            this.$refs[formName].resetFields();
            this.editPermForm = {}
        },
        showEditPermForm(id) { // 显示分配权限对话框
            this.permDialogVisible = true
            this.permDialogLoading = true
            axios.get('/sys/role/info/' + id).then(res => {
                this.$refs['permTreeRef'].setCheckedKeys(res.data.data.menuIds)
                this.permDialogLoading = false
            })
        },
        updatePerm(formName) { // 更新角色权限
            let menuIds = this.$refs[formName].getCheckedKeys()
            console.log(menuIds)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/sys/role/perm/' + this.editPermForm.id, menuIds).then(res => {
                        this.$message({
                            showClose: true,
                            message: '更新角色权限成功！',
                            type: 'success',
                        });
                    })
                    // 刷新角色列表
                    this.getRoleList()
                    // 重置权限分配表单
                    this.reSetPermForm(formName)

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleSizeChange(size) { // 改变每页显示条数
            this.size = size
            this.getRoleList()
            console.log(`每页 ${size} 条`);
        },
        handleCurrentChange(current) { // 跳转当前页
            this.current = current
            this.getRoleList()
            console.log(`当前页: ${current}`);
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },

    }
}
</script>

<style scoped>

.el-pagination {
    float: right;
    margin-top: 22px;
}

.search-form {
    float: left;
}
</style>