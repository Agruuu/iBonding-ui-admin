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
        v-for="hotWord in ImageHotWords"
        :key="hotWord"
        @click="handleHotWordClick(hotWord)"
      >
        {{ hotWord }}
      </el-button>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">platform</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-select
        v-model="otherPlatform"
        placeholder="Select"
        size="large"
        class="!w-350px"
        @change="handlerPlatformChange"
      >
        <el-option
          v-for="item in OtherPlatformEnum"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Model</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-select v-model="model" placeholder="Select" size="large" class="!w-350px">
        <el-option v-for="item in models" :key="item.key" :label="item.name" :value="item.key" />
      </el-select>
    </el-space>
  </div>
  <div class="group-item">
    <div>
      <el-text tag="b">Image size</el-text>
    </div>
    <el-space wrap class="group-item-body">
      <el-input v-model="width" type="number" class="w-170px" placeholder="image width" />
      <el-input v-model="height" type="number" class="w-170px" placeholder="Image height" />
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
import {
  AiPlatformEnum,
  ChatGlmModels,
  ImageHotWords,
  ImageModelVO,
  OtherPlatformEnum,
  QianFanModels,
  TongYiWanXiangModels
} from '@/views/ai/utils/constants'

const message = useMessage() // Message pop-up window

// Define attributes
const drawIn = ref<boolean>(false) // Generating in progress
const selectHotWord = ref<string>('') // Selected hot words
// form 
const prompt = ref<string>('') // cue word
const width = ref<number>(512) // image width
const height = ref<number>(512) // Image height
const otherPlatform = ref<string>(AiPlatformEnum.TONG_YI) // platform
const models = ref<ImageModelVO[]>(TongYiWanXiangModels) // Model  TongYiWanXiangModels、QianFanModels
const model = ref<string>(models.value[0].key) // Model

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
  await message.confirm(`Confirm the generated content?`)
  try {
    // Loading in progress
    drawIn.value = true
    // Callback
    emits('onDrawStart', AiPlatformEnum.STABLE_DIFFUSION)
    // Send request
    const form = {
      platform: otherPlatform.value,
      model: model.value, // Model
      prompt: prompt.value, // cue word
      width: width.value, // image width
      height: height.value, // Image height
      options: {}
    } as unknown as ImageDrawReqVO
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
}

/** Platform switching */
const handlerPlatformChange = async (platform: string) => {
  // Switching platforms，Switching models、style
  if (AiPlatformEnum.TONG_YI === platform) {
    models.value = TongYiWanXiangModels
  } else if (AiPlatformEnum.YI_YAN === platform) {
    models.value = QianFanModels
  } else if (AiPlatformEnum.ZHI_PU === platform) {
    models.value = ChatGlmModels
  } else {
    models.value = []
  }
  // Switching platforms，Default selection of a style
  if (models.value.length > 0) {
    model.value = models.value[0].key
  } else {
    model.value = ''
  }
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
