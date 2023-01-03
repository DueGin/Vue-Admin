export default {
    state: {
        editableTabsValue: '',
        editableTabs: [{
            title: '首页',
            name: 'Index'
        }],
    },
    getters: {
        getEditableTabsValue: state => state.editableTabsValue,
        getEditableTabs: state => state.editableTabs,
    },
    mutations: {
        // 添加标签页
        addTabs: (state, menuItem) => {
            // 如果已有打开的相同标签页，则跳转
            let idx = state.editableTabs.findIndex(e => e.name === menuItem.name)

            if (idx === -1) {
                state.editableTabs.push({
                    title: menuItem.title,
                    name: menuItem.name,
                });
            }
            // 跳转到menuItem.name标签页
            state.editableTabsValue = menuItem.name
        },
        // 删除标签页
        removeTabs: (state, tabName) => {
            if(tabName==='Index'){
                return
            }
            let tabs = state.editableTabs;
            let activeName = state.editableTabsValue;
            if (activeName === tabName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === tabName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }

            state.editableTabsValue = activeName;
            state.editableTabs = tabs.filter(tab => tab.name !== tabName);
        },
        setEditableTabsValue: (state, tabValue) => {
            state.editableTabsValue = tabValue
        }
    },
    actions: {}

}
