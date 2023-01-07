<template>
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit"
             @tab-click="tabClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    name: "Tabs",
    data() {
        return {}
    },
    computed: {
        editableTabs() {
            return JSON.parse(JSON.stringify(this.$store.getters.getEditableTabs))
        },
        editableTabsValue: {
            get() {
                return this.$store.getters.getEditableTabsValue
            },
            set(newValue) {
                this.$store.commit('setEditableTabsValue', newValue)
            }
        }
    },
    methods: {
        handleTabsEdit(targetName, action) {
            console.log(targetName, action)
            // if (action === 'add') {
            //     this.$store.commit('addTabs', targetName)
            // }
            if (action === 'remove') {
                this.$store.commit('removeTabs', targetName)
                this.$router.push({name:this.$store.getters.getEditableTabsValue})
            }
        },
        tabClick(tab) {
            const t = JSON.parse(JSON.stringify(tab))
            this.$router.push({name: t.props.name})
        }
    }
}
</script>

<style>
/*将新加标签按钮隐藏*/
.el-tabs__header > .el-tabs__new-tab{
    display: none !important;
}
</style>