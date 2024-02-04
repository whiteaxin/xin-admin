import request from '@/utils/request'
import { addRoleFrom } from './type'

enum API {
  ROLEPAGEINFO_URL = '/role/findByPage/',
  ADDROLE_URL = '/role/saveSysRole',
  UPDATEROLE_URL = '/role/updateSysRole',
  DELETEROLE_URL = '/role/deleteById/',
  GETALLROLE_URL = '/role/findAllRoles/',
  GETSYSROLEMENU_URL = '/sysRoleMenu/findSysRoleMenuByRoleId/',
  ASSIGNMENU_URL = '/sysRoleMenu/doAssign'
}

export const reqRolePageInfo = (
  pageNum: number,
  pageSize: number,
  queryDto: any,
) => request.post(API.ROLEPAGEINFO_URL + pageNum + '/' + pageSize, queryDto)

export const reqAddRole = (roleInfo: addRoleFrom) =>
  request.post(API.ADDROLE_URL, roleInfo)

export const UpdateSysRole = (roleInfo: addRoleFrom) =>
  request.put(API.UPDATEROLE_URL, roleInfo)

export const reqDeleteById = (roleId: number) =>
  request.delete(API.DELETEROLE_URL + roleId)

export const GetAllRoleList = (userId: number) =>
  request.get(API.GETALLROLE_URL + userId)

// 查询指定角色所对应的菜单id
export const GetSysRoleMenuIds = (roleId:number) => 
  request.get(API.GETSYSROLEMENU_URL + roleId);

// 根据角色分配菜单请求方法
export const DoAssignMenuIdToSysRole = (assignMenuDto:any) => 
  request.post(API.ASSIGNMENU_URL,assignMenuDto);
