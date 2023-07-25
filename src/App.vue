
<template>
  <!-- <van-config-provider :theme="theme"> -->
  <main :class="{'app-main' : route.meta.needMenu}">
    <router-view />
  </main>
  <van-tabbar v-if="route.meta.needMenu" v-model="menuActive" active-color="#ea5728" :before-change="beforeChange">
    <van-tabbar-item name="home" replace to="/">网站首页</van-tabbar-item>
    <!-- <van-tabbar-item name="home" replace to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item name="user" replace to="/" icon="user-o">我的</van-tabbar-item> -->
  </van-tabbar>
  <!-- </van-config-provider> -->
</template>

<script setup lang="ts">
const menuActive = ref('home')
const route = useRoute()

const beforeChange = (name: number | string): (boolean | Promise<boolean>) => {
  return name === 'user' ? false : true
}
// import type { ConfigProviderTheme } from 'vant'
// import { localStorage } from '@/utils/local-storage'
// import { useStore } from '@/stores'

// const store = useStore()
// const theme = ref<ConfigProviderTheme>('light')
// const mode = computed(() => store.mode)

// watch(mode, (val) => {
//   if (val === 'dark' || localStorage.get('theme') === 'dark') {
//     theme.value = 'dark'
//     document.querySelector('html')
//       .setAttribute('data-theme', 'dark')
//   }
//   else {
//     theme.value = 'light'
//     document.querySelector('html')
//       .setAttribute('data-theme', 'light')
//   }
// }, { immediate: true })

// provide('isRealDark', computed(() => theme.value === 'dark'))
</script>

<style lang="less" scoped>
.app-main {
  height: calc(100vh - 50px - constant(safe-area-inset-bottom));
  height: calc(100vh - 50px - env(safe-area-inset-bottom));
  overflow-y: auto;
}
.van-tabbar-item {
  color: #eee;
}
:deep(.van-tabbar-item__text) {
  font-size: 14px;
}
</style>
