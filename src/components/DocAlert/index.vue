<template>
  <el-alert v-if="getEnable()" type="success" show-icon>
    <template #title>
      <div @click="goToUrl">{{ '【' + title + '】 document address：' + url }}</div>
    </template>
  </el-alert>
</template>
<script setup lang="tsx">
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'DocAlert' })

const props = defineProps({
  title: propTypes.string,
  url: propTypes.string
})

/** Jump to URL link */
const goToUrl = () => {
  window.open(props.url)
}

/** Is it enabled */
const getEnable = () => {
  return import.meta.env.VITE_APP_DOCALERT_ENABLE !== 'false'
}
</script>
<style scoped>
.el-alert--success.is-light {
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid green;
}
</style>
