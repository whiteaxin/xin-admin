import { defineStore } from 'pinia'
import { GetUserInfo, reqLogin } from '@/api/user'
import { loginForm, loginResponse } from '@/api/user/type'
import { UserState } from './types/types'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
import { constantRoute } from '../../router/routes'
import { reqLogout } from '@/api/user'
import { ElMessage } from 'element-plus'

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
      } else {
        ElMessage.error(result.message)
      }
    },
  },
  getters: {},
})

export default useUserStore
