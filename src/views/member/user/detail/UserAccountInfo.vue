<template>
  <el-descriptions :class="{ 'kefu-descriptions': column === 1 }" :column="column">
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" Grade " />
      </template>
      {{ user.levelName || 'nothing' }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="ep:suitcase" label=" Growth value " />
      </template>
      {{ user.experience || 0 }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="ep:coin" label=" Current points " />
      </template>
      {{ user.point || 0 }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="ep:coin" label=" Total points " />
      </template>
      {{ user.totalPoint || 0 }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_balance" label=" Current balance " />
      </template>
      {{ fenToYuan(wallet.balance || 0) }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_expenditure_balance" label=" Expenditure amount " />
      </template>
      {{ fenToYuan(wallet.totalExpense || 0) }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_recharge_balance" label=" Recharge amount " />
      </template>
      {{ fenToYuan(wallet.totalRecharge || 0) }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
import { DescriptionsItemLabel } from '@/components/Descriptions'
import * as UserApi from '@/api/member/user'
import * as WalletApi from '@/api/pay/wallet/balance'
import { fenToYuan } from '@/utils'

withDefaults(defineProps<{ user: UserApi.UserVO; wallet: WalletApi.WalletVO; column?: number }>(), {
  column: 2
}) // User Information
</script>
<style lang="scss" scoped>
.cell-item {
  display: inline;
}

.cell-item::after {
  content: ':';
}

.kefu-descriptions {
  ::v-deep(.el-descriptions__cell) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-descriptions__label {
      width: 120px;
      display: block;
      text-align: left;
    }

    .el-descriptions__content {
      flex: 1;
      text-align: end;
    }
  }
}
</style>
