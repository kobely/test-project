<template>
  <div class="article-detail">
    <iframe v-if="props.type === 'userAgreement'" :src="url" class="protocol" frameborder="0"></iframe>
    <iframe v-else :src="url" class="protocol" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    require: true,
    default: '774998718254678017'
  }
})
const typeIds = {
  userAgreement: "774998718254678017",
  privacyPolicy: "774999535631138817"
}

const url = ref('')
watch(() => props.type, () => {
  url.value = `https://www.ichub.com/srvContent/view?id=${typeIds[props.type]}&source_type=app&showType=out_link`
}, {immediate: true})
</script>

<style lang="less" scoped>
.protocol {
  width: 100%;
  height: 100vh;
}
</style>