<template>
  <el-form ref="listenerFormRef" :model="configForm" label-position="top">
    <div v-for="(listener, listenerIdx) in taskListener" :key="listenerIdx">
      <el-divider content-position="left">
        <el-text tag="b" size="large">{{ listener.name }}</el-text>
      </el-divider>
      <el-form-item>
        <el-switch
          v-model="configForm[`task${listener.type}ListenerEnable`]"
          active-text="Open"
          inactive-text="Close"
        />
      </el-form-item>
      <div v-if="configForm[`task${listener.type}ListenerEnable`]">
        <el-form-item>
          <el-alert
            title="Only supported POST request，Receive parameters in the form of a request body"
            type="warning"
            show-icon
            :closable="false"
          />
        </el-form-item>
        <el-form-item
          label="Request Url"
          :prop="`task${listener.type}ListenerPath`"
          :rules="{
            required: true,
            message: 'Request url cannot be empty',
            trigger: 'blur'
          }"
        >
          <el-input v-model="configForm[`task${listener.type}ListenerPath`]" />
        </el-form-item>
        <HttpRequestParamSetting
          :header="configForm[`task${listener.type}Listener`].header"
          :body="configForm[`task${listener.type}Listener`].body"
          :bind="`task${listener.type}Listener`"
        />
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import HttpRequestParamSetting from './HttpRequestParamSetting.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  formFieldOptions: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])
const listenerFormRef = ref()
const configForm = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
const taskListener = ref([
  {
    name: 'Create',
    type: 'Create'
  },
  {
    name: 'Assign',
    type: 'Assign'
  },
  {
    name: 'Complete',
    type: 'Complete'
  }
])

const validate = async () => {
  if (!listenerFormRef) return false
  return await listenerFormRef.value.validate()
}

defineExpose({ validate })
</script>
