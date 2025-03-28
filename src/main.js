import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "./styles/index.css"
// Material Design Icons
import 'material-icons/iconfont/material-icons.css'
import '@mdi/font/css/materialdesignicons.min.css'
// 权限指令
import permissionDirective from "./directives/permission"

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: "default", zIndex: 3000 })

// 注册权限指令
app.directive('permission', permissionDirective)

app.mount("#app")

