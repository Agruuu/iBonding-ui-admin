<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['point:sign-in-config:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> newly added
    </el-button>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column
        label="Check in days"
        align="center"
        prop="day"
        :formatter="(_, __, cellValue) => ['The', cellValue, 'day'].join(' ')"
      />
      <el-table-column label="Reward Points" align="center" prop="point" />
      <el-table-column label="Reward Experience" align="center" prop="experience" />
      <el-table-column label="state" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="operation" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['point:sign-in-config:update']"
          >
            edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['point:sign-in-config:delete']"
          >
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <SignInConfigForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as SignInConfigApi from '@/api/member/signin/config'
import SignInConfigForm from './SignInConfigForm.vue'
import { DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'SignInConfig' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref([]) // List of data

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await SignInConfigApi.getSignInConfigList()
    console.log(data)
    list.value = data
  } finally {
    loading.value = false
  }
}

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await SignInConfigApi.deleteSignInConfig(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
