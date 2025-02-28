<template>
  <div class="w-[350px] p-5 flex flex-col bg-[#f5f7f9]">
    <h3 class="w-full h-full h-7 text-5 text-center leading-[28px] title">Mind Mapping Creation Center</h3>
    <!--Below is the form section-->
    <div class="flex-grow overflow-y-auto">
      <div class="mt-[30ppx]">
        <el-text tag="b">Your requirements?</el-text>
        <el-input
          v-model="formData.prompt"
          maxlength="1024"
          rows="5"
          class="w-100% mt-15px"
          input-style="border-radius: 7px;"
          placeholder="Please enter the prompt word and let the AI help you optimize."
          show-word-limit
          type="textarea"
        />
        <el-button
          class="!w-full mt-[15px]"
          type="primary"
          :loading="isGenerating"
          @click="emits('submit', formData)"
        >
          Intelligent generation of mind maps
        </el-button>
      </div>
      <div class="mt-[30px]">
        <el-text tag="b">Generate using existing content?</el-text>
        <el-input
          v-model="generatedContent"
          maxlength="1024"
          rows="5"
          class="w-100% mt-15px"
          input-style="border-radius: 7px;"
          placeholder="For example: What should a cottage in a fairy tale look like?"
          show-word-limit
          type="textarea"
        />
        <el-button
          class="!w-full mt-[15px]"
          type="primary"
          @click="emits('directGenerate', generatedContent)"
          :disabled="isGenerating"
        >
          Generate
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MindMapContentExample } from '@/views/ai/utils/constants'

const emits = defineEmits(['submit', 'directGenerate'])
defineProps<{
  isGenerating: boolean
}>()
// Submitted prompt word field
const formData = reactive({
  prompt: ''
})

const generatedContent = ref(MindMapContentExample) // Existing content

defineExpose({
  setGeneratedContent(newContent: string) {
    // Set existing content，Assign the result to this value at the end of generation
    generatedContent.value = newContent
  }
})
</script>

<style lang="scss" scoped>
.title {
  color: var(--el-color-primary);
}
</style>
