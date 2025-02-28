<!-- image -->
<template>
  <div class="ai-image">
    <div class="left">
      <div class="segmented">
        <el-segmented v-model="selectPlatform" :options="platformOptions" />
      </div>
      <div class="modal-switch-container">
        <Dall3
          v-if="selectPlatform === AiPlatformEnum.OPENAI"
          ref="dall3Ref"
          @on-draw-start="handleDrawStart"
          @on-draw-complete="handleDrawComplete"
        />
        <Midjourney v-if="selectPlatform === AiPlatformEnum.MIDJOURNEY" ref="midjourneyRef" />
        <StableDiffusion
          v-if="selectPlatform === AiPlatformEnum.STABLE_DIFFUSION"
          ref="stableDiffusionRef"
          @on-draw-complete="handleDrawComplete"
        />
        <Other
          v-if="selectPlatform === 'other'"
          ref="otherRef"
          @on-draw-complete="handleDrawComplete"
        />
      </div>
    </div>
    <div class="main">
      <ImageList ref="imageListRef" @on-regeneration="handleRegeneration" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageList from './components/ImageList.vue'
import { AiPlatformEnum } from '@/views/ai/utils/constants'
import { ImageVO } from '@/api/ai/image'
import Dall3 from './components/dall3/index.vue'
import Midjourney from './components/midjourney/index.vue'
import StableDiffusion from './components/stableDiffusion/index.vue'
import Other from './components/other/index.vue'

const imageListRef = ref<any>() // image list ref
const dall3Ref = ref<any>() // dall3(openai) ref
const midjourneyRef = ref<any>() // midjourney ref
const stableDiffusionRef = ref<any>() // stable diffusion ref
const otherRef = ref<any>() // stable diffusion ref

// Define attributes
const selectPlatform = ref(AiPlatformEnum.MIDJOURNEY)
const platformOptions = [
  {
    label: 'DALL3 painting',
    value: AiPlatformEnum.OPENAI
  },
  {
    label: 'MJ painting',
    value: AiPlatformEnum.MIDJOURNEY
  },
  {
    label: 'Stable Diffusion',
    value: AiPlatformEnum.STABLE_DIFFUSION
  },
  {
    label: 'other',
    value: 'other'
  }
]

/** painting start  */
const handleDrawStart = async (platform: string) => {}

/** painting complete */
const handleDrawComplete = async (platform: string) => {
  await imageListRef.value.getImageList()
}

/**  Regenerate：Fill in the drawing details to the corresponding platform  */
const handleRegeneration = async (image: ImageVO) => {
  // Switching platforms
  selectPlatform.value = image.platform
  // Fill in according to different platforms image
  await nextTick()
  if (image.platform === AiPlatformEnum.MIDJOURNEY) {
    midjourneyRef.value.settingValues(image)
  } else if (image.platform === AiPlatformEnum.OPENAI) {
    dall3Ref.value.settingValues(image)
  } else if (image.platform === AiPlatformEnum.STABLE_DIFFUSION) {
    stableDiffusionRef.value.settingValues(image)
  }
  // TODO @Agruuu：It seems that it's not possible to reset "other"?
}
</script>

<style scoped lang="scss">
.ai-image {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .left {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 350px;

    .segmented {
    }

    .segmented .el-segmented {
      --el-border-radius-base: 16px;
      --el-segmented-item-selected-color: #fff;
      background-color: #ececec;
      width: 350px;
    }

    .modal-switch-container {
      height: 100%;
      overflow-y: auto;
      margin-top: 30px;
    }
  }

  .main {
    flex: 1;
    background-color: #fff;
  }

  .right {
    width: 350px;
    background-color: #f7f8fa;
  }
}
</style>
