// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true, parent: '#app' })

const files = import.meta.glob('./modules/**/*.ts', { eager: true })
let routes: Array<any> = []

for (const path in files) {
  let module: any = {}
  if(Object.prototype.hasOwnProperty.call(files, path)) {
    module = files[path]
  }
  routes.push(...module.default)
}

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
