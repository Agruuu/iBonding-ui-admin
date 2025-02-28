<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="Please enter the menu name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="Please select menu status"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          Search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
        <el-button
          v-hasPermi="['system:menu:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          Add
        </el-button>
        <el-button plain type="danger" @click="toggleExpandAll">
          <Icon class="mr-5px" icon="ep:sort" />
          Open/Fold
        </el-button>
        <el-button plain @click="refreshMenu">
          <Icon class="mr-5px" icon="ep:refresh" />
          Refresh Menu Cache
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-auto-resizer>
      <template #default="{ width }">
        <el-table-v2
          v-model:expanded-row-keys="expandedRowKeys"
          :columns="columns"
          :data="list"
          :expand-column-key="columns[0].key"
          :height="1000"
          :width="width"
          fixed
          row-key="id"
        />
      </template>
    </el-auto-resizer>
  </ContentWrap>

  <!-- Form pop-up window：add/modify -->
  <MenuForm ref="formRef" @success="getList" />
</template>
<script lang="tsx" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { handleTree } from '@/utils/tree'
import * as MenuApi from '@/api/system/menu'
import { MenuVO } from '@/api/system/menu'
import MenuForm from './MenuForm.vue'
import DictTag from '@/components/DictTag/src/DictTag.vue'
import { Icon } from '@/components/Icon'
import { ElButton, TableV2FixedDir } from 'element-plus'
import { checkPermi } from '@/utils/permission'
import { CommonStatusEnum } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

defineOptions({ name: 'SystemMenu' })

// Virtual List Table
const columns = [
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 250,
    fixed: TableV2FixedDir.LEFT
  },
  {
    key: 'icon',
    title: 'Icon',
    dataKey: 'icon',
    width: 100,
    align: 'center',
    cellRenderer: ({ cellData: icon }) => <Icon icon={icon} />
  },
  {
    key: 'sort',
    title: 'Sort',
    dataKey: 'sort',
    width: 60
  },
  {
    key: 'permission',
    title: 'Permission',
    dataKey: 'permission',
    width: 300
  },
  {
    key: 'component',
    title: 'Component Path',
    dataKey: 'component',
    width: 500
  },
  {
    key: 'componentName',
    title: 'Component Name',
    dataKey: 'componentName',
    width: 200
  },
  {
    key: 'status',
    title: 'Status',
    dataKey: 'status',
    width: 60,
    fixed: TableV2FixedDir.RIGHT,
    cellRenderer: ({ rowData }) => {
      // Check permissions
      if (!checkPermi(['system:menu:update'])) {
        return <DictTag type={DICT_TYPE.COMMON_STATUS} value={rowData.status} />
      }

      // If you have permission，Rendering ElSwitch
      return (
        <ElSwitch
          v-model={rowData.status}
          active-value={CommonStatusEnum.ENABLE}
          inactive-value={CommonStatusEnum.DISABLE}
          loading={menuStatusUpdating[rowData.id]}
          class="ml-4px"
          onChange={(val) => handleStatusChanged(rowData, val)}
        />
      )
    }
  },
  {
    key: 'operations',
    title: 'Operation',
    align: 'center',
    width: 160,
    fixed: TableV2FixedDir.RIGHT,
    cellRenderer: ({ rowData }) => {
      // Define button list
      const buttons = []

      // Check permissions and add buttons
      if (checkPermi(['system:menu:update'])) {
        buttons.push(
          <ElButton key="edit" link type="primary" onClick={() => openForm('update', rowData.id)}>
            Edit
          </ElButton>
        )
      }
      if (checkPermi(['system:menu:create'])) {
        buttons.push(
          <ElButton
            key="create"
            link
            type="primary"
            onClick={() => openForm('create', undefined, rowData.id)}
          >
            Add
          </ElButton>
        )
      }
      if (checkPermi(['system:menu:delete'])) {
        buttons.push(
          <ElButton key="delete" link type="danger" onClick={() => handleDelete(rowData.id)}>
            Delete
          </ElButton>
        )
      }
      // If there is no permission，return null
      if (buttons.length === 0) {
        return null
      }
      // List of rendering buttons
      return <>{buttons}</>
    }
  }
]

const { wsCache } = useCache()
const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const list = ref<any[]>([]) // List of data
const queryParams = reactive({
  name: undefined,
  status: undefined
})
const queryFormRef = ref() // Search form
const isExpandAll = ref(false) // Expand or not，Default fold all
const refreshTable = ref(true) // Re render the table state

// Add Expand Row Control
const expandedRowKeys = ref<number[]>([])

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await MenuApi.getMenuList(queryParams)
    list.value = handleTree(data)
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
const openForm = (type: string, id?: number, parentId?: number) => {
  formRef.value.open(type, id, parentId)
}

/** open/Folding operation */
const toggleExpandAll = () => {
  if (!isExpandAll.value) {
    // Expand all
    expandedRowKeys.value = list.value.map((item) => item.id)
  } else {
    // Fold all
    expandedRowKeys.value = []
  }
  isExpandAll.value = !isExpandAll.value
}

/** Refresh menu cache button operation */
const refreshMenu = async () => {
  try {
    await message.confirm('Updating cache and refreshing browser soon！', 'Refresh menu cache')
    // empty，Thereby triggering a refresh
    wsCache.delete(CACHE_KEY.USER)
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
    // Refresh browser
    location.reload()
  } catch {}
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await MenuApi.deleteMenu(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** open/Close menu status */
const menuStatusUpdating = ref({}) // The mapping of "menu" during the menu status update. The key is the menu number, and the value indicates whether the update is in progress.
const handleStatusChanged = async (menu: MenuVO, val: number) => {
  // 1. Mark `menu.id` as being updated.
  menuStatusUpdating.value[menu.id] = true
  try {
    // 2. Initiate update status
    menu.status = val
    await MenuApi.updateMenu(menu)
  } finally {
    // 3. Mark the update of `menu.id` as completed.
    menuStatusUpdating.value[menu.id] = false
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
