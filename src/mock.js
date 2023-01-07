const Mock = require('mockjs')
const axios = require("axios");

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
                }, {
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'Avatar',
                    path: '/sys/role',
                    component: 'Role',
                }, {
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'Menu',
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

Mock.mock('/sys/menu/list', 'get', () => {
    Result.data = [
        {
            "id": "1",
            "parent_id": "0",
            "name": "系统管理",
            "path": "",
            "perms": "sys:manage",
            "component": "",
            "type": "0",
            icon: "Operation",
            "orderNum": "1",
            "created": "15-1-2021 18:58:18",
            "updated": "15-1-2021 18:58:20",
            "status": "1",
            children: [
                {
                    "id": "2",
                    "parent_id": "1",
                    "name": "用户管理",
                    "path": "/sys/users",
                    "perms": "sys:user:list",
                    "component": "sys/User",
                    "type": "1",
                    "icon": "Custom",
                    "orderNum": "1",
                    "created": "15-1-2021 19:03:45",
                    "updated": "15-1-2021 19:03:48",
                    "status": "1",
                    children: [
                        {
                            "id": "9",
                            "parent_id": "2",
                            "name": "添加用户",
                            "path": "",
                            "perms": "sys:user:save",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "1",
                            "created": "17-1-2021 21:48:32",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "10",
                            "parent_id": "2",
                            "name": "修改用户",
                            "path": "",
                            "perms": "sys:user:update",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "2",
                            "created": "17-1-2021 21:49:03",
                            "updated": "17-1-2021 21:53:04",
                            "status": "1"
                        },
                        {
                            "id": "11",
                            "parent_id": "2",
                            "name": "删除用户",
                            "path": "",
                            "perms": "sys:user:delete",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "3",
                            "created": "17-1-2021 21:49:21",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "12",
                            "parent_id": "2",
                            "name": "分配角色",
                            "path": "",
                            "perms": "sys:user:role",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "4",
                            "created": "17-1-2021 21:49:58",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "13",
                            "parent_id": "2",
                            "name": "重置密码",
                            "path": "",
                            "perms": "sys:user:repass",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "5",
                            "created": "17-1-2021 21:50:36",
                            "updated": "",
                            "status": "1"
                        },
                    ]
                },
                {
                    "id": "3",
                    "parent_id": "1",
                    "name": "角色管理",
                    "path": "/sys/roles",
                    "perms": "sys:role:list",
                    "component": "sys/Role",
                    "type": "1",
                    "icon": "Avatar",
                    "orderNum": "2",
                    "created": "15-1-2021 19:03:45",
                    "updated": "15-1-2021 19:03:48",
                    "status": "1",
                    children: [
                        {
                            "id": "7",
                            "parent_id": "3",
                            "name": "添加角色",
                            "path": "",
                            "perms": "sys:role:save",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "1",
                            "created": "15-1-2021 23:02:25",
                            "updated": "17-1-2021 21:53:14",
                            "status": "0"
                        },
                        {
                            "id": "14",
                            "parent_id": "3",
                            "name": "修改角色",
                            "path": "",
                            "perms": "sys:role:update",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "2",
                            "created": "17-1-2021 21:51:14",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "15",
                            "parent_id": "3",
                            "name": "删除角色",
                            "path": "",
                            "perms": "sys:role:delete",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "3",
                            "created": "17-1-2021 21:51:39",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "16",
                            "parent_id": "3",
                            "name": "分配权限",
                            "path": "",
                            "perms": "sys:role:perm",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "5",
                            "created": "17-1-2021 21:52:02",
                            "updated": "",
                            "status": "1"
                        },
                    ]
                },
                {
                    "id": "4",
                    "parent_id": "1",
                    "name": "菜单管理",
                    "path": "/sys/menus",
                    "perms": "sys:menu:list",
                    "component": "sys/Menu",
                    "type": "1",
                    "icon": "Grid",
                    "orderNum": "3",
                    "created": "15-1-2021 19:03:45",
                    "updated": "15-1-2021 19:03:48",
                    "status": "1",
                    children: [
                        {
                            "id": "17",
                            "parent_id": "4",
                            "name": "添加菜单",
                            "path": "",
                            "perms": "sys:menu:save",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "1",
                            "created": "17-1-2021 21:53:53",
                            "updated": "17-1-2021 21:55:28",
                            "status": "1"
                        },
                        {
                            "id": "18",
                            "parent_id": "4",
                            "name": "修改菜单",
                            "path": "",
                            "perms": "sys:menu:update",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "2",
                            "created": "17-1-2021 21:56:12",
                            "updated": "",
                            "status": "1"
                        },
                        {
                            "id": "19",
                            "parent_id": "4",
                            "name": "删除菜单",
                            "path": "",
                            "perms": "sys:menu:delete",
                            "component": "",
                            "type": "2",
                            "icon": "",
                            "orderNum": "3",
                            "created": "17-1-2021 21:56:36",
                            "updated": "",
                            "status": "1"
                        }
                    ]
                },
            ]
        },
        {
            "id": "5",
            "parent_id": "0",
            "name": "系统工具",
            "path": "",
            "perms": "sys:tools",
            "component": "",
            "type": "0",
            "icon": "Tools",
            "orderNum": "2",
            "created": "15-1-2021 19:06:11",
            "updated": "",
            "status": "1",
            children: [
                {
                    "id": "6",
                    "parent_id": "5",
                    "name": "数字字典",
                    "path": "/sys/dict",
                    "perms": "sys:dict:list",
                    "component": "sys/Dict",
                    "type": "1",
                    "icon": "Collection",
                    "orderNum": "1",
                    "created": "15-1-2021 19:07:18",
                    "updated": "18-1-2021 16:32:13",
                    "status": "1"
                },
            ]
        }
    ]
    return Result
})

Mock.mock('/sys/menu/del/1', 'post', () => {
    Result.data = {}
})

Mock.mock('/sys/menu/info/9', 'get', () => {
    Result.data = {
        "id": "9",
        "parentId": "2",
        "name": "添加用户",
        "path": "",
        "perms": "sys:user:save",
        "component": "",
        "type": 2,
        "icon": "",
        "orderNum": 1,
        "created": "17-1-2021 21:48:32",
        "updated": "",
        "status": 1
    }
    return Result
})

/*

role.vue

*/

Mock.mock('/sys/role/list?current=1&size=10', 'get', () => {
    Result.data = {
        records: [
            {
                "id": "3",
                "name": "普通用户",
                "code": "normal",
                "remark": "只有基本查看功能",
                "created": "4-1-2021 10:09:14",
                "updated": "30-1-2021 08:19:52",
                "status": 1
            },
            {
                "id": "6",
                "name": "超级管理员",
                "code": "admin",
                "remark": "系统默认最高权限，不可以编辑和任意修改",
                "created": "16-1-2021 13:29:03",
                "updated": "17-1-2021 15:50:45",
                "status": 1
            }
        ],
        size: 10,
        current: 1,
        total: 2
    }
    return Result
})

Mock.mock('/sys/role/list?current=1&size=1', 'get', () => {
    Result.data = {
        records: [
            {
                "id": "3",
                "name": "普通用户",
                "code": "normal",
                "remark": "只有基本查看功能",
                "created": "4-1-2021 10:09:14",
                "updated": "30-1-2021 08:19:52",
                "status": 1
            }
        ],
        size: 1,
        current: 2,
        total: 2
    }
    return Result
})
Mock.mock('/sys/role/list?current=2&size=1', 'get', () => {
    Result.data = {
        records: [
            {
                "id": "6",
                "name": "超级管理员",
                "code": "admin",
                "remark": "系统默认最高权限，不可以编辑和任意修改",
                "created": "16-1-2021 13:29:03",
                "updated": "17-1-2021 15:50:45",
                "status": 1
            }
        ],
        size: 1,
        current: 1,
        total: 2
    }
    return Result
})

Mock.mock('/sys/role/info/6', 'get', () => {
    Result.data = {
        menuIds: [
            5, 7, 9
        ]
    }
    return Result
})

Mock.mock('/sys/role/save', 'post', () => {
    return Result
})

Mock.mock('/sys/role/del', 'post', (options) => {
    console.log('options=>', options)
    return Result
})

Mock.mock('/sys/role/6', 'get', (options) => {
    Result.data = {
        "id": "6",
        "name": "超级管理员",
        "code": "admin",
        "remark": "系统默认最高权限，不可以编辑和任意修改",
        "created": "16-1-2021 13:29:03",
        "updated": "17-1-2021 15:50:45",
        "status": 1
    }
    return Result
})

Mock.mock('/sys/user/list?current=1&size=10', 'get', () => {
    Result.data = {
        records: [
            {
                "id": '1',
                "created": "2021-01-12T22:13:53",
                "updated": "2021-01-16T16:57:32",
                "status": 1,
                "username": "admin",
                "password": "$2a$10$om4bTNo5k98xsNs6iCMl7eRI6biXXK6m.sxLF91kb3a0kbziLW3GG",
                "avatar": "http://duegin.gitee.io/pic/pictures/other/Rin.jpg",
                "email": "123@qq.com",
                "city": "广州",
                "lastLogin": "2020-12-30T08:38:37",
                "roles": [
                    {
                        "id": '6',
                        "created": "2021-01-16T13:29:03",
                        "updated": "2021-01-17T15:50:45",
                        "status": 1,
                        "name": "超级管理员",
                        "code": "admin",
                        "remark": "系统默认最高权限，不可以编辑和任意修改",
                        "menuIds": []
                    },
                    {
                        "id": '3',
                        "created": "2021-01-04T10:09:14",
                        "updated": "2021-01-30T08:19:52",
                        "status": 1,
                        "name": "普通用户",
                        "code": "normal",
                        "remark": "只有基本查看功能",
                        "menuIds": []
                    }
                ]
            },
            {
                "id": '2',
                "created": "2021-01-30T08:20:22",
                "updated": "2021-01-30T08:55:57",
                "status": 1,
                "username": "test",
                "password": "$2a$10$0ilP4ZD1kLugYwLCs4pmb.ZT9cFqzOZTNaMiHxrBnVIQUGUwEvBIO",
                "avatar": "http://duegin.gitee.io/pic/pictures/other/方猿.jpg",
                "email": "test@qq.com",
                "city": "广州",
                "lastLogin": null,
                "roles": [
                    {
                        "id": '3',
                        "created": "2021-01-04T10:09:14",
                        "updated": "2021-01-30T08:19:52",
                        "status": 1,
                        "name": "普通用户",
                        "code": "normal",
                        "remark": "只有基本查看功能",
                        "menuIds": []
                    }
                ]
            }
        ],
        total: 2,
        size: 10,
        current: 1
    }

    return Result
})
