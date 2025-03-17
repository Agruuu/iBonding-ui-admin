<template>
  <el-card class="my-card h-full">
    <template #header>
      <h3 class="m-0 px-7 shrink-0 flex items-center justify-between">
        <span>Preview</span>
        <!-- Displayed in the upper right corner -->
        <el-button color="#846af7" v-show="showCopy" @click="copyContent" size="small">
          <template #icon>
            <Icon icon="ph:copy-bold" />
          </template>
          Copy
        </el-button>
      </h3>
    </template>

    <div ref="contentRef" class="hide-scroll-bar h-full box-border overflow-y-auto">
      <div class="w-full min-h-full relative flex-grow bg-white box-border p-3 sm:p-7">
        <!-- Stop generating content button -->
        <el-button
          v-show="isWriting"
          class="absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-36"
          @click="emits('stopStream')"
          size="small"
        >
          <template #icon>
            <Icon icon="material-symbols:stop" />
          </template>
          Terminate generation
        </el-button>
        <el-input
          id="inputId"
          type="textarea"
          v-model="compContent"
          autosize
          :input-style="{ boxShadow: 'none' }"
          resize="none"
          placeholder="Generated content……"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const message = useMessage() // Message pop-up window
const { copied, copy } = useClipboard() // Clipboard 

const props = defineProps({
  content: {
    // The generated result
    type: String,
    default: ''
  },
  isWriting: {
    // Is the article being generated
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:content', 'stopStream'])

/** By calculating attributes，Bidirectional binding，Change the generated content，Considering the situation where users want to change the generated article */
const compContent = computed({
  get() {
    return props.content
  },
  set(val) {
    emits('update:content', val)
  }
})

/** roll */
const contentRef = ref<HTMLDivElement>()
defineExpose({
  scrollToBottom() {
    contentRef.value?.scrollTo(0, contentRef.value?.scrollHeight)
  }
})

/** Copy content when clicking copy */
const showCopy = computed(() => props.content && !props.isWriting) // Do you want to display the copy button，Display upon completion of content generation
const copyContent = () => {
  copy(props.content)
}

/** When the replication is successful copied.value is true */
watch(copied, (val) => {
  if (val) {
    message.success('Copy successful')
  }
})
</script>

<style lang="scss" scoped>
.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.my-card {
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    box-sizing: border-box;
    flex-grow: 1;
    overflow-y: auto;
    padding: 0;
    @extend .hide-scroll-bar;
  }
}
</style>
