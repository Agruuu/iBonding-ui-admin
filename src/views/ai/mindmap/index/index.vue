<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 flex">
    <!-- form field -->
    <Left
      ref="leftRef"
      :is-generating="isGenerating"
      @submit="submit"
      @direct-generate="directGenerate"
    />
    <!--Generate mind map area on the right-->
    <Right
      ref="rightRef"
      :generatedContent="generatedContent"
      :isEnd="isEnd"
      :isGenerating="isGenerating"
      :isStart="isStart"
    />
  </div>
</template>

<script lang="ts" setup>
import Left from './components/Left.vue'
import Right from './components/Right.vue'
import { AiMindMapApi, AiMindMapGenerateReqVO } from '@/api/ai/mindmap'
import { MindMapContentExample } from '@/views/ai/utils/constants'

defineOptions({
  name: 'AiMindMap'
})
const ctrl = ref<AbortController>() // Request control
const isGenerating = ref(false) // Is a mind map being generated
const isStart = ref(false) // Start generating，Used to clear mind maps
const isEnd = ref(true) // To render a mind map at the end of the judgment process
const message = useMessage() // Message prompt

const generatedContent = ref('') // Generate mind map results

const leftRef = ref<InstanceType<typeof Left>>() // Left component
const rightRef = ref<InstanceType<typeof Right>>() // Right component

/** Generate directly using existing content **/
const directGenerate = (existPrompt: string) => {
  isEnd.value = false // First set it to `false` and then set it to `true` so that the `watch` in the child component can detect the change.
  generatedContent.value = existPrompt
  isEnd.value = true
}

/** Stop the stream generation */
const stopStream = () => {
  isGenerating.value = false
  isStart.value = false
  ctrl.value?.abort()
}

/** Submit and generate */
const submit = (data: AiMindMapGenerateReqVO) => {
  isGenerating.value = true
  isStart.value = true
  isEnd.value = false
  ctrl.value = new AbortController() // Request control assignment
  generatedContent.value = '' // Clear generated data
  AiMindMapApi.generateMindMap({
    data,
    onMessage: async (res) => {
      const { code, data, msg } = JSON.parse(res.data)
      if (code !== 0) {
        message.alert(`Failed to generate mind map! ${msg}`)
        stopStream()
        return
      }
      generatedContent.value = generatedContent.value + data
      await nextTick()
      rightRef.value?.scrollBottom()
    },
    onClose() {
      isEnd.value = true
      leftRef.value?.setGeneratedContent(generatedContent.value)
      stopStream()
    },
    onError(err) {
      console.error('Failed to generate mind map!', err)
      stopStream()
    },
    ctrl: ctrl.value
  })
}

/** initialization */
onMounted(() => {
  generatedContent.value = MindMapContentExample
})
</script>
