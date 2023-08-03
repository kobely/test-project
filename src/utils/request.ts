import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { localStorage } from '@/utils/local-storage'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
const errorHandler = (error: RequestError): Promise<any> => {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    else if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: '未授权，请登录',
      })
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
    else {
      showNotify({
        type: 'danger',
        message: statusText
      })
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  let sessionToken = ''
  config.url = config.url.startsWith("/") ? config.url : "/" + config.url
  sessionToken = localStorage.get('session_token')
  config.headers['X-Session-Token'] = sessionToken && typeof(sessionToken) === 'string' ? sessionToken : ''
  // 内容域的接口加上商户id，其它域暂时不用
  if (config.url.startsWith('/cms-')) {
    try {
      config.headers['shop-id'] = localStorage.get('profile').latest_shop_id || ''
    } catch (error) { }
  }
  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
const responseHandler = (response: { data: any }): Promise<any> => {
  const result = response.data
  if(result.code === 401) {
    // 此处需要弹出登录弹层todo
    localStorage.remove('session_token')
    return
  } else if (result.code !== 200) {
    showNotify({
      type: 'warning',
      message: result.msg,
    })
  }
  return result
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
