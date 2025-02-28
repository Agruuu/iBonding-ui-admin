<template>
  <div style="margin-top: 16px">
    <el-form-item label="Message Instance">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
        "
      >
        <el-select v-model="bindMessageId" @change="updateTaskMessage">
          <el-option
            v-for="key in Object.keys(messageMap)"
            :value="key"
            :label="messageMap[key]"
            :key="key"
          />
        </el-select>
        <XButton
          type="primary"
          preIcon="ep:plus"
          style="margin-left: 8px"
          @click="openMessageModel"
        />
      </div>
    </el-form-item>
    <el-dialog
      v-model="messageModelVisible"
      :close-on-click-modal="false"
      title="Create a New Message"
      width="400px"
      append-to-body
      destroy-on-close
    >
      <el-form :model="newMessageForm" size="small" label-width="90px">
        <el-form-item label="Message ID">
          <el-input v-model="newMessageForm.id" clearable />
        </el-form-item>
        <el-form-item label="Message Name">
          <el-input v-model="newMessageForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" @click="createNewMessage">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ReceiveTask' })
const props = defineProps({
  id: String,
  type: String
})

const message = useMessage()

const bindMessageId = ref('')
const newMessageForm = ref<any>({})
const messageMap = ref<any>({})
const messageModelVisible = ref(false)
const bpmnElement = ref<any>()
const bpmnMessageRefsMap = ref<any>()
const bpmnRootElements = ref<any>()

const bpmnInstances = () => (window as any).bpmnInstances
const getBindMessage = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  bindMessageId.value = bpmnElement.value.businessObject?.messageRef?.id || '-1'
}
const openMessageModel = () => {
  messageModelVisible.value = true
  newMessageForm.value = {}
}
const createNewMessage = () => {
  if (messageMap.value[newMessageForm.value.id]) {
    message.error('This message already exists. Please modify the ID and save it again.')
    return
  }
  const newMessage = bpmnInstances().moddle.create('bpmn:Message', newMessageForm.value)
  bpmnRootElements.value.push(newMessage)
  messageMap.value[newMessageForm.value.id] = newMessageForm.value.name
  bpmnMessageRefsMap.value[newMessageForm.value.id] = newMessage
  messageModelVisible.value = false
}
const updateTaskMessage = (messageId) => {
  if (messageId === '-1') {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      messageRef: null
    })
  } else {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      messageRef: bpmnMessageRefsMap.value[messageId]
    })
  }
}

onMounted(() => {
  bpmnMessageRefsMap.value = Object.create(null)
  bpmnRootElements.value = bpmnInstances().modeler.getDefinitions().rootElements
  bpmnRootElements.value
    .filter((el) => el.$type === 'bpmn:Message')
    .forEach((m) => {
      bpmnMessageRefsMap.value[m.id] = m
      messageMap.value[m.id] = m.name
    })
  messageMap.value['-1'] = 'None'
})

onBeforeUnmount(() => {
  bpmnElement.value = null
})
watch(
  () => props.id,
  () => {
    // bpmnElement.value = bpmnInstances().bpmnElement
    nextTick(() => {
      getBindMessage()
    })
  },
  { immediate: true }
)
</script>
