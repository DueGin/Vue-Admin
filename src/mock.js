const Mock = require('mockjs')

const Random = Mock.Random

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}

// mock验证码获取
Mock.mock('/captcha', 'get', () => {
    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('100x40', '12345')
    }
    return Result
})

// mock登录请求
Mock.mock('/login', 'post', () => {
    // mock无法将jwt封装进header

    Result.code = 400
    Result.msg = "验证码错误"

    return Result
})

Mock.mock('/sys/userInfo', 'get', () => {

    Result.data = {
        userInfo: {
            id: '1',
            username: 'test',
            avatar: require('@/assets/images/1.jpg')
        }
    }

    return Result
})

Mock.mock('/logout', 'post', () => {


    return Result
})


Mock.mock('/sys/menu/nav', 'post', () => {

    let nav = [
        {
            name: 'SysManga',
            title: '系统管理',
            icon: 'Location',
            path: '',
            component: '',
            children: [
                {
                    name: 'SysUser',
                    title: '用户管理',
                    icon: 'User',
                    path: '/sys/user',
                    component: 'User',
                },{
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'Avatar',
                    path: '/sys/role',
                    component: 'Role',
                },{
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'Grid',
                    path: '/sys/menu',
                    component: 'Menu',
                }
            ]
        },
        {
            name: 'SysTools',
            title: '系统工具',
            icon: 'Operation',
            path: '',
            component: '',
            children: [
                // {
                //     name: 'SysDict',
                //     title: '数字字典',
                //     icon: 'User',
                //     path: '/sys/dict',
                //     component: '',
                //     children: []
                // },
            ]
        }
    ]
    let perm = []

    Result.data = {
        nav: nav,
        perm: perm
    }

    return Result
})


