import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-expect-error 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import gloablComponent from './components/index'
//引入模板的全局样式
import '@/styles/index.scss'
//引入路由
import router from './router'
//引入pinia
import pinia from './store'
//引入tailwind.css
import '@/styles/css/tailwindcss/tailwind.css'
//引入路由鉴权文件
import './permisstion'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComponent)
app.use(router)
app.use(pinia)

app.mount('#app')
