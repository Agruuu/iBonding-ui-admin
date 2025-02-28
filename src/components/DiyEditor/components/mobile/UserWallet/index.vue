<template>
  <el-image
    src="https://shopro.sheepjs.com/admin/static/images/shop/decorate/walletCardStyle.png"
  />
</template>
<script setup lang="ts">
import { UserWalletProperty } from './config'

/** User Assets */
defineOptions({ name: 'UserWallet' })
// Define attributes
defineProps<{ property: UserWalletProperty }>()
</script>

<style scoped lang="scss"></style>
