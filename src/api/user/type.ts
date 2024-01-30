//登录请求的数据类型
export interface loginForm {
  username: string
  password: string
  captcha: string
  codeKey: string
}

//登录响应的数据类型
export interface loginResponse {
  code: number
  data: {
    token?: string
    refresh_token?: string
  }
  message: string
}

//返回的验证码信息
export interface validateCodeResponse {
  code: number
  data: {
    codeKey: string // 验证码的key
    codeValue: string // 图片验证码对应的字符串数据
  }
  message: string
}

//分页请求参数
export interface userPageRequest {
  current: number
  pageSize: number
  //排序字段
  sortField?: string
  sortOrder?: string
  userAccount?: string
  userName?: string
}

//用户信息
