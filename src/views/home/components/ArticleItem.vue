<template>
  <div class="article-item" @click="handleDetailJump">
    <div class="article-left-part">
      <p class="article-desc">{{ props.articleDetail.name }}</p>
      <div class="article-other-info-box">
        <p>
          <span class="article-type">{{ TYPE[props.articleDetail.type] }}</span>
          <span class="article-author">{{ props.articleDetail.column_name }}</span>
        </p>
        <span class="article-read-number">{{ props.articleDetail.read_count }}阅读</span>
      </div>
    </div>
    <img v-if="props.articleDetail.thumbnail_array.length" :src="`${imgUrl}${props.articleDetail.thumbnail_array[0].ipfs}`" class="article-img" alt="">
  </div>
</template>

<script lang="ts" setup>
import { TYPE, imgUrl } from '@/utils/const'
const props = defineProps({
  articleDetail: {
    type: Object,
    require: true
  }
})

const handleDetailJump = () => {
  const { publishing_id, column_id, biz_id, type, subtype } = props.articleDetail
  let origin: string = '',
      pathUrl: string = '/view'
  if(process.env.NODE_ENV === 'development') {
    origin = process.env.VUE_ARTICLE_DETAIL_URL
  } else {
    origin = window.location.origin
  }
  if (type == 400) {
    //邀请
    if (!subtype || [304].includes(subtype)) {
      // 邀请子类型无或者是表单沿用之前逻辑，问卷投票类型保持跟问卷一致
      pathUrl = '/view/invitation'
    } else if ([301, 303].includes(subtype)) {
      pathUrl = '/view/questionnaire'
    }
  } else if (type == 300 && [301, 303, 304].includes(subtype)) {
    //除了考试类型，其它类型直接去表单
    pathUrl = '/view/questionnaire'
  }
  window.location.href = `${origin}/content${pathUrl}?id=${publishing_id}&column_id=${column_id}&biz_id=${biz_id}&slug&qr_code&columnType=4&openFrom=h5`
}
</script>

<style lang="less" scoped>
.article-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ececec;
  .article-left-part {
    margin-right: 9px;
    flex: 1;
    .article-desc {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      height: 44px;
      line-height: 22px;
      font-size: 16px;
      color: #222;
    }
    .article-other-info-box {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        display: flex;
        align-items: center;
      }
      .article-type {
        display: inline-block;
        margin-right: 6px;
        width: 26px;
        height: 13px;
        background-color: #fff1eb;
        border-radius: 2px;
        text-align: center;
        line-height: 13px;
        font-size: 10px;
        color: @icColor;
      }
      .article-author, .article-read-number {
        display: inline-block;
        height: 11px;
        line-height: 11px;
        font-size: 10px;
        color: @fc9;
      }
    }
  }
  .article-img {
    display: block;
    width: 115px;
    height: 72px;
    border-radius: 5px;
  }
}
</style>
