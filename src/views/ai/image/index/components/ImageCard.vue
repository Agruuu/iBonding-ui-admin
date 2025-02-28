<template>
  <el-card body-class="" class="image-card">
    <div class="image-operation">
      <div>
        <el-button type="primary" text bg v-if="detail?.status === AiImageStatusEnum.IN_PROGRESS">
          Generating...
        </el-button>
        <el-button text bg v-else-if="detail?.status === AiImageStatusEnum.SUCCESS">
          Completed
        </el-button>
        <el-button type="danger" text bg v-else-if="detail?.status === AiImageStatusEnum.FAIL">
          abnormal
        </el-button>
      </div>
      <!-- Operation area -->
      <div>
        <el-button
          class="btn"
          text
          :icon="Download"
          @click="handleButtonClick('download', detail)"
        />
        <el-button
          class="btn"
          text
          :icon="RefreshRight"
          @click="handleButtonClick('regeneration', detail)"
        />
        <el-button class="btn" text :icon="Delete" @click="handleButtonClick('delete', detail)" />
        <el-button class="btn" text :icon="More" @click="handleButtonClick('more', detail)" />
      </div>
    </div>
    <div class="image-wrapper" ref="cardImageRef">
      <el-image
        class="image"
        :src="detail?.picUrl"
        :preview-src-list="[detail.picUrl]"
        preview-teleported
      />
      <div v-if="detail?.status === AiImageStatusEnum.FAIL">
        {{ detail?.errorMessage }}
      </div>
    </div>
    <!-- Midjourney Exclusive operation -->
    <div class="image-mj-btns">
      <el-button
        size="small"
        v-for="button in detail?.buttons"
        :key="button"
        class="min-w-40px ml-0 mr-10px mt-5px"
        @click="handleMidjourneyBtnClick(button)"
      >
        {{ button.label }}{{ button.emoji }}
      </el-button>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { Delete, Download, More, RefreshRight } from '@element-plus/icons-vue'
import { ImageVO, ImageMidjourneyButtonsVO } from '@/api/ai/image'
import { PropType } from 'vue'
import { ElLoading, LoadingOptionsResolved } from 'element-plus'
import { AiImageStatusEnum } from '@/views/ai/utils/constants'

const message = useMessage() // news

const props = defineProps({
  detail: {
    type: Object as PropType<ImageVO>,
    require: true
  }
})

const cardImageRef = ref<any>() // card image ref
const cardImageLoadingInstance = ref<any>() // card image ref

/** Handling click events  */
const handleButtonClick = async (type, detail: ImageVO) => {
  emits('onBtnClick', type, detail)
}

/** Handle the click event of the Midjourney button.  */
const handleMidjourneyBtnClick = async (button: ImageMidjourneyButtonsVO) => {
  // Confirm Form
  await message.confirm(`Confirm operation "${button.label} ${button.emoji}" ?`)
  emits('onMjBtnClick', button, props.detail)
}

const emits = defineEmits(['onBtnClick', 'onMjBtnClick']) // emits

/** Monitoring Details */
const { detail } = toRefs(props)
watch(detail, async (newVal, oldVal) => {
  await handleLoading(newVal.status as string)
})

/** Handling loading status */
const handleLoading = async (status: number) => {
  // Situation 1：If it is being generated，Set the loading process loading
  if (status === AiImageStatusEnum.IN_PROGRESS) {
    cardImageLoadingInstance.value = ElLoading.service({
      target: cardImageRef.value,
      text: 'Generating...'
    } as LoadingOptionsResolved)
    // Scenario 2：If the generation has already ended，Remove it loading
  } else {
    if (cardImageLoadingInstance.value) {
      cardImageLoadingInstance.value.close()
      cardImageLoadingInstance.value = null
    }
  }
}

/** initialization */
onMounted(async () => {
  await handleLoading(props.detail.status as string)
})
</script>

<style scoped lang="scss">
.image-card {
  width: 320px;
  height: auto;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;

  .image-operation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .btn {
      //border: 1px solid red;
      padding: 10px;
      margin: 0;
    }
  }

  .image-wrapper {
    overflow: hidden;
    margin-top: 20px;
    height: 280px;
    flex: 1;

    .image {
      width: 100%;
      border-radius: 10px;
    }
  }

  .image-mj-btns {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
