<template>
  <div class="home-container">
    <div class="top-box">
      <i class="logo"></i>
      <van-search v-model="key" placeholder="请输入关键词搜索" @search="onSearch" />
      <span v-if="!userName" class="login-info-box" @click="switchShow">请登录</span>
      <span v-else class="login-info-box">{{ userName }}</span>
    </div>
    <van-tabs v-if="columnList.length" v-model:active="tabActive" title-active-color="#ea5728" :line-height="0">
      <van-tab v-for="item in columnList" :key="item.column_id" :title="item.name">
        <column-content :column-id="item.column_id" :shop-id="shopId" />
      </van-tab>
    </van-tabs>
    <van-empty v-if="!columnList.length && !loading" description="暂无栏目数据" />
  </div>
  <login v-model:show="show" />
</template>

<script setup lang="ts">
import { localStorage } from '@/utils/local-storage'
import apis from '@/api'
import ColumnContent from './components/ColumnContent.vue'
const show = ref(false)
const key = ref('')
const tabActive = ref('')
const loading = ref(false)
const columnList = ref(<any>[])
const userName = ref('')
const shopId = ref('')
// provide('shopId', shopId)

const switchShow = () => {
  show.value = !show.value
}
// provide('switchShow', switchShow)
const init = () => {
  const token = localStorage.get('session_token')
  let name = ''
  if(token) {
    name = localStorage.get('profile')?.data?.name
    // 自动登录账号登出处理
    const user_name = localStorage.get('profile')?.data?.user_name
    apis.get_tourist_user().then(({data}) => {
      if(user_name === data.user_name) {
        userName.value = ''
        localStorage.remove('session_token')
        localStorage.remove('profile')
      }
    })
  }
  userName.value = name
}

init()

// 获取栏目
const getColumnList = async () => {
  loading.value = true
  const result = await apis.get_platform_info()
  if(!result?.data?.shop_id) return
  let shop_id = result.data?.shop_id
  shopId.value = shop_id
  const { data } = await apis.get_platform_cmscolumn_list({
    shop_id,
    spu_categ_shop_categ_id: 4
  })
  loading.value = false
  if(data && data.length) {
    const _list = data
    const _index = data.findIndex(item => item.is_first)
    _index > -1 && _list.splice(_index, 1)
    columnList.value = _list
  }
}

getColumnList()

const onSearch = (val) => {
  console.log(val);
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 0 14px;
}
:deep(.van-tab) {
  justify-content: flex-start;
  flex: inherit;
  margin-right: 15px;
  font-weight: 500;
  font-size: 14px;
}
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    width: 24px;
    height: 26px;
    background: url('@/assets/imgs/logo.png') no-repeat;
    background-size: 100% auto;
  }
  .van-search {
    width: 100%;
    flex: 1;
  }
  .login-info-box {
    display: block;
    max-width: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
  }
}
</style>
