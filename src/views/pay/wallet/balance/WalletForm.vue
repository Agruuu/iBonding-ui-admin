<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800">
    <WalletTransactionList :wallet-id="walletId" />
    <template #footer>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import WalletTransactionList from '../transaction/WalletTransactionList.vue'
const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const walletId = ref(0)
/** Open pop-up window */
const open = async (theWalletId: number) => {
  dialogVisible.value = true
  dialogTitle.value = 'Wallet balance details'
  walletId.value = theWalletId
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
