//路由鉴权
import router from './router'
//引入进度条插件和样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//进度条的小圆圈去掉
nprogress.configure({ showSpinner: false })
//获取用户数据
import pinia from './store'
import useUserStore from './store/modules/user'
import { REMOVE_TOKEN } from './utils/token'
import setting from './setting'

let useStore = useUserStore(pinia)

//全局守卫：项目中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  let token = useStore.token
  let username = useStore.name
  if (token) {
    //登录成功不可以在访问login
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //有用户信息放行
      if (username) {
        next()
      } else {
        //获取用户信息
        try {
          await useStore.userInfo()
          next()
        } catch (error) {
          useStore.name = ''
          useStore.token = ''
          useStore.avatar = ''
          REMOVE_TOKEN()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录可以访问login
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全部后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
