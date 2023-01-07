import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// require("./mock.js") // 引入mock.js



const app= createApp(App).use(store).use(router)
    .use(ElementPlus) // 使用element-plus
    // .mount('#app')

// 全局使用el图标
for(let iconName in ElementPlusIconsVue){
    app.component(iconName,ElementPlusIconsVue[iconName])
}

app.mount('#app')