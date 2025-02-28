<template>
  <el-scrollbar class="z-1 min-h-30px" wrap-class="w-full" ref="containerRef">
    <!-- Product Grid -->
    <div
      class="grid overflow-x-auto"
      :style="{
        gridGap: `${property.space}px`,
        gridTemplateColumns,
        width: scrollbarWidth
      }"
    >
      <!-- commodity -->
      <div
        class="relative box-content flex flex-row flex-wrap overflow-hidden bg-white"
        :style="{
          borderTopLeftRadius: `${property.borderRadiusTop}px`,
          borderTopRightRadius: `${property.borderRadiusTop}px`,
          borderBottomLeftRadius: `${property.borderRadiusBottom}px`,
          borderBottomRightRadius: `${property.borderRadiusBottom}px`
        }"
        v-for="(spu, index) in spuList"
        :key="index"
      >
        <!-- Corner marker -->
        <div
          v-if="property.badge.show"
          class="absolute left-0 top-0 z-1 items-center justify-center"
        >
          <el-image fit="cover" :src="property.badge.imgUrl" class="h-26px w-38px" />
        </div>
        <!-- Product cover image -->
        <el-image fit="cover" :src="spu.picUrl" :style="{ width: imageSize, height: imageSize }" />
        <div
          :class="[
            'flex flex-col gap-8px p-8px box-border',
            {
              'w-[calc(100%-64px)]': columns === 2,
              'w-full': columns === 3
            }
          ]"
        >
          <!-- Product Name -->
          <div
            v-if="property.fields.name.show"
            class="truncate text-12px"
            :style="{ color: property.fields.name.color }"
          >
            {{ spu.name }}
          </div>
          <div>
            <!-- commodity price -->
            <span
              v-if="property.fields.price.show"
              class="text-12px"
              :style="{ color: property.fields.price.color }"
            >
              ￥{{ fenToYuan(spu.price) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { ProductListProperty } from './config'
import * as ProductSpuApi from '@/api/mall/product/spu'
import { fenToYuan } from '@/utils'

/** Product column */
defineOptions({ name: 'ProductList' })
// Define attributes
const props = defineProps<{ property: ProductListProperty }>()
// Product List
const spuList = ref<ProductSpuApi.Spu[]>([])
watch(
  () => props.property.spuIds,
  async () => {
    spuList.value = await ProductSpuApi.getSpuDetailList(props.property.spuIds)
  },
  {
    immediate: true,
    deep: true
  }
)
// Mobile phone width
const phoneWidth = ref(375)
// container
const containerRef = ref()
// Number of columns for the product
const columns = ref(2)
// Scroll bar width
const scrollbarWidth = ref('100%')
// Product image size
const imageSize = ref('0')
// Number of product network columns
const gridTemplateColumns = ref('')
// Calculate layout parameters
watch(
  () => [props.property, phoneWidth, spuList.value.length],
  () => {
    // Calculate the number of columns
    columns.value = props.property.layoutType === 'twoCol' ? 2 : 3
    // The width of each column is：（Total width - spacing * (Number of columns - 1)）/ Number of columns
    const productWidth =
      (phoneWidth.value - props.property.space * (columns.value - 1)) / columns.value
    // Product image layout：2Column time，Left and right layout 3Column time，Up and down layout
    imageSize.value = columns.value === 2 ? '64px' : `${productWidth}px`
    // According to the layout type，Calculate the number of rows、Number of columns
    if (props.property.layoutType === 'horizSwiper') {
      // Single line display
      gridTemplateColumns.value = `repeat(auto-fill, ${productWidth}px)`
      // Display scrollbar
      scrollbarWidth.value = `${
        productWidth * spuList.value.length + props.property.space * (spuList.value.length - 1)
      }px`
    } else {
      // Specify the number of columns
      gridTemplateColumns.value = `repeat(${columns.value}, auto)`
      // Do not scroll
      scrollbarWidth.value = '100%'
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  // Extract phone width
  phoneWidth.value = containerRef.value?.wrapRef?.offsetWidth || 375
})
</script>

<style scoped lang="scss"></style>
