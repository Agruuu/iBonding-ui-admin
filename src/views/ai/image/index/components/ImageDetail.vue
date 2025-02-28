<template>
  <el-drawer
    v-model="showDrawer"
    title="Image details"
    @close="handleDrawerClose"
    custom-class="drawer-class"
  >
    <!-- image -->
    <div class="item">
      <div class="body">
        <el-image
          class="image"
          :src="detail?.picUrl"
          :preview-src-list="[detail.picUrl]"
          preview-teleported
        />
      </div>
    </div>
    <!-- time -->
    <div class="item">
      <div class="tip">time</div>
      <div class="body">
        <div>Submission time：{{ formatTime(detail.createTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
        <div>Generation time：{{ formatTime(detail.finishTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
      </div>
    </div>
    <!-- Model -->
    <div class="item">
      <div class="tip">Model</div>
      <div class="body"> {{ detail.model }}({{ detail.height }}x{{ detail.width }}) </div>
    </div>
    <!-- cue word -->
    <div class="item">
      <div class="tip">prompt word</div>
      <div class="body">
        {{ detail.prompt }}
      </div>
    </div>
    <!-- address -->
    <div class="item">
      <div class="tip">Image address</div>
      <div class="body">
        {{ detail.picUrl }}
      </div>
    </div>
    <!-- StableDiffusion Exclusive Zone -->
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.sampler"
    >
      <div class="tip">Sampling method</div>
      <div class="body">
        {{
          StableDiffusionSamplers.find(
            (item: ImageModelVO) => item.key === detail?.options?.sampler
          )?.name
        }}
      </div>
    </div>
    <div
      class="item"
      v-if="
        detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.clipGuidancePreset
      "
    >
      <div class="tip">CLIP</div>
      <div class="body">
        {{
          StableDiffusionClipGuidancePresets.find(
            (item: ImageModelVO) => item.key === detail?.options?.clipGuidancePreset
          )?.name
        }}
      </div>
    </div>
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.stylePreset"
    >
      <div class="tip">style</div>
      <div class="body">
        {{
          StableDiffusionStylePresets.find(
            (item: ImageModelVO) => item.key === detail?.options?.stylePreset
          )?.name
        }}
      </div>
    </div>
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.steps"
    >
      <div class="tip">Iteration steps</div>
      <div class="body">
        {{ detail?.options?.steps }}
      </div>
    </div>
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.scale"
    >
      <div class="tip">Guidance coefficient</div>
      <div class="body">
        {{ detail?.options?.scale }}
      </div>
    </div>
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.STABLE_DIFFUSION && detail?.options?.seed"
    >
      <div class="tip">Random factor</div>
      <div class="body">
        {{ detail?.options?.seed }}
      </div>
    </div>
    <!-- Dall3 Exclusive Zone -->
    <div class="item" v-if="detail.platform === AiPlatformEnum.OPENAI && detail?.options?.style">
      <div class="tip">Style selection</div>
      <div class="body">
        {{ Dall3StyleList.find((item: ImageModelVO) => item.key === detail?.options?.style)?.name }}
      </div>
    </div>
    <!-- Midjourney Exclusive Zone -->
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.MIDJOURNEY && detail?.options?.version"
    >
      <div class="tip">Model version</div>
      <div class="body">
        {{ detail?.options?.version }}
      </div>
    </div>
    <div
      class="item"
      v-if="detail.platform === AiPlatformEnum.MIDJOURNEY && detail?.options?.referImageUrl"
    >
      <div class="tip">Reference image</div>
      <div class="body">
        <el-image :src="detail.options.referImageUrl" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ImageApi, ImageVO } from '@/api/ai/image'
import {
  AiPlatformEnum,
  Dall3StyleList,
  ImageModelVO,
  StableDiffusionClipGuidancePresets,
  StableDiffusionSamplers,
  StableDiffusionStylePresets
} from '@/views/ai/utils/constants'
import { formatTime } from '@/utils'

const showDrawer = ref<boolean>(false) // Is it displayed
const detail = ref<ImageVO>({} as ImageVO) // Image Details

const props = defineProps({
  show: {
    type: Boolean,
    require: true,
    default: false
  },
  id: {
    type: Number,
    required: true
  }
})

/** close drawer  */
const handleDrawerClose = async () => {
  emits('handleDrawerClose')
}

/** monitor drawer Do you want to open it */
const { show } = toRefs(props)
watch(show, async (newValue, oldValue) => {
  showDrawer.value = newValue as boolean
})

/**  Get image details  */
const getImageDetail = async (id: number) => {
  detail.value = await ImageApi.getImageMy(id)
}

/** monitor id change，Load the latest image details */
const { id } = toRefs(props)
watch(id, async (newVal, oldVal) => {
  if (newVal) {
    await getImageDetail(newVal)
  }
})

const emits = defineEmits(['handleDrawerClose'])
</script>
<style scoped lang="scss">
.item {
  margin-bottom: 20px;
  width: 100%;
  overflow: hidden;
  word-wrap: break-word;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .tip {
    font-weight: bold;
    font-size: 16px;
  }

  .body {
    margin-top: 10px;
    color: #616161;

    .taskImage {
      border-radius: 10px;
    }
  }
}
</style>
