<template>
  <el-select v-model="levelId" placeholder="Please select user level" clearable class="!w-240px">
    <el-option v-for="level in levelOptions" :key="level.id" :label="level.name" :value="level.id">
      <span class="flex items-center gap-x-8px">
        <el-avatar :src="level.icon" size="small" />
        {{ level.name }}
      </span>
    </el-option>
  </el-select>
</template>
<script lang="ts" setup>
import * as LevelApi from '@/api/member/level'

/** Member level selection box **/
defineOptions({ name: 'MemberLevelSelect' })

const props = defineProps({
  /** Select value from dropdown menu **/
  modelValue: {
    type: Number,
    default: undefined
  }
})
const emit = defineEmits(['update:modelValue'])

const levelId = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})

const levelOptions = ref<LevelApi.LevelVO[]>([])

const getList = async () => {
  levelOptions.value = await LevelApi.getSimpleLevelList()
}

/** initialization */
onMounted(() => {
  getList()
})
</script>
