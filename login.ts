import request from '@/utils/request'

// 图形验证码id hash ipfs
export const get_captcha_id = (): Promise<any> => {
  return request({
    url: `/connection/v1/captcha/id`,
    method: 'get'
  })
}

// 获取登录验证码
export const getLoginVerifyCode = (params: any): Promise<any> => {
  return request({
    url: `/connection/v1/login/vcode/send`,
    method: 'post',
    data: params
  })
}

// 短信验证码登录
export const verifyCodeLogin = (params: any): Promise<any> => {
  return request({
    url: `/connection/v1/login`,
    method: 'post',
    data: params
  })
}

// 账号密码登录
export const post_login = (params: any): Promise<any> => {
  return request({
    url: `/connection/v1/sessions`,
    method: 'post',
    data: params
  })
}

// 获取登录信息
export const get_users_traits = (): Promise<any> => {
  return request({
    url: `/connection/v1/users/traits`,
    method: 'get'
  })
}
