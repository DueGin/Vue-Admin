<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="6">
            <h2>Vue Admin 管理系统</h2>
            <el-image :src="require('@/assets/images/Rin.jpg')" style="height: 200px; width: 200px;"></el-image>
            <p>哈哈哈哈哈哈哈</p>
        </el-col>

        <el-col :span="1">
            <el-divider direction="vertical"></el-divider>
        </el-col>

        <el-col :span="6">
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="80px" class="loginForm"
                     :size="formSize" status-icon>
                <el-form-item label="用户名" prop="username" style="width: 350px">
                    <el-input v-model="loginForm.username"/>
                </el-form-item>

                <el-form-item label="密码" prop="password" style="width: 350px">
                    <el-input type="password" v-model="loginForm.password"/>
                </el-form-item>

                <el-form-item label="验证码" prop="code" style="width: 350px">
                    <el-input v-model="loginForm.code" style="width: 130px; float:left;"/>
                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
                    <el-button @click="resetForm('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import request from "@/request";
import qs from "qs";

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                code: '',
                token: ''
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                code: [
                    {required: true, message: '请输入验证码', trigger: 'blur'},
                    {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
                ],
            },
            captchaImg: null
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => { // 获取注册在ref中的元素，并对表单做校验
                if (valid) { // 校验成功
                    //进行登录
                    console.log(this.loginForm)
                    request.post('/login?' + qs.stringify(this.loginForm)).then(res => {
                        const jwt = res.headers['authorization']
                        console.log('jwt:',jwt)
                        this.$store.commit('SET_TOKEN', jwt)
                        this.$router.push('/index')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) { // 重置
            this.$refs[formName].resetFields();
        },
        getCaptcha() {
            request.get('/captcha').then(res => {
                // console.log('/captcha',res)
                this.loginForm.token = res.data.data.token
                this.captchaImg = res.data.data.captchaImg
                this.loginForm.code=''
            })
        }
    },
    created() {
        this.getCaptcha()
    }
}
</script>

<style scoped>

.el-row {
    background-color: #fafafa;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
}

.captchaImg {
    float: left;
    margin-left: 8px;
    border-radius: 4px;
}

.el-divider {
    height: 200px;
}
</style>