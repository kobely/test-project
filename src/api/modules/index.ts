import request from '@/utils/request'

// mock请求
export function queryProse(): Promise<any> {
  return request('/project/prose')
}

// 获取平台商户信息
export const get_platform_info = (): Promise<any> => {
  return request({
    url: `/cms-user/v2/shop/platform`,
    method: 'get'
  })
}

// 获取平台栏目列表
export const get_platform_cmscolumn_list = (params: any): Promise<any> => {
  return request({
    url: `/cms-user/v2/cmscolumn/list`,
    method: 'post',
    data: params
  })
}

// 查询栏目详情
export const get_cmscolumn_detail = (params: any): Promise<any> => {
  return request({
    url: `/cms-user/v2/cmscolumn/findById`,
    method: 'get',
    params
  })
}

// 查询栏目广告列表
export const get_column_ad_list = (params: any): Promise<any> => {
  return request({
    url: `/cms-user/v2/cmscolumn/component/list`,
    method: 'get',
    params
  })
}


// 最新文章列表
export const get_article_list = (params: any): Promise<any> => {
  return request({
    url: `/cms-user/v2/article/list`,
    method: 'post',
    data: params
  })
}

// 自动登录账号
export const get_tourist_user = (): Promise<any> => {
  return request({
    url: `/cms-user/v2/shop/tourist_user`,
    method: 'get'
  })
}
