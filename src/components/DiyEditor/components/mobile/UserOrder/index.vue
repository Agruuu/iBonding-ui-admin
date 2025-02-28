<template>
  <el-image src="https://shopro.sheepjs.com/admin/static/images/shop/decorate/orderCardStyle.png" />
</template>
<script setup lang="ts">
import { UserOrderProperty } from './config'

/** User orders */
defineOptions({ name: 'UserOrder' })
// Define attributes
defineProps<{ property: UserOrderProperty }>()
</script>

<style scoped lang="scss"></style>
