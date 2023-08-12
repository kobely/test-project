
import { RouteRecordRaw } from 'vue-router'

// 导入路由组件
import home from '@/views/home/index.vue'
import mock from '@/views/mock/index.vue'
import appDownload from '@/views/appDownload.vue'

// 定义路由，每个路由都需要映射到一个组件
const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      title: '首页',
      needMenu: true
    }
  },
  {
    path: '/mock',
    name: 'mock',
    component: mock,
  },
  {
    path: '/app-download',
    name: 'appDownload',
    component: appDownload,
    meta: {
      title: 'APP下载'
    }
  }
]

// 导出路由
export default routes
