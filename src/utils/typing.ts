export interface ResponseBody<T = any> {
  msg?: string
  code?: number
  data?: T
  success?: boolean
}

/** 统一返回结构体 */

export interface Page {
  current: number
  page_size: number
  total: number
}

export interface PageResult<T = any> {
  msg?: string
  code?: number
  data: T | T[]
  page?: Page
  success?: boolean
}
