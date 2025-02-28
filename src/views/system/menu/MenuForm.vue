<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="Parent Menu">
        <el-tree-select
          v-model="formData.parentId"
          :data="menuTree"
          :default-expanded-keys="[0]"
          :props="defaultProps"
          check-strictly
          node-key="id"
        />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" clearable placeholder="Please enter the menu name" />
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_MENU_TYPE)"
            :key="dict.label"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="Icon">
        <IconSelect v-model="formData.icon" clearable />
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="Routing Url" prop="path">
        <template #label>
          <Tooltip
            message="The accessed route address, for example: `user`. When an external network address is required, it should start with `http(s)://`."
            title="Routing Url"
          />
        </template>
        <el-input v-model="formData.path" clearable placeholder="Please enter the routing address" />
      </el-form-item>
      <el-form-item v-if="formData.type === 2" label="Component Address" prop="component">
        <el-input v-model="formData.component" clearable placeholder="For example: system/user/index" />
      </el-form-item>
      <el-form-item v-if="formData.type === 2" label="Component Name" prop="componentName">
        <el-input v-model="formData.componentName" clearable placeholder="For example: SystemUser" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 1" label="Permission" prop="permission">
        <template #label>
          <Tooltip
            message="The permission string on the Controller method, for example: @PreAuthorize(`@ss.hasPermission('system:user:list')`)"
            title="Permission"
          />
        </template>
        <el-input v-model="formData.permission" clearable placeholder="Please enter the permission identifier" />
      </el-form-item>
      <el-form-item label="Sort" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" clearable controls-position="right" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.label"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="Visible" prop="visible">
        <template #label>
          <Tooltip message="When choosing to hide，Routing will not appear in the sidebar，But it can still be accessed" title="Visible" />
        </template>
        <el-radio-group v-model="formData.visible">
          <el-radio key="true" :value="true" border>Display</el-radio>
          <el-radio key="false" :value="false" border>Hide</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="Always Display" prop="alwaysShow">
        <template #label>
          <Tooltip
            message="When not selected，When the menu has only one submenu，Not showing oneself，Directly display submenus"
            title="Always Display"
          />
        </template>
        <el-radio-group v-model="formData.alwaysShow">
          <el-radio key="true" :value="true" border>Always</el-radio>
          <el-radio key="false" :value="false" border>No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type === 2" label="Cache Status" prop="keepAlive">
        <template #label>
          <Tooltip
            message="When you choose to use caching, the component will be cached by `keep-alive`. You must fill in the 'Component Name' field."
            title="Cache Status"
          />
        </template>
        <el-radio-group v-model="formData.keepAlive">
          <el-radio key="true" :value="true" border>Cache</el-radio>
          <el-radio key="false" :value="false" border>Not Cached</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as MenuApi from '@/api/system/menu'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { CommonStatusEnum, SystemMenuTypeEnum } from '@/utils/constants'
import { defaultProps, handleTree } from '@/utils/tree'

defineOptions({ name: 'SystemMenuForm' })

const { wsCache } = useCache()
const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - add；update - modify
const formData = ref({
  id: undefined,
  name: '',
  permission: '',
  type: SystemMenuTypeEnum.DIR,
  sort: Number(undefined),
  parentId: 0,
  path: '',
  icon: '',
  component: '',
  componentName: '',
  status: CommonStatusEnum.ENABLE,
  visible: true,
  keepAlive: true,
  alwaysShow: true
})
const formRules = reactive({
  name: [{ required: true, message: 'The menu name cannot be empty', trigger: 'blur' }],
  sort: [{ required: true, message: 'The menu order cannot be empty', trigger: 'blur' }],
  path: [{ required: true, message: 'The routing address cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string, id?: number, parentId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (parentId) {
    formData.value.parentId = parentId
  }
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MenuApi.getMenu(id)
    } finally {
      formLoading.value = false
    }
  }
  // Get menu list
  await getTree()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    if (
      formData.value.type === SystemMenuTypeEnum.DIR ||
      formData.value.type === SystemMenuTypeEnum.MENU
    ) {
      if (!isExternal(formData.value.path)) {
        if (formData.value.parentId === 0 && formData.value.path.charAt(0) !== '/') {
          message.error('The path must start with a forward slash (/).')
          return
        } else if (formData.value.parentId !== 0 && formData.value.path.charAt(0) === '/') {
          message.error('The path must not start with a forward slash (/).')
          return
        }
      }
    }
    const data = formData.value as unknown as MenuApi.MenuVO
    if (formType.value === 'create') {
      await MenuApi.createMenu(data)
      message.success(t('common.createSuccess'))
    } else {
      await MenuApi.updateMenu(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success')
  } finally {
    formLoading.value = false
    // empty，Thereby triggering a refresh
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
  }
}

/** Get dropdown menu[Superior menu]The data  */
const menuTree = ref<Tree[]>([]) // tree structure
const getTree = async () => {
  menuTree.value = []
  const res = await MenuApi.getSimpleMenusList()
  let menu: Tree = { id: 0, name: 'Main Category', children: [] }
  menu.children = handleTree(res)
  menuTree.value.push(menu)
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    permission: '',
    type: SystemMenuTypeEnum.DIR,
    sort: Number(undefined),
    parentId: 0,
    path: '',
    icon: '',
    component: '',
    componentName: '',
    status: CommonStatusEnum.ENABLE,
    visible: true,
    keepAlive: true,
    alwaysShow: true
  }
  formRef.value?.resetFields()
}

/** Determine whether the path is an external HTTP link or other similar external links. */
const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}
</script>
