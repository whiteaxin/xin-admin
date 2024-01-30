//用于注册components文件夹内部全部全局组件！！！
import SvgIcon from './SvgIcon/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const components: { [name: string]: Component } = { SvgIcon }
export default {
  //必须叫做install
  install(app: App) {
    //注册项目的全部全局组件
    Object.keys(components).forEach((key: string) => {
      //注册为全局组件
      app.component(key, components[key])
    })
    //将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
