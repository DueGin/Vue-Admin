<template>
    <el-container>
        <el-aside width="200px">
            <SideMenu></SideMenu>
        </el-aside>
        <el-container>
            <el-header>
                <strong> Vue Amdin 后台管理系统 </strong>
                <div class="header-avatar">
                    <el-avatar :src="userInfo.avatar"></el-avatar>
                    <el-dropdown>
                    <span class="el-dropdown-link">
                      {{ userInfo.username }}
                      <el-icon class="el-icon--right">
                        <arrow-down/>
                      </el-icon>
                    </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <router-link :to="{name: 'UserCenter'}">
                                        个人中心
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <el-link href="">GitHub</el-link>
                    <el-link>B站</el-link>
                </div>

            </el-header>
            <el-main>
                <Tabs></Tabs>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import SideMenu from "@/views/inc/SideMenu";
import axios from "axios";
import Tabs from "@/views/inc/Tabs";

export default {
    name: "HomeView",
    data() {
        return {
            userInfo: []
        }
    },
    components: {
        SideMenu,
        Tabs
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        getUserInfo() {
            axios.get('/sys/userInfo').then(res => {
                if (res.data.code === 200) {
                    this.userInfo = res.data.data.userInfo
                }
            })
        },
        logout(){
            axios.post('/logout').then(res=>{
                sessionStorage.clear()
                // 清除状态
                this.$store.commit('resetState')
                // 路由到登录页面
                this.$router.push('/login')
            })
        }
    }

}
</script>

<style>
a{
    text-decoration: none;
    color: unset;
}
/*布局*/
.el-container {
    padding: 0;
    margin: 0;
    height: 100%;
}

.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    padding: 0 !important;
}

/*头部下拉菜单*/
.el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.header-avatar {
    float: right;
    width: 210px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>