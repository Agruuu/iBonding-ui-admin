<!-- dall3 -->
<template>
  <div class="prompt">
    <el-text tag="b">Description of the picture</el-text>
    <el-text tag="p">It is recommended to use the format of "adjective + verb + style" and separate them with commas.</el-text>
    <el-input
      v-model="prompt"
      maxlength="1024"
      rows="5"
      class="w-100% mt-15px"
      input-style="border-radius: 7px;"
      placeholder="For example: What should a cottage in a fairy tale look like?"
      show-word-limit
      type="textarea"
    />
  </div>
  <div class="hot-words">
    <div>
      <el-text tag="b">Random hot words</el-text>
    </div>
    <el-space wrap class="word-list">
      <el-button
        round
        class="btn"
        :type="selectHotWord === hotWord ? 'primary' : 'default'"
        v-for="hotWord in ImageHotEnglishWords"
        :key="hotWord"
        @click="handleHotWordClick(hotWord)"
      >
        {{ hotWord }}
      </el-button>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Sampling method</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-select v-model="sampler" placeholder="Select" size="large" class="!w-350px">
        <el-option
          v-for="item in StableDiffusionSamplers"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">CLIP</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-select v-model="clipGuidancePreset" placeholder="Select" size="large" class="!w-350px">
        <el-option
          v-for="item in StableDiffusionClipGuidancePresets"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">style</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-select v-model="stylePreset" placeholder="Select" size="large" class="!w-350px">
        <el-option
          v-for="item in StableDiffusionStylePresets"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Image size</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-input v-model="width" class="w-170px" placeholder="image width" />
      <el-input v-model="height" class="w-170px" placeholder="Image height" />
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Iteration steps</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-input
        v-model="steps"
        type="number"
        size="large"
        class="!w-350px"
        placeholder="Please input"
      />
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Guidance coefficient</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-input
        v-model="scale"
        type="number"
        size="large"
        class="!w-350px"
        placeholder="Please input"
      />
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Random factor</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-input
        v-model="seed"
        type="number"
        size="large"
        class="!w-350px"
        placeholder="Please input"
      />
    </el-space>
  </div>
  <div class="btns">
    <el-button type="primary" size="large" round :loading="drawIn" @click="handleGenerateImage">
      {{ drawIn ? 'Generating...' : 'Generated content' }}
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { ImageApi, ImageDrawReqVO, ImageVO } from '@/api/ai/image'
import { hasChinese } from '@/views/ai/utils/utils'
import {
  AiPlatformEnum,
  ImageHotEnglishWords,
  StableDiffusionClipGuidancePresets,
  StableDiffusionSamplers,
  StableDiffusionStylePresets
} from '@/views/ai/utils/constants'

const message = useMessage() // Message pop-up window

// Define attributes
const drawIn = ref<boolean>(false) // Generating in progress
const selectHotWord = ref<string>('') // Selected hot words
// form 
const prompt = ref<string>('') // cue word
const width = ref<number>(512) // image width
const height = ref<number>(512) // Image height
const sampler = ref<string>('DDIM') // Sampling method
const steps = ref<number>(20) // Iteration steps
const seed = ref<number>(42) // Control the randomness of generated images
const scale = ref<number>(7.5) // Guidance coefficient
const clipGuidancePreset = ref<string>('NONE') // Images that match the text prompt(clip_guidance_preset) abbreviation CLIP
const stylePreset = ref<string>('3d-model') // style

const emits = defineEmits(['onDrawStart', 'onDrawComplete']) // definition emits

/** Choose hot words */
const handleHotWordClick = async (hotWord: string) => {
  // Situation 1：Uncheck
  if (selectHotWord.value == hotWord) {
    selectHotWord.value = ''
    return
  }

  // Scenario 2：Select
  selectHotWord.value = hotWord // Select
  prompt.value = hotWord // Replace prompt words
}

/** Image generation */
const handleGenerateImage = async () => {
  // Secondary confirmation
  if (hasChinese(prompt.value)) {
    message.alert('Chinese is not currently supported！')
    return
  }
  await message.confirm(`Confirm the generated content?`)

  try {
    // Loading in progress
    drawIn.value = true
    // Callback
    emits('onDrawStart', AiPlatformEnum.STABLE_DIFFUSION)
    // Send request
    const form = {
      platform: AiPlatformEnum.STABLE_DIFFUSION,
      model: 'stable-diffusion-v1-6',
      prompt: prompt.value, // cue word
      width: width.value, // image width
      height: height.value, // Image height
      options: {
        seed: seed.value, // Random seeds
        steps: steps.value, // Number of steps for image generation
        scale: scale.value, // Guidance coefficient
        sampler: sampler.value, // Sampling algorithm
        clipGuidancePreset: clipGuidancePreset.value, // Images that match the text prompt CLIP
        stylePreset: stylePreset.value // style
      }
    } as ImageDrawReqVO
    await ImageApi.drawImage(form)
  } finally {
    // Callback
    emits('onDrawComplete', AiPlatformEnum.STABLE_DIFFUSION)
    // Loading completed
    drawIn.value = false
  }
}

/** Fill in value */
const settingValues = async (detail: ImageVO) => {
  prompt.value = detail.prompt
  width.value = detail.width
  height.value = detail.height
  seed.value = detail.options?.seed
  steps.value = detail.options?.steps
  scale.value = detail.options?.scale
  sampler.value = detail.options?.sampler
  clipGuidancePreset.value = detail.options?.clipGuidancePreset
  stylePreset.value = detail.options?.stylePreset
}

/** Exposure component method */
defineExpose({ settingValues })
</script>
<style scoped lang="scss">
// prompt word
.prompt {
}

// Hot words
.hot-words {
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  .word-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    margin-top: 15px;

    .btn {
      margin: 0;
    }
  }
}

// Model
.group-item {
  margin-top: 30px;

  .group-item-body {
    margin-top: 15px;
    width: 100%;
  }
}

.btns {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
