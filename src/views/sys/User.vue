<template>
    <div>
        <el-form :inline="true" class="search-form">
            <el-form-item>
                <el-input v-model="searchForm.username" placeholder="名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getUserList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="userDialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" :disabled="multipleSelection.length === 0" @click="delHandle">删除
                </el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                  border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>

            <el-table-column prop="avatar" label="头像" width="120">
                <template #default="scope">
                    <el-avatar :src="scope.row.avatar"/>
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="120"/>

            <el-table-column prop="role" label="角色">
                <template #default="scope">
                    <el-tag size="small" type="info" v-for="item in scope.row.roles" style="margin: 0 1px;">{{item.name}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱"/>

            <el-table-column prop="phone" label="手机号"/>

            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间"/>

            <el-table-column prop="icon" label="操作">
                <template #default="scope">
                    <el-button type="text" @click="showEditRoleForm(scope.row.id)">分配角色</el-button>
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
        <el-dialog v-model="userDialogVisible" title="添加角色" width="40%">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px"
                     class="role-editUserForm" status-icon>

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editUserForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editUserForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editUserForm.remark" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editUserForm.status">
                        <el-radio :label=1>正常</el-radio>
                        <el-radio :label=0>禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addRole('editUserFormRef')">立即创建</el-button>
                    <el-button @click="reSetRoleForm('editUserFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--分配角色对话框-->
        <el-dialog title="分配角色" v-model="roleDialogVisible" width="600px">
            <el-form :model="editRoleForm" v-loading="roleDialogLoading" element-loading-text="搏命加载中..">
                <el-checkbox-group v-model="roleList">
                    <el-checkbox :label="role.name" v-for="role in roleList" />
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="roleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateRole('permTreeRef')">确 定</el-button>
                </span>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "User",
    data() {
        return {
            searchForm: {},

            total: 0,
            size: 10,
            current: 1,

            userDialogVisible: false,
            editUserForm: {},
            roleDialogLoading: false,

            tableData: [],

            editUserFormRules: {
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

            roleDialogVisible: false,
            editRoleForm: {},
            roleList: []
        }
    },
    created() {
        this.getUserList()
        this.getRoleList()
    },
    methods: {
        getRoleList() { // 获取权限列表
            axios.get('/sys/role/list').then(res => {
                this.roleList = res.data.data
            })
        },
        getUserList() { // 获取用户列表
            axios.get("/sys/user/list", {
                params: {
                    username: this.searchForm.username,
                    current: this.current,
                    size: this.size
                }
            }).then(res => {
                console.log(res.data.data.records)
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            })
        },
        delHandle() { // 删除用户
            if (this.multipleSelection.length) {
                let delList = JSON.parse(JSON.stringify(this.multipleSelection))
                let ids = []
                delList.forEach(item => {
                    ids.push(item.id)
                })
                axios.post('/sys/user/del', ids).then(res => {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: '删除成功！'
                    })
                })
                // 刷新用户列表
                this.getUserList()
            }
        },
        addRole(formName) { // 添加用户
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/sys/user/' + (this.editUserForm.id ? 'update' : 'save'), this.editUserForm).then(res => {
                        this.$message({
                            showClose: true,
                            message: (this.editUserForm.id ? '更新' : '新增') + '用户成功！',
                            type: 'success'
                        });
                        // 更新用户列表
                        this.getUserList()
                        // 重置表单
                        this.reSetUserForm(formName)
                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        showEditForm(id) { // 打开用户编辑框
            axios.get('/sys/user/' + id).then(res => {
                console.log(res.data)
                this.editUserForm = res.data.data
                this.dialogVisible = true
            })
        },
        reSetRoleForm(formName) { // 重置角色编辑表单
            this.dialogVisible = false
            this.$refs[formName].resetFields();
            this.editRoleForm = {}
        },
        reSetUserForm(formName) { // 重置用户编辑表单
            this.userDialogVisible = false
            this.$refs[formName].resetFields();
            this.editUserForm = {}
        },
        showEditRoleForm(id) { // 显示分配角色对话框
            this.roleDialogVisible = true
            this.roleDialogLoading = true
            axios.get('/sys/user/info/' + id).then(res => {
                this.roleList = res.data.data.roles
                this.roleDialogLoading = false
            })
        },
        updateRole(formName) { // 更新用户角色
            let roleIds = this.$refs[formName].getCheckedKeys()
            console.log(roleIds)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/sys/user/role/' + this.editRoleForm.id, roleIds).then(res => {
                        this.$message({
                            showClose: true,
                            message: '更新用户角色成功！',
                            type: 'success',
                        });
                    })
                    // 刷新角色列表
                    this.getUserList()
                    // 重置角色分配表单
                    this.reSetRoleForm(formName)

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleSizeChange(size) { // 改变每页显示条数
            this.size = size
            this.getUserList()
            console.log(`每页 ${size} 条`);
        },
        handleCurrentChange(current) { // 跳转当前页
            this.current = current
            this.getUserList()
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