<template>
  <div class="download-contain">
    <div class="download-box">
      <p class="download-desc">精准供求交易服务平台</p>
      <van-button class="download-btn" type="primary" @click="openApp">立即下载</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const downloadUrl = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.android.icHub'

const openApp = () => {
  window.location.href = downloadUrl
}
</script>

<style lang="less" scoped>
.download-contain {
  margin: 0 auto;
  max-width: 1000px;
  height: 100vh;
  background: url('@/assets/imgs/download_bg.png') no-repeat;
  background-size: 100% 100%;
  .download-bg {
    position: relative;
    width: 100%;
    object-fit: contain;
  }
  .download-box {
    position: absolute;
    left: 0;
    top: 45%;
    width: 100%;
    text-align: center;
    .download-desc {
      padding: 10px 0 30px;
      font-size: 16px;
      color: #999;
    }
    .download-btn {
      width: 160px;
    }
  }
  .guide-bg {
    position: fixed;
    left: 0;
    height: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
