<template>
  <el-image
    src="https://shopro.sheepjs.com/admin/static/images/shop/decorate/couponCardStyle.png"
  />
</template>
<script setup lang="ts">
import { UserCouponProperty } from './config'

/** User coupons */
defineOptions({ name: 'UserCoupon' })
// Define attributes
defineProps<{ property: UserCouponProperty }>()
</script>

<style scoped lang="scss"></style>
