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
  <div class="image-size">
    <div>
      <el-text tag="b">size</el-text>
    </div>
    <el-space wrap class="size-list">
      <div
        class="size-item"
        v-for="imageSize in MidjourneySizeList"
        :key="imageSize.key"
        @click="handleSizeClick(imageSize)"
      >
        <div
          :class="selectSize === imageSize.key ? 'size-wrapper selectImageSize' : 'size-wrapper'"
        >
          <div :style="imageSize.style"></div>
        </div>
        <div class="size-font">{{ imageSize.key }}</div>
      </div>
    </el-space>
  </div>
  <div class="model">
    <div>
      <el-text tag="b">Model</el-text>
    </div>
    <el-space wrap class="model-list">
      <div
        :class="selectModel === model.key ? 'modal-item selectModel' : 'modal-item'"
        v-for="model in MidjourneyModels"
        :key="model.key"
      >
        <el-image :src="model.image" fit="contain" @click="handleModelClick(model)" />
        <div class="model-font">{{ model.name }}</div>
      </div>
    </el-space>
  </div>
  <div class="version">
    <div>
      <el-text tag="b">version</el-text>
    </div>
    <el-space wrap class="version-list">
      <el-select
        v-model="selectVersion"
        class="version-select !w-350px"
        clearable
        placeholder="Please select version"
      >
        <el-option
          v-for="item in versionList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-space>
  </div>
  <div class="model">
    <div>
      <el-text tag="b">Reference image</el-text>
    </div>
    <el-space wrap class="model-list">
      <UploadImg v-model="referImageUrl" height="120px" width="120px" />
    </el-space>
  </div>
  <div class="btns">
    <el-button
      type="primary"
      size="large"
      round
      :disabled="prompt.length === 0"
      @click="handleGenerateImage"
    >
      {{ drawIn ? 'Generating...' : 'Generated content' }}
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { ImageApi, ImageMidjourneyImagineReqVO, ImageVO } from '@/api/ai/image'
import {
  AiPlatformEnum,
  ImageHotWords,
  ImageSizeVO,
  ImageModelVO,
  MidjourneyModels,
  MidjourneySizeList,
  MidjourneyVersions,
  NijiVersionList
} from '@/views/ai/utils/constants'
import { ModelVO } from '@/api/ai/model/model'

const message = useMessage() // Message pop-up window

// 接收父组件传入的模型列表
const props = defineProps({
  models: {
    type: Array<ModelVO>,
    default: () => [] as ModelVO[]
  }
})
const emits = defineEmits(['onDrawStart', 'onDrawComplete']) // 定义 emits

// Define attributes
const drawIn = ref<boolean>(false) // Generating in progress
const selectHotWord = ref<string>('') // Selected hot words
// form 
const prompt = ref<string>('') // cue word
const referImageUrl = ref<any>() // Reference image
const selectModel = ref<string>('midjourney') // Selected model
const selectSize = ref<string>('1:1') // Select size
const selectVersion = ref<any>('6.0') // Selected ones version
const versionList = ref<any>(MidjourneyVersions) // version list

/** Choose hot words */
const handleHotWordClick = async (hotWord: string) => {
  // Situation 1：Uncheck
  if (selectHotWord.value == hotWord) {
    selectHotWord.value = ''
    return
  }

  // Scenario 2：Select
  selectHotWord.value = hotWord // Select
  prompt.value = hotWord // Set prompt times
}

/** click size  */
const handleSizeClick = async (imageSize: ImageSizeVO) => {
  selectSize.value = imageSize.key
}

/** click model Model */
const handleModelClick = async (model: ImageModelVO) => {
  selectModel.value = model.key
  if (model.key === 'niji') {
    versionList.value = NijiVersionList // Default selection niji
  } else {
    versionList.value = MidjourneyVersions // Default selection midjourney
  }
  selectVersion.value = versionList.value[0].value
}

/** Image generation */
const handleGenerateImage = async () => {
  // 从 models 中查找匹配的模型
  const matchedModel = props.models.find(
    (item) => item.model === selectModel.value && item.platform === AiPlatformEnum.MIDJOURNEY
  )
  if (!matchedModel) {
    message.error('The model is unavailable, please select another model.')
    return
  }

  // 二次确认
  await message.confirm(`Confirm the generated content?`)
  try {
    // Loading in progress
    drawIn.value = true
    // Callback
    emits('onDrawStart', AiPlatformEnum.MIDJOURNEY)
    // Send request
    const imageSize = MidjourneySizeList.find(
      (item) => selectSize.value === item.key
    ) as ImageSizeVO
    const req = {
      prompt: prompt.value,
      modelId: matchedModel.id,
      width: imageSize.width,
      height: imageSize.height,
      version: selectVersion.value,
      referImageUrl: referImageUrl.value
    } as ImageMidjourneyImagineReqVO
    await ImageApi.midjourneyImagine(req)
  } finally {
    // Callback
    emits('onDrawComplete', AiPlatformEnum.MIDJOURNEY)
    // Loading completed
    drawIn.value = false
  }
}

/** Fill in value */
const settingValues = async (detail: ImageVO) => {
  // prompt word
  prompt.value = detail.prompt
  // image size
  const imageSize = MidjourneySizeList.find(
    (item) => item.key === `${detail.width}:${detail.height}`
  ) as ImageSizeVO
  selectSize.value = imageSize.key
  // Select Model
  const model = MidjourneyModels.find((item) => item.key === detail.options?.model) as ImageModelVO
  await handleModelClick(model)
  // edition
  selectVersion.value = versionList.value.find(
    (item) => item.value === detail.options?.version
  ).value
  // image
  referImageUrl.value = detail.options.referImageUrl
}

/** Exposure component method */
defineExpose({ settingValues })
</script>
<style scoped lang="scss">
// promt word
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

// version
.version {
  margin-top: 20px;

  .version-list {
    margin-top: 20px;
    width: 100%;
  }
}

// Model
.model {
  margin-top: 30px;

  .model-list {
    margin-top: 15px;

    .modal-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 150px;
      //outline: 1px solid blue;
      overflow: hidden;
      border: 3px solid transparent;
      cursor: pointer;

      .model-font {
        font-size: 14px;
        color: #3e3e3e;
        font-weight: bold;
      }
    }

    .selectModel {
      border: 3px solid #1293ff;
      border-radius: 5px;
    }
  }
}

// size
.image-size {
  width: 100%;
  margin-top: 30px;

  .size-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;

    .size-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      .size-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 7px;
        padding: 4px;
        width: 50px;
        height: 50px;
        background-color: #fff;
        border: 1px solid #fff;
      }

      .size-font {
        font-size: 14px;
        color: #3e3e3e;
        font-weight: bold;
      }
    }
  }

  .selectImageSize {
    border: 1px solid #1293ff !important;
  }
}

.btns {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
