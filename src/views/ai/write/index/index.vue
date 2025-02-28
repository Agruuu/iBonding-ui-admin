<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 flex">
    <Left
      :is-writing="isWriting"
      class="h-full"
      @submit="submit"
      @reset="reset"
      @example="handleExampleClick"
    />
    <Right
      :is-writing="isWriting"
      @stop-stream="stopStream"
      ref="rightRef"
      class="flex-grow"
      v-model:content="writeResult"
    />
  </div>
</template>

<script setup lang="ts">
import Left from './components/Left.vue'
import Right from './components/Right.vue'
import { WriteApi, WriteVO } from '@/api/ai/write'
import { WriteExample } from '@/views/ai/utils/constants'

const message = useMessage()

const writeResult = ref('') // Writing Results
const isWriting = ref(false) // Is it currently being written
const abortController = ref<AbortController>() // // The abort controller is in use during the writing process (used to control stream writing).

/** stop the stream generate */
const stopStream = () => {
  abortController.value?.abort()
  isWriting.value = false
}

/** Execute Writing */
const rightRef = ref<InstanceType<typeof Right>>()
const submit = (data: WriteVO) => {
  abortController.value = new AbortController()
  writeResult.value = ''
  isWriting.value = true
  WriteApi.writeStream({
    data,
    onMessage: async (res) => {
      const { code, data, msg } = JSON.parse(res.data)
      if (code !== 0) {
        message.alert(`Writing abnormality! ${msg}`)
        stopStream()
        return
      }
      writeResult.value = writeResult.value + data
      // Scroll to the bottom
      await nextTick()
      rightRef.value?.scrollToBottom()
    },
    ctrl: abortController.value,
    onClose: stopStream,
    onError: (...err) => {
      console.error('Writing abnormality', ...err)
      stopStream()
    }
  })
}

/** Click on the example to trigger */
const handleExampleClick = (type: keyof typeof WriteExample) => {
  writeResult.value = WriteExample[type].data
}

/** Clear the writing result when clicking reset**/
const reset = () => {
  writeResult.value = ''
}
</script>
