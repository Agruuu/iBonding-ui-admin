<template>
  <el-card class="dr-task" body-class="task-card" shadow="never">
    <template #header>
      Painting task
      <!-- TODO @Agruuu：Let's see how to optimize this. -->
      <el-button @click="handleViewPublic">Painting works</el-button>
    </template>
    <!-- Image List -->
    <div class="task-image-list" ref="imageListRef">
      <ImageCard
        v-for="image in imageList"
        :key="image.id"
        :detail="image"
        @on-btn-click="handleImageButtonClick"
        @on-mj-btn-click="handleImageMidjourneyButtonClick"
      />
    </div>
    <div class="task-image-pagination">
      <Pagination
        :total="pageTotal"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getImageList"
      />
    </div>
  </el-card>

  <!-- Image details -->
  <ImageDetail
    :show="isShowImageDetail"
    :id="showImageDetailId"
    @handle-drawer-close="handleDetailClose"
  />
</template>
<script setup lang="ts">
import {
  ImageApi,
  ImageVO,
  ImageMidjourneyActionVO,
  ImageMidjourneyButtonsVO
} from '@/api/ai/image'
import ImageDetail from './ImageDetail.vue'
import ImageCard from './ImageCard.vue'
import { ElLoading, LoadingOptionsResolved } from 'element-plus'
import { AiImageStatusEnum } from '@/views/ai/utils/constants'
import download from '@/utils/download'

const message = useMessage() // Message pop-up window
const router = useRouter() // route

// Parameters related to image pagination
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const pageTotal = ref<number>(0) // page size
const imageList = ref<ImageVO[]>([]) // image list
const imageListLoadingInstance = ref<any>() // image Is the list loading
const imageListRef = ref<any>() // ref
// Parameters related to image polling（Generating in progress）
const inProgressImageMap = ref<{}>({}) // A monitored image mapping. Generally, it's in the process of generation (requiring polling). The key is the image number, and the value is the image.
const inProgressTimer = ref<any>() // An image timer during generation that polls the generation progress.
// Parameters related to image details
const isShowImageDetail = ref<boolean>(false) // Are the image details displayed
const showImageDetailId = ref<number>(0) // Image number for image details

/** Processing and viewing drawing works */
const handleViewPublic = () => {
  router.push({
    name: 'AiImageSquare'
  })
}

/** View the details of the image  */
const handleDetailOpen = async () => {
  isShowImageDetail.value = true
}

/** Close the details of the image  */
const handleDetailClose = async () => {
  isShowImageDetail.value = false
}

/** get image Picture List */
const getImageList = async () => {
  try {
    // 1. Load image list
    imageListLoadingInstance.value = ElLoading.service({
      target: imageListRef.value,
      text: 'Loading in progress...'
    } as LoadingOptionsResolved)
    const { list, total } = await ImageApi.getImagePageMy(queryParams)
    imageList.value = list
    pageTotal.value = total

    // 2. Calculate the images that need to be polled.
    const newWatImages = {}
    imageList.value.forEach((item) => {
      if (item.status === AiImageStatusEnum.IN_PROGRESS) {
        newWatImages[item.id] = item
      }
    })
    inProgressImageMap.value = newWatImages
  } finally {
    // Closing in progress“Loading in progress”of Loading
    if (imageListLoadingInstance.value) {
      imageListLoadingInstance.value.close()
      imageListLoadingInstance.value = null
    }
  }
}

/** In the process of polling generation image list */
const refreshWatchImages = async () => {
  const imageIds = Object.keys(inProgressImageMap.value).map(Number)
  if (imageIds.length == 0) {
    return
  }
  const list = (await ImageApi.getImageListMyByIds(imageIds)) as ImageVO[]
  const newWatchImages = {}
  list.forEach((image) => {
    if (image.status === AiImageStatusEnum.IN_PROGRESS) {
      newWatchImages[image.id] = image
    } else {
      const index = imageList.value.findIndex((oldImage) => image.id === oldImage.id)
      if (index >= 0) {
        // update imageList
        imageList.value[index] = image
      }
    }
  })
  inProgressImageMap.value = newWatchImages
}

/** Click events on images */
const handleImageButtonClick = async (type: string, imageDetail: ImageVO) => {
  // details
  if (type === 'more') {
    showImageDetailId.value = imageDetail.id
    await handleDetailOpen()
    return
  }
  // delete
  if (type === 'delete') {
    await message.confirm(`是否删除照片?`)
    await ImageApi.deleteImageMy(imageDetail.id)
    await getImageList()
    message.success('Delete successfully!')
    return
  }
  // download
  if (type === 'download') {
    await download.image({ url: imageDetail.picUrl })
    return
  }
  // Regenerate
  if (type === 'regeneration') {
    await emits('onRegeneration', imageDetail)
    return
  }
}

/** Handle the click event of the Midjourney button.  */
const handleImageMidjourneyButtonClick = async (
  button: ImageMidjourneyButtonsVO,
  imageDetail: ImageVO
) => {
  // 1. structure params parameter
  const data = {
    id: imageDetail.id,
    customId: button.customId
  } as ImageMidjourneyActionVO
  // 2. send out action
  await ImageApi.midjourneyAction(data)
  // 3. Refresh List 
  await getImageList()
}

defineExpose({ getImageList }) // Exposure component method

const emits = defineEmits(['onRegeneration'])

/** When the component is suspended */
onMounted(async () => {
  // get image list
  await getImageList()
  // auto refresh image list
  inProgressTimer.value = setInterval(async () => {
    await refreshWatchImages()
  }, 1000 * 3)
})

/** When canceling the hanging of a component */
onUnmounted(async () => {
  if (inProgressTimer.value) {
    clearInterval(inProgressTimer.value)
  }
})
</script>
<style lang="scss">
.dr-task {
  width: 100%;
  height: 100%;
}
.task-card {
  margin: 0;
  padding: 0;
  height: 100%;
  position: relative;
}

.task-image-list {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 100%;
  overflow: auto;
  padding: 20px 20px 140px;
  box-sizing: border-box; /* Ensure that the inner margin does not increase in height */

  > div {
    margin-right: 20px;
    margin-bottom: 20px;
  }
  > div:last-of-type {
    //margin-bottom: 100px;
  }
}

.task-image-pagination {
  position: absolute;
  bottom: 60px;
  height: 50px;
  line-height: 90px;
  width: 100%;
  z-index: 999;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
