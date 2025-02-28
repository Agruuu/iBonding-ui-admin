<template>
  <el-card class="my-card h-full flex-grow">
    <template #header>
      <h3 class="m-0 px-7 shrink-0 flex items-center justify-between">
        <span>Mind map preview</span>
        <!-- Displayed in the upper right corner -->
        <el-button v-show="isEnd" size="small" type="primary" @click="downloadImage">
          <template #icon>
            <Icon icon="ph:copy-bold" />
          </template>
          Download image
        </el-button>
      </h3>
    </template>

    <div ref="contentRef" class="hide-scroll-bar h-full box-border">
      <!-- A container for displaying Markdown. What's ultimately generated is an HTML string, which can be directly embedded using `v-html`. -->
      <div v-if="isGenerating" ref="mdContainerRef" class="wh-full overflow-y-auto">
        <div class="flex flex-col items-center justify-center" v-html="html"></div>
      </div>

      <div ref="mindMapRef" class="wh-full">
        <svg ref="svgRef" :style="{ height: `${contentAreaHeight}px` }" class="w-full" />
        <div ref="toolBarRef" class="absolute bottom-[10px] right-5"></div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { Markmap } from 'markmap-view'
import { Transformer } from 'markmap-lib'
import { Toolbar } from 'markmap-toolbar'
import markdownit from 'markdown-it'
import download from '@/utils/download'

const md = markdownit()
const message = useMessage() // Message pop-up window

const props = defineProps<{
  generatedContent: string // Generate results
  isEnd: boolean // Is it over
  isGenerating: boolean // Is it generating
  isStart: boolean // Start status，Clear is required at the beginning html
}>()
const contentRef = ref<HTMLDivElement>() // The area below the header appears on the right side.
const mdContainerRef = ref<HTMLDivElement>() // markdown The container，Used to scroll to the bottom
const mindMapRef = ref<HTMLDivElement>() // Container for mind mapping
const svgRef = ref<SVGElement>() // Rendering of mind maps svg
const toolBarRef = ref<HTMLDivElement>() // The toolbar in the bottom right corner of the mind map，Scaling, etc
const html = ref('') // Text generated during the process
const contentAreaHeight = ref(0) // The height of the generation area, excluding the header part.
let markMap: Markmap | null = null
const transformer = new Transformer()

onMounted(() => {
  contentAreaHeight.value = contentRef.value?.clientHeight || 0 // get the height of the area
  /** Initialize mind map **/
  try {
    markMap = Markmap.create(svgRef.value!)
    const { el } = Toolbar.create(markMap)
    toolBarRef.value?.append(el)
    nextTick(update)
  } catch (e) {
    message.error('The initialization of the mind map has failed.')
  }
})

watch(props, ({ generatedContent, isGenerating, isEnd, isStart }) => {
  // Clear the content of the Markdown when starting the generation
  if (isStart) {
    html.value = ''
  }
  // Use Markdown to render the content during generation
  if (isGenerating) {
    html.value = md.render(generatedContent)
  }
  // Update mind map at the end of generation
  if (isEnd) {
    update()
  }
})

/** Display of updated mind maps */
const update = () => {
  try {
    const { root } = transformer.transform(processContent(props.generatedContent))
    markMap?.setData(root)
    markMap?.fit()
  } catch (e) {
    console.error(e)
  }
}

/** Processing content */
const processContent = (text: string) => {
  const arr: string[] = []
  const lines = text.split('\n')
  for (let line of lines) {
    if (line.indexOf('```') !== -1) {
      continue
    }
    line = line.replace(/([*_~`>])|(\d+\.)\s/g, '')
    arr.push(line)
  }
  return arr.join('\n')
}

/** Download images：download SVG to png file */
const downloadImage = () => {
  const svgElement = mindMapRef.value
  // Render the SVG to an image object.
  const serializer = new XMLSerializer()
  const source = `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(svgRef.value!)}`
  const base64Url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
  download.image({
    url: base64Url,
    canvasWidth: svgElement?.offsetWidth,
    canvasHeight: svgElement?.offsetHeight,
    drawWithImageSize: false
  })
}

defineExpose({
  scrollBottom() {
    mdContainerRef.value?.scrollTo(0, mdContainerRef.value?.scrollHeight)
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

// Override the tool style of Markmap
:deep(.markmap) {
  width: 100%;
}

:deep(.mm-toolbar-brand) {
  display: none;
}

:deep(.mm-toolbar) {
  display: flex;
  flex-direction: row;
}
</style>
