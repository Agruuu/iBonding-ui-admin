<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <!-- top left corner：essential information -->
      <el-col :span="14" class="detail-info-item">
        <UserBasicInfo :user="user">
          <template #header>
            <div class="card-header">
              <CardTitle title="essential information" />
              <el-button size="small" text type="primary" @click="openForm('update')">
                edit
              </el-button>
            </div>
          </template>
        </UserBasicInfo>
      </el-col>
      <!-- Top right corner：Account information -->
      <el-col :span="10" class="detail-info-item">
        <el-card class="h-full" shadow="never">
          <template #header>
            <CardTitle title="Account information" />
          </template>
          <UserAccountInfo :user="user" :wallet="wallet" />
        </el-card>
      </el-col>
      <!-- Below：Account details -->
      <!-- TODO Taro：【Order management】【After sales management】【Collection record】-->
      <el-card header="Account details" shadow="never" style="width: 100%; margin-top: 20px">
        <template #header>
          <CardTitle title="Account details" />
        </template>
        <el-tabs>
          <el-tab-pane label="integral">
            <UserPointList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="Sign in" lazy>
            <UserSignList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="Growth value" lazy>
            <UserExperienceRecordList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="balance" lazy>
            <UserBalanceList :wallet-id="wallet.id" />
          </el-tab-pane>
          <el-tab-pane label="Receiving address" lazy>
            <UserAddressList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="Order management" lazy>
            <UserOrderList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="Collection record" lazy>
            <UserFavoriteList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="Discount coupons" lazy>
            <UserCouponList :user-id="id" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
  </div>

  <!-- Form pop-up window：add to/modify -->
  <UserForm ref="formRef" @success="getUserData(id)" />
</template>
<script lang="ts" setup>
import * as WalletApi from '@/api/pay/wallet/balance'
import * as UserApi from '@/api/member/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import UserForm from '@/views/member/user/UserForm.vue'
import UserAccountInfo from './UserAccountInfo.vue'
import UserAddressList from './UserAddressList.vue'
import UserBasicInfo from './UserBasicInfo.vue'
import UserExperienceRecordList from './UserExperienceRecordList.vue'
import UserPointList from './UserPointList.vue'
import UserSignList from './UserSignList.vue'
import UserBalanceList from './UserBalanceList.vue'
import { CardTitle } from '@/components/Card/index'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'MemberDetail' })

const loading = ref(true) // Loading in progress
const user = ref<UserApi.UserVO>({} as UserApi.UserVO)

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string) => {
  formRef.value.open(type, id)
}

/** Obtain users */
const getUserData = async (id: number) => {
  loading.value = true
  try {
    user.value = await UserApi.getUser(id)
  } finally {
    loading.value = false
  }
}

/** initialization */
const { currentRoute } = useRouter() // route
const { delView } = useTagsViewStore() // View operation
const route = useRoute()
const id = route.params.id
/* User wallet related information */
const WALLET_INIT_DATA = {
  balance: 0,
  totalExpense: 0,
  totalRecharge: 0
} as WalletApi.WalletVO // Wallet initialization data
const wallet = ref<WalletApi.WalletVO>(WALLET_INIT_DATA) // Wallet information

/** Query user wallet information */
const getUserWallet = async () => {
  if (!id) {
    wallet.value = WALLET_INIT_DATA
    return
  }
  const params = { userId: id }
  wallet.value = (await WalletApi.getWallet(params)) || WALLET_INIT_DATA
}

onMounted(() => {
  if (!id) {
    ElMessage.warning('Parameter error，Member ID cannot be empty！')
    delView(unref(currentRoute))
    return
  }
  getUserData(id)
  getUserWallet()
})
</script>
<style lang="css" scoped>
.detail-info-item:first-child {
  padding-left: 0 !important;
}

/* first-child Does anyone have a big shot to show it if it doesn't take effectq.q */
.detail-info-item:nth-child(2) {
  padding-right: 0 !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
