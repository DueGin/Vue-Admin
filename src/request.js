import axios from "axios";
import router from "@/router";
import {ElMessage} from "element-plus";

// axios.defaults.baseURL = "http://localhost:8081"

const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

// axios请求拦截器
request.interceptors.request.use(config => {
    config.headers['Authorization'] = sessionStorage.getItem("token")
    return config
})

// axios响应拦截器
request.interceptors.response.use(response => {
    let res = response.data
    if (res.code === 200) {
        return response
    } else {
        const msg = res.msg ? res.msg : '系统异常'
        ElMessage.error(msg) // 弹出错误信息
        return Promise.reject(msg) // 拒绝
    }
}, error => { // 系统其他异常
    if (error.response.data) { // 如果响应有数据，那么把响应的msg赋值到error的msg上去
        error.message = error.response.data.msg
    }

    if (error.response.state === 401) {
        router.push('/login')
    }

    // 弹窗打印错误信息
    ElMessage.error(error.message, {duration: 3000})

    return Promise.reject(error)
})

export default request