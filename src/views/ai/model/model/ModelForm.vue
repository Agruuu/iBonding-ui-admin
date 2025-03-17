<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="Platform" prop="platform">
        <el-select v-model="formData.platform" placeholder="Please enter the platform" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AI_PLATFORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="Please enter the model type"
          clearable
          :disabled="formData.id"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AI_MODEL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="API Key" prop="keyId">
        <el-select v-model="formData.keyId" placeholder="Please select an API key" clearable>
          <el-option
            v-for="apiKey in apiKeyList"
            :key="apiKey.id"
            :label="apiKey.name"
            :value="apiKey.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the model name" />
      </el-form-item>
      <el-form-item label="Model" prop="model">
        <el-input v-model="formData.model" placeholder="Please enter the model identifier" />
      </el-form-item>
      <el-form-item label="Sort" prop="sort">
        <el-input-number v-model="formData.sort" placeholder="Please enter the model sort" class="!w-1/1" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Temperature"
        prop="temperature"
        v-if="formData.type === AiModelTypeEnum.CHAT"
      >
        <el-input-number
          v-model="formData.temperature"
          placeholder="Please enter the temperature parameter"
          :min="0"
          :max="2"
          :precision="2"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item
        label="Max Tokens"
        prop="maxTokens"
        v-if="formData.type === AiModelTypeEnum.CHAT"
      >
        <el-input-number
          v-model="formData.maxTokens"
          placeholder="Please enter the reply token count"
          :min="0"
          :max="8192"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item
        label="Max Contexts"
        prop="maxContexts"
        v-if="formData.type === AiModelTypeEnum.CHAT"
      >
        <el-input-number
          v-model="formData.maxContexts"
          placeholder="Please enter the context quantity"
          :min="0"
          :max="20"
          class="!w-1/1"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ModelApi, ModelVO } from '@/api/ai/model/model'
import { ApiKeyApi, ApiKeyVO } from '@/api/ai/model/apiKey'
import { CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { AiModelTypeEnum } from '@/views/ai/utils/constants'

/** API 模型的表单 */
defineOptions({ name: 'ModelForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  keyId: undefined,
  name: undefined,
  model: undefined,
  platform: undefined,
  type: undefined,
  sort: undefined,
  status: CommonStatusEnum.ENABLE,
  temperature: undefined,
  maxTokens: undefined,
  maxContexts: undefined
})
const formRules = reactive({
  keyId: [{ required: true, message: 'API key cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Model name cannot be empty', trigger: 'blur' }],
  model: [{ required: true, message: 'Model identifier cannot be empty', trigger: 'blur' }],
  platform: [{ required: true, message: 'The affiliated platform cannot be empty', trigger: 'blur' }],
  type: [{ required: true, message: 'Model type cannot be empty', trigger: 'blur' }],
  sort: [{ required: true, message: 'Sort cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'Status cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const apiKeyList = ref([] as ApiKeyVO[]) // API 密钥列表

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ModelApi.getModel(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获得下拉数据
  apiKeyList.value = await ApiKeyApi.getApiKeySimpleList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ModelVO
    if (data.type !== AiModelTypeEnum.CHAT) {
      delete data.temperature
      delete data.maxTokens
      delete data.maxContexts
    }
    if (formType.value === 'create') {
      await ModelApi.createModel(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelApi.updateModel(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    keyId: undefined,
    name: undefined,
    model: undefined,
    platform: undefined,
    type: undefined,
    sort: undefined,
    status: CommonStatusEnum.ENABLE,
    temperature: undefined,
    maxTokens: undefined,
    maxContexts: undefined
  }
  formRef.value?.resetFields()
}
</script>
