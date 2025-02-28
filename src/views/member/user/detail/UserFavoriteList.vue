<template>
  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column key="id" align="center" label="Product Code" width="180" prop="id" />
      <el-table-column label="Product image" min-width="80">
        <template #default="{ row }">
          <el-image :src="row.picUrl" class="h-30px w-30px" @click="imagePreview(row.picUrl)" />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="Product Name" min-width="300" prop="name" />
      <el-table-column align="center" label="Product selling price" min-width="90" prop="price">
        <template #default="{ row }"> {{ floatToFixed2(row.price) }}element</template>
      </el-table-column>
      <el-table-column align="center" label="sales volume" min-width="90" prop="salesCount" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Collection time"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" label="state" min-width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PRODUCT_SPU_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as FavoriteApi from '@/api/mall/product/favorite'
import { floatToFixed2 } from '@/utils'

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  createTime: [],
  userId: NaN
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await FavoriteApi.getFavoritePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const { userId } = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

/** initialization **/
onMounted(() => {
  queryParams.userId = userId
  getList()
})
</script>
