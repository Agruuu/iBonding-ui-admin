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
  <div class="model">
    <div>
      <el-text tag="b">Model selection</el-text>
    </div>
    <el-space wrap class="model-list">
      <div
        :class="selectModel === model.key ? 'modal-item selectModel' : 'modal-item'"
        v-for="model in Dall3Models"
        :key="model.key"
      >
        <el-image :src="model.image" fit="contain" @click="handleModelClick(model)" />
        <div class="model-font">{{ model.name }}</div>
      </div>
    </el-space>
  </div>
  <div class="image-style">
    <div>
      <el-text tag="b">Style selection</el-text>
    </div>
    <el-space wrap class="image-style-list">
      <div
        :class="style === imageStyle.key ? 'image-style-item selectImageStyle' : 'image-style-item'"
        v-for="imageStyle in Dall3StyleList"
        :key="imageStyle.key"
      >
        <el-image :src="imageStyle.image" fit="contain" @click="handleStyleClick(imageStyle)" />
        <div class="style-font">{{ imageStyle.name }}</div>
      </div>
    </el-space>
  </div>
  <div class="image-size">
    <div>
      <el-text tag="b">Picture scale</el-text>
    </div>
    <el-space wrap class="size-list">
      <div
        class="size-item"
        v-for="imageSize in Dall3SizeList"
        :key="imageSize.key"
        @click="handleSizeClick(imageSize)"
      >
        <div
          :class="selectSize === imageSize.key ? 'size-wrapper selectImageSize' : 'size-wrapper'"
        >
          <div :style="imageSize.style"></div>
        </div>
        <div class="size-font">{{ imageSize.name }}</div>
      </div>
    </el-space>
  </div>
  <div class="btns">
    <el-button
      type="primary"
      size="large"
      round
      :loading="drawIn"
      :disabled="prompt.length === 0"
      @click="handleGenerateImage"
    >
      {{ drawIn ? 'Generating...' : 'Generated content' }}
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { ImageApi, ImageDrawReqVO, ImageVO } from '@/api/ai/image'
import {
  Dall3Models,
  Dall3StyleList,
  ImageHotWords,
  Dall3SizeList,
  ImageModelVO,
  AiPlatformEnum,
  ImageSizeVO
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

// 定义属性
const prompt = ref<string>('') // 提示词
const drawIn = ref<boolean>(false) // 生成中
const selectHotWord = ref<string>('') // 选中的热词
const selectModel = ref<string>('dall-e-3') // 模型
const selectSize = ref<string>('1024x1024') // 选中 size
const style = ref<string>('vivid') // style 样式

/** 选择热词 */
const handleHotWordClick = async (hotWord: string) => {
  // Situation 1：Uncheck
  if (selectHotWord.value == hotWord) {
    selectHotWord.value = ''
    return
  }

  // Scenario 2：Select
  selectHotWord.value = hotWord
  prompt.value = hotWord
}

/** choice model Model */
const handleModelClick = async (model: ImageModelVO) => {
  selectModel.value = model.key
  // 可以在这里添加模型特定的处理逻辑
  // 例如，如果未来需要根据不同模型设置不同参数
  if (model.key === 'dall-e-3') {
    // DALL-E-3 模型特定的处理
    style.value = 'vivid' // 默认设置vivid风格
  } else if (model.key === 'dall-e-2') {
    // DALL-E-2 模型特定的处理
    style.value = 'natural' // 如果有其他DALL-E-2适合的默认风格
  }

  // 更新其他相关参数
  // 例如可以默认选择最适合当前模型的尺寸
  const recommendedSize = Dall3SizeList.find(
    (size) =>
      (model.key === 'dall-e-3' && size.key === '1024x1024') ||
      (model.key === 'dall-e-2' && size.key === '512x512')
  )

  if (recommendedSize) {
    selectSize.value = recommendedSize.key
  }
}

/** choice style style  */
const handleStyleClick = async (imageStyle: ImageModelVO) => {
  style.value = imageStyle.key
}

/** choice size size  */
const handleSizeClick = async (imageSize: ImageSizeVO) => {
  selectSize.value = imageSize.key
}

/**  Image production  */
const handleGenerateImage = async () => {
  // 从 models 中查找匹配的模型
  const matchedModel = props.models.find(
    (item) => item.model === selectModel.value && item.platform === AiPlatformEnum.OPENAI
  )
  if (!matchedModel) {
    message.error('The model is unavailable, please select another model')
    return
  }

  // 二次确认
  await message.confirm(`Confirm the generated content?`)
  try {
    // Loading in progress
    drawIn.value = true
    // Callback
    emits('onDrawStart', AiPlatformEnum.OPENAI)
    const imageSize = Dall3SizeList.find((item) => item.key === selectSize.value) as ImageSizeVO
    const form = {
      platform: AiPlatformEnum.OPENAI,
      prompt: prompt.value, // cue word
      modelId: matchedModel.id, // 使用匹配到的模型
      style: style.value, // 图像生成的风格
      width: imageSize.width, // size Cannot be empty
      height: imageSize.height, // size Cannot be empty
      options: {
        style: style.value // The style of image generation
      }
    } as ImageDrawReqVO
    // Send request
    await ImageApi.drawImage(form)
  } finally {
    // Callback
    emits('onDrawComplete', AiPlatformEnum.OPENAI)
    // Loading completed
    drawIn.value = false
  }
}

/** Fill in value */
const settingValues = async (detail: ImageVO) => {
  prompt.value = detail.prompt
  selectModel.value = detail.model
  style.value = detail.options?.style
  const imageSize = Dall3SizeList.find(
    (item) => item.key === `${detail.width}x${detail.height}`
  ) as ImageSizeVO
  await handleSizeClick(imageSize)
}

/** Exposure component method */
defineExpose({ settingValues })
</script>
<style scoped lang="scss">
// 热词
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
.model {
  margin-top: 30px;

  .model-list {
    margin-top: 15px;

    .modal-item {
      width: 110px;
      //outline: 1px solid blue;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
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

// style style
.image-style {
  margin-top: 30px;

  .image-style-list {
    margin-top: 15px;

    .image-style-item {
      width: 110px;
      //outline: 1px solid blue;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 3px solid transparent;
      cursor: pointer;

      .style-font {
        font-size: 14px;
        color: #3e3e3e;
        font-weight: bold;
      }
    }

    .selectImageStyle {
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
