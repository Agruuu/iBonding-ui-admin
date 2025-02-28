<template>
  <el-input v-model="appLink" placeholder="Enter or Select Link">
    <template #append>
      <el-button @click="handleOpenDialog">Select</el-button>
    </template>
  </el-input>
  <AppLinkSelectDialog ref="dialogRef" @change="handleLinkSelected" />
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

// APP Link input box
defineOptions({ name: 'AppLinkInput' })
// Define attributes
const props = defineProps({
  // The currently selected link
  modelValue: propTypes.string.def('')
})
// Current link
const appLink = ref('')
// Option Dialog 
const dialogRef = ref()
// Process opening dialog box
const handleOpenDialog = () => dialogRef.value?.open(appLink.value)
// handle APP Link selection
const handleLinkSelected = (link: string) => (appLink.value = link)

// getter
watch(
  () => props.modelValue,
  () => (appLink.value = props.modelValue),
  { immediate: true }
)

// setter
const emit = defineEmits<{
  'update:modelValue': [link: string]
}>()
watch(
  () => appLink.value,
  () => emit('update:modelValue', appLink.value)
)
</script>
