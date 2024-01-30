import type { RouteRecordRaw } from 'vue-router'
//定义仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  name: string
  avatar: string
}
