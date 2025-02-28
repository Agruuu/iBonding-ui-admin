<template>
  <el-table ref="dragTable" :data="formData" :max-height="tableHeight" row-key="columnId">
    <el-table-column
      :show-overflow-tooltip="true"
      label="Field Column Name"
      min-width="10%"
      prop="columnName"
    />
    <el-table-column label="Field Description" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.columnComment" />
      </template>
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      label="Physical Type"
      min-width="10%"
      prop="dataType"
    />
    <el-table-column label="Java Type" min-width="11%">
      <template #default="scope">
        <el-select v-model="scope.row.javaType">
          <el-option label="Long" value="Long" />
          <el-option label="String" value="String" />
          <el-option label="Integer" value="Integer" />
          <el-option label="Double" value="Double" />
          <el-option label="BigDecimal" value="BigDecimal" />
          <el-option label="LocalDateTime" value="LocalDateTime" />
          <el-option label="Boolean" value="Boolean" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Java Attribute" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.javaField" />
      </template>
    </el-table-column>
    <el-table-column label="Insert" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.createOperation" false-value="false" true-value="true" />
      </template>
    </el-table-column>
    <el-table-column label="Edit" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.updateOperation" false-value="false" true-value="true" />
      </template>
    </el-table-column>
    <el-table-column label="List" min-width="4%">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row.listOperationResult"
          false-value="false"
          true-value="true"
        />
      </template>
    </el-table-column>
    <el-table-column label="Query" min-width="4%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.listOperation" false-value="false" true-value="true" />
      </template>
    </el-table-column>
    <el-table-column label="Query Method" min-width="10%">
      <template #default="scope">
        <el-select v-model="scope.row.listOperationCondition">
          <el-option label="=" value="=" />
          <el-option label="!=" value="!=" />
          <el-option label=">" value=">" />
          <el-option label=">=" value=">=" />
          <el-option label="<" value="<>" />
          <el-option label="<=" value="<=" />
          <el-option label="LIKE" value="LIKE" />
          <el-option label="BETWEEN" value="BETWEEN" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Allow Empty" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.nullable" false-value="false" true-value="true" />
      </template>
    </el-table-column>
    <el-table-column label="Display Type" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.htmlType">
          <el-option label="Text" value="input" />
          <el-option label="Textarea" value="textarea" />
          <el-option label="Select" value="select" />
          <el-option label="Radio " value="radio" />
          <el-option label="Checkbox" value="checkbox" />
          <el-option label="Datetime" value="datetime" />
          <el-option label="ImageUpload" value="imageUpload" />
          <el-option label="FileUpload" value="fileUpload" />
          <el-option label="Editor" value="editor" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Dictionary Type" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.dictType" clearable filterable placeholder="Please choose">
          <el-option
            v-for="dict in dictOptions"
            :key="dict.id"
            :label="dict.name"
            :value="dict.type"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Example" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.example" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import * as CodegenApi from '@/api/infra/codegen'
import * as DictDataApi from '@/api/system/dict/dict.type'

defineOptions({ name: 'InfraCodegenColumInfoForm' })

const props = defineProps({
  columns: {
    type: Array as unknown as PropType<CodegenApi.CodegenColumnVO[]>,
    default: () => null
  }
})

const formData = ref<CodegenApi.CodegenColumnVO[]>([])
const tableHeight = document.documentElement.scrollHeight - 350 + 'px'

/** Search dictionary dropdown list */
const dictOptions = ref<DictDataApi.DictTypeVO[]>()
const getDictOptions = async () => {
  dictOptions.value = await DictDataApi.getSimpleDictTypeList()
}

watch(
  () => props.columns,
  (columns) => {
    if (!columns) return
    formData.value = columns
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(async () => {
  await getDictOptions()
})
</script>
