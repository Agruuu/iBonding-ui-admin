<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="Table Name" prop="tableName">
          <el-input v-model="formData.tableName" placeholder="Please enter the table name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Table Comment" prop="tableComment">
          <el-input v-model="formData.tableComment" placeholder="Please enter table comment" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="className">
          <template #label>
            <span>
              Entity Class Name
              <el-tooltip
                content="By default, the prefixes of table names are removed. If there are duplicates, you need to manually add the prefixes to avoid the problem of duplicate aliases reported by MyBatis."
                placement="top"
              >
                <Icon class="" icon="ep:question-filled" />
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="formData.className" placeholder="Please enter" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Author" prop="author">
          <el-input v-model="formData.author" placeholder="Please enter" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Remarks" prop="remark">
          <el-input v-model="formData.remark" :rows="3" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import * as CodegenApi from '@/api/infra/codegen'
import { PropType } from 'vue'

defineOptions({ name: 'InfraCodegenBasicInfoForm' })

const props = defineProps({
  table: {
    type: Object as PropType<Nullable<CodegenApi.CodegenTableVO>>,
    default: () => null
  }
})

const formRef = ref()
const formData = ref({
  tableName: '',
  tableComment: '',
  className: '',
  author: '',
  remark: ''
})
const rules = reactive({
  tableName: [required],
  tableComment: [required],
  className: [required],
  author: [required]
})

/** monitor table attribute，Copy to formData attribute */
watch(
  () => props.table,
  (table) => {
    if (!table) return
    formData.value = table
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  validate: async () => unref(formRef)?.validate()
})
</script>
