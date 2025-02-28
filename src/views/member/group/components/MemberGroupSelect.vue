<template>
  <el-select v-model="groupId" placeholder="Please select user group" clearable class="!w-240px">
    <el-option
      v-for="group in groupOptions"
      :key="group.id"
      :label="group.name"
      :value="group.id"
    />
  </el-select>
</template>
<script lang="ts" setup>
import * as GroupApi from '@/api/member/group'

/** Member Group Selection Box **/
defineOptions({ name: 'MemberGroupSelect' })

const props = defineProps({
  /** Select value from dropdown menu **/
  modelValue: {
    type: Number,
    default: undefined
  }
})
const emit = defineEmits(['update:modelValue'])

const groupId = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})

const groupOptions = ref<GroupApi.GroupVO[]>([])

const getList = async () => {
  groupOptions.value = await GroupApi.getSimpleGroupList()
}

/** initialization */
onMounted(() => {
  getList()
})
</script>
