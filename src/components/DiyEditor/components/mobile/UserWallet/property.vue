<template>
  <ComponentContainerProperty v-model="formData.style" />
</template>

<script setup lang="ts">
import { UserWalletProperty } from './config'
import { useVModel } from '@vueuse/core'

// User Asset Attribute Panel
defineOptions({ name: 'UserWalletProperty' })

const props = defineProps<{ modelValue: UserWalletProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
