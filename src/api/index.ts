// 直接引入所有模块
const files = import.meta.glob('./modules/**/*.ts', { eager: true })
let apis: any = {}

for (const path in files) {
  apis = Object.assign(apis, files[path])
  // 动态引入，懒加载
  // files[path]().then((mod) => {
  //   apis = Object.assign(apis, mod)
  // })
}

export default apis
