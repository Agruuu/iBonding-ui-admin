<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="Level name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter the level name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="state" prop="status">
        <el-select v-model="queryParams.status" placeholder="Please select the status" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button type="primary" @click="openForm('create')" v-hasPermi="['member:level:create']">
          <Icon icon="ep:plus" class="mr-5px" /> newly added
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="number" align="center" prop="id" min-width="60" />
      <el-table-column label="Level icon" align="center" prop="icon" min-width="80">
        <template #default="scope">
          <el-image
            :src="scope.row.icon"
            class="h-30px w-30px"
            :preview-src-list="[scope.row.icon]"
          />
        </template>
      </el-table-column>
      <el-table-column label="Level background image" align="center" prop="backgroundUrl" min-width="100">
        <template #default="scope">
          <el-image
            :src="scope.row.backgroundUrl"
            class="h-30px w-30px"
            :preview-src-list="[scope.row.backgroundUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="Level name" align="center" prop="name" min-width="100" />
      <el-table-column label="Grade" align="center" prop="level" min-width="60" />
      <el-table-column label="Upgrade Experience" align="center" prop="experience" min-width="80" />
      <el-table-column label="Enjoy discounts(%)" align="center" prop="discountPercent" min-width="110" />
      <el-table-column label="state" align="center" prop="status" min-width="70">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        min-width="170"
      />
      <el-table-column label="operation" align="center" min-width="110px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['member:level:update']"
          >
            edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['member:level:delete']"
          >
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <LevelForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as LevelApi from '@/api/member/level'
import LevelForm from './LevelForm.vue'

/** Membership level management **/
defineOptions({ name: 'MemberLevel' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref([]) // List of data
const queryParams = reactive({
  name: null,
  status: null
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    list.value = await LevelApi.getLevelList(queryParams)
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
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
    await LevelApi.deleteLevel(id)
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
