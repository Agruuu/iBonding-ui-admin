<template>
  <div class="square-container">
    <!-- TODO @Agruuu：style suggest changing to unocss -->
    <!-- TODO @Agruuu：Can the "Search" be replaced with an Icon component? -->
    <el-input
      v-model="queryParams.prompt"
      style="width: 100%; margin-bottom: 20px"
      size="large"
      placeholder="Please enter the content you want to search for"
      :suffix-icon="Search"
      @keyup.enter="handleQuery"
    />
    <div class="gallery">
      <!-- TODO @Agruuu：How about making the style of this picture consistent with the `ImageCard.vue` interface (only having the card without operations)? It gives a stronger sense of a picture frame when viewed this way~~~ -->
      <div v-for="item in list" :key="item.id" class="gallery-item">
        <img :src="item.picUrl" class="img" />
      </div>
    </div>
    <!-- TODO @Agruuu：The pagination function is missing. -->
    <!-- paging -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script setup lang="ts">
import { ImageApi, ImageVO } from '@/api/ai/image'
import { Search } from '@element-plus/icons-vue'

// TODO @Agruuu：Add loading Loading status
const loading = ref(true) // Loading the list
const list = ref<ImageVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  publicStatus: true,
  prompt: undefined
})

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ImageApi.getImagePageMy(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** initialization */
onMounted(async () => {
  await getList()
})
</script>
<style scoped lang="scss">
.square-container {
  background-color: #fff;
  padding: 20px;

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    //max-width: 1000px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .gallery-item {
    position: relative;
    overflow: hidden;
    background: #f0f0f0;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .gallery-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s;
  }

  .gallery-item:hover img {
    transform: scale(1.1);
  }

  .gallery-item:hover {
    transform: scale(1.05);
  }
}
</style>
