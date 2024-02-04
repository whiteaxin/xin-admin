import { defineStore } from 'pinia'
import { GetUserInfo, reqLogin } from '@/api/user'
import { loginForm, loginResponse } from '@/api/user/type'
import { UserState } from './types/types'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
import { reqLogout } from '@/api/user'
import { ElMessage } from 'element-plus'
//引入路由(常量路由)
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'
//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组(路由)
      name: '', //用户姓名
      avatar: '', //用户头像
    }
  },
  actions: {
    async userLogin(data: loginForm) {
      let result: loginResponse = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data.token as string
        //本地存储
        SET_TOKEN(result.data.token as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    //获取用户信息
    async userInfo() {
      // todo 类型
      let result: any = await GetUserInfo()
      //存储用户信息
      if (result.code == 200) {
        this.name = result.data.name
        this.avatar = result.data.avatar
         //计算当前用户需要展示的异步路由
         const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asnycRoute),
          result.data.menus,
        )
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        ElMessage.error(result.message)
        return Promise.reject(new Error(result.message))
      }
    },

    async userLogout() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.name = ''
        this.avatar = ''
        REMOVE_TOKEN()
        router.push({ path: '/login' })
      } else {
        ElMessage.error(result.message)
      }
    },
  },
  getters: {},
})

export default useUserStore
