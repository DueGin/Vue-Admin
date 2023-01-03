export default {
    state: {
        menuList: [],
        permList: [],
        hasRoute: false,
    },
    getters: {
        getPermList: state => state.permList,
        getMenuList: state => state.menuList,
        hasRoute: state => state.hasRoute,
    },
    mutations: {
        // 设置权限列表
        setPermList: (state, perm) => {
            state.permList = perm
        },
        // 设置菜单列表
        setMenuList: (state, menus) => {
            state.menuList = menus
        },
        // 改变是否获取路由状态
        changeRouteStatus: (state, hasRoute) => {
            state.hasRoute=hasRoute
            sessionStorage.setItem("hasRoute", hasRoute)
        },
        resetState: state => {
            state.token=''
            state.hasRoute=false
            state.menuList=[]
            state.permList=[]
            sessionStorage.clear()

            state.editableTabsValue = 'Index'
            state.editableTabs = [{
                title: '首页',
                name: 'Index',
            }]
        }
    },
    actions: {}

}
