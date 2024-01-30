import request from '@/utils/request'
import { loginForm, loginResponse, validateCodeResponse } from './type'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum API {
  LOGIN_URL = '/user/login',
  USERPAGEINFO_URL = '/user/list/page',
  VALIDATECODE_URL = '/user/generateValidateCode',
  USERINFO_URL = '/user/getUserInfo',
  LOGOUT_URL = '/user/logout',
}

//用户登录
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponse>(API.LOGIN_URL, data)

//获取验证码
export const GetValidateCode = () =>
  request.get<any, validateCodeResponse>(API.VALIDATECODE_URL)

//获取用户信息
export const GetUserInfo = () => request.get(API.USERINFO_URL)

//用户退出
export const reqLogout = () => request.get(API.LOGOUT_URL)
