<template>
    <el-col>
        <!--标签页和菜单动态绑定
        default-active和标签的激活使用同一个index，标签页依靠name作为唯一标识，而menu依靠index作为唯一标识，
        这里使用menu.name作为menu的index-->
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                 :default-active="this.$store.getters.getEditableTabsValue" text-color="#fff">
            <router-link to="/sys/index">
                <el-menu-item index="Index" @click="selectMenu({name:'Index',title:'首页'})">
                    <el-icon>
                        <HomeFilled/>
                    </el-icon>
                    首页
                </el-menu-item>
            </router-link>

            <el-sub-menu v-for="menu in menu_list" :index="menu.name">
                <template #title>
                    <el-icon>
                        <!--这里动态图标需要这么写-->
                        <component class="icon" :is="menu.icon"/>
                    </el-icon>
                    <span>{{ menu.title }}</span>
                </template>
                <router-link :to="item.path" v-for="item in menu.children">
                    <el-menu-item :index="item.name" @click="selectMenu(item)">
                        <el-icon>
                            <component class="icon" :is="item.icon"></component>
                        </el-icon>
                        {{ item.title }}
                    </el-menu-item>
                </router-link>
            </el-sub-menu>
        </el-menu>
    </el-col>
</template>

<script>
export default {
    name: "SideMenu",
    data() {
        return {
            menuList: []
        }
    },
    computed: {
        menu_list() {
            this.menuList = JSON.parse(JSON.stringify(this.$store.getters.getMenuList))
            return this.menuList
        }
    },
    methods: {
        selectMenu(menuItem) {
            let item = JSON.parse(JSON.stringify(menuItem))
            // console.log(item)
            this.$store.commit('addTabs', item)
        }
    }
}
</script>

<style scoped>
.el-col, .el-menu-vertical-demo {
    height: 100%;
}
</style>