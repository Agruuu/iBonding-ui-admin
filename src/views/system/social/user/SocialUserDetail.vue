<template>
  <Dialog v-model="dialogVisible" title="details" width="800">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Social media platforms" min-width="160">
        <dict-tag :type="DICT_TYPE.SYSTEM_SOCIAL_TYPE" :value="detailData.type" />
      </el-descriptions-item>
      <el-descriptions-item label="User nickname" min-width="120">
        {{ detailData.nickname }}
      </el-descriptions-item>
      <el-descriptions label="User profile picture" min-width="120">
        <el-image :src="detailData.avatar" class="h-30px w-30px" />
      </el-descriptions>
      <el-descriptions-item label="social contact token" min-width="120">
        {{ detailData.token }}
      </el-descriptions-item>
      <el-descriptions-item label="original Token data" min-width="120">
        <el-input
          v-model="detailData.rawTokenInfo"
          :autosize="{ maxRows: 20 }"
          :readonly="true"
          type="textarea"
        />
      </el-descriptions-item>
      <el-descriptions-item label="Original User Data" min-width="120">
        <el-input
          v-model="detailData.rawUserInfo"
          :autosize="{ maxRows: 20 }"
          :readonly="true"
          type="textarea"
        />
      </el-descriptions-item>
      <el-descriptions-item label="Final Authentication Code" min-width="120">
        {{ detailData.code }}
      </el-descriptions-item>
      <el-descriptions-item label="Final Authentication Status" min-width="120">
        {{ detailData.state }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import * as SocialUserApi from '@/api/system/social/user'

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as SocialUserApi.SocialUserVO) // Detailed data

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  try {
    detailData.value = await SocialUserApi.getSocialUser(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
