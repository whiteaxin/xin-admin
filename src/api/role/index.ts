import request from '@/utils/request'
import { addRoleFrom } from './type'

enum API {
  ROLEPAGEINFO_URL = '/role/findByPage/',
  ADDROLE_URL = '/role/saveSysRole',
  UPDATEROLE_URL = '/role/updateSysRole',
  DELETEROLE_URL = '/role/deleteById/',
  GETALLROLE_URL = '/role/findAllRoles/',
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

export const GetAllRoleList = (userId:number) => 
  request.get(API.GETALLROLE_URL+userId)
