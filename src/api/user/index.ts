import request from '@/utils/request'
import {
  addUserInfoRequest,
  loginForm,
  loginResponse,
  userPageRequest,
  validateCodeResponse,
} from './type'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum API {
  LOGIN_URL = '/user/login',
  USERPAGEINFO_URL = '/user/list/page',
  VALIDATECODE_URL = '/user/generateValidateCode',
  USERINFO_URL = '/user/getUserInfo',
  LOGOUT_URL = '/user/logout',
  PAGEUSERINF_URL = '/user/findByPage/',
  ADDUSER_URL = '/user/saveSysUser',
  UPDATEUSER_URL = '/user/updateSysUser',
  DELETEUSER_URL = '/user/deleteById/',
  ASSIGNROLETOUSER = '/user/doAssign',
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

//分页查询用户信息
export const GetSysUserListByPage = (
  pageNo: number,
  pageSize: number,
  queryDto: userPageRequest,
) => request.post(API.PAGEUSERINF_URL + pageNo + '/' + pageSize, queryDto)

//新增用户
export const saveSysUser = (data: addUserInfoRequest) =>
  request.post(API.ADDUSER_URL, data)

//修改用户
export const updateSysUser = (data: addUserInfoRequest) =>
  request.put(API.UPDATEUSER_URL, data)

//删除用户
export const deleteSysUserById = (userId: number) =>
  request.delete(API.DELETEUSER_URL + userId)

//给用户分配角色
export const DoAssignRoleToUser = (assignRoleVo: any) =>
  request.post(API.ASSIGNROLETOUSER, assignRoleVo)
