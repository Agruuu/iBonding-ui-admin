<!-- data dictionary Select selector -->
<template>
  <el-select v-if="selectType === 'select'" class="w-1/1" v-bind="attrs">
    <el-option
      v-for="(dict, index) in getDictOptions"
      :key="index"
      :label="dict.label"
      :value="dict.value"
    />
  </el-select>
  <el-radio-group v-if="selectType === 'radio'" class="w-1/1" v-bind="attrs">
    <el-radio v-for="(dict, index) in getDictOptions" :key="index" :value="dict.value">
      {{ dict.label }}
    </el-radio>
  </el-radio-group>
  <el-checkbox-group v-if="selectType === 'checkbox'" class="w-1/1" v-bind="attrs">
    <el-checkbox
      v-for="(dict, index) in getDictOptions"
      :key="index"
      :label="dict.label"
      :value="dict.value"
    />
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { getBoolDictOptions, getIntDictOptions, getStrDictOptions } from '@/utils/dict'

defineOptions({ name: 'DictSelect' })

const attrs = useAttrs()

// Accept parent component parameters
interface Props {
  dictType: string // Dictionary type
  valueType?: 'str' | 'int' | 'bool' // Dictionary value type
  selectType?: 'select' | 'radio' | 'checkbox' // Selector Type ，Drop down box select、 checkbox、 radio
  formCreateInject?: any
}

const props = withDefaults(defineProps<Props>(), {
  valueType: 'str',
  selectType: 'select'
})

// Obtain dictionary configuration
const getDictOptions = computed(() => {
  switch (props.valueType) {
    case 'str':
      return getStrDictOptions(props.dictType)
    case 'int':
      return getIntDictOptions(props.dictType)
    case 'bool':
      return getBoolDictOptions(props.dictType)
    default:
      return []
  }
})
</script>
