import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from "axios";
import store from "@/store";

// 可以通过name来路由
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: '/sys/index',
                name: 'Index',
                meta: {
                    title: "首页"
                },
                component: () => import('../views/index')
            },
            // {
            //     path: '/sys/menu',
            //     name: 'Menu',
            //     component: () => import('../views/sys/Menu')
            // },
            {
                path: '/userCenter',
                name: 'UserCenter',
                meta: {
                    title: "个人中心"
                },
                component: () => import('../views/UserCenter')
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 每次路由时都会走这方法
// 在加载路由前获取用户能访问的路由和菜单（他们两者动态绑定在一块了）
// 将name与其路由的name绑定一块
router.beforeEach((to, from, next) => {

    // 存储是否已经加载路由，减少请求
    let trigger;
    const p = new Promise(resolve => trigger = resolve)
    axios.post('/sys/menu/nav', { // 需要加上请求头
        headers: {
            Authorization: sessionStorage.getItem('token')
        }
    }).then(res => {
        // 存储menuList
        store.commit("setMenuList", res.data.data.nav)
        // 存储用户权限
        store.commit("setPermList", res.data.data.perm)

        let newRoutes = router.options.routes
        // 动态绑定路由
        res.data.data.nav.forEach(menu => {
            if (menu.children) {
                menu.children.forEach(e => {
                    // 转成路由
                    let route = menuToRoute(e)

                    // 添加到路由管理
                    if (route) {
                        newRoutes[0].children.push(route)
                    }
                })
            }
        })
        // 把路由添加到路由管理器中
        newRoutes.forEach(route => {
            router.addRoute(route)
        })

        trigger()
    })
    if (router.hasRoute(to.name)) {
        next()
    } else {
        p.then(() => {
            next(to)
        })
    }
})

// 导航提取路由
const menuToRoute = menu => {
    if (!menu.component) {
        return null
    }

    // 路由的name就是菜单的name
    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title,
        }
    }
    route.component = () => import('@/views/sys/' + menu.component + '.vue')
    return route
}

export default router
