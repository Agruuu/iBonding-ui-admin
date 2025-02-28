<template>
  <div :class="`box-content min-h-30px w-full flex flex-row flex-wrap`" ref="containerRef">
    <div
      class="relative box-content flex flex-row flex-wrap overflow-hidden bg-white"
      :style="{
        ...calculateSpace(index),
        ...calculateWidth(),
        borderTopLeftRadius: `${property.borderRadiusTop}px`,
        borderTopRightRadius: `${property.borderRadiusTop}px`,
        borderBottomLeftRadius: `${property.borderRadiusBottom}px`,
        borderBottomRightRadius: `${property.borderRadiusBottom}px`
      }"
      v-for="(spu, index) in spuList"
      :key="index"
    >
      <!-- Corner marker -->
      <div v-if="property.badge.show" class="absolute left-0 top-0 z-1 items-center justify-center">
        <el-image fit="cover" :src="property.badge.imgUrl" class="h-26px w-38px" />
      </div>
      <!-- Product cover image -->
      <div
        :class="[
          'h-140px',
          {
            'w-full': property.layoutType !== 'oneColSmallImg',
            'w-140px': property.layoutType === 'oneColSmallImg'
          }
        ]"
      >
        <el-image fit="cover" class="h-full w-full" :src="spu.picUrl" />
      </div>
      <div
        :class="[
          ' flex flex-col gap-8px p-8px box-border',
          {
            'w-full': property.layoutType !== 'oneColSmallImg',
            'w-[calc(100%-140px-16px)]': property.layoutType === 'oneColSmallImg'
          }
        ]"
      >
        <!-- Product Name -->
        <div
          v-if="property.fields.name.show"
          :class="[
            'text-14px ',
            {
              truncate: property.layoutType !== 'oneColSmallImg',
              'overflow-ellipsis line-clamp-2': property.layoutType === 'oneColSmallImg'
            }
          ]"
          :style="{ color: property.fields.name.color }"
        >
          {{ spu.name }}
        </div>
        <!-- Product Introduction -->
        <div
          v-if="property.fields.introduction.show"
          class="truncate text-12px"
          :style="{ color: property.fields.introduction.color }"
        >
          {{ spu.introduction }}
        </div>
        <div>
          <!-- Price -->
          <span
            v-if="property.fields.price.show"
            class="text-16px"
            :style="{ color: property.fields.price.color }"
          >
            ￥{{ fenToYuan(spu.price as any) }}
          </span>
          <!-- market value -->
          <span
            v-if="property.fields.marketPrice.show && spu.marketPrice"
            class="ml-4px text-10px line-through"
            :style="{ color: property.fields.marketPrice.color }"
            >￥{{ fenToYuan(spu.marketPrice) }}
          </span>
        </div>
        <div class="text-12px">
          <!-- sales volume -->
          <span
            v-if="property.fields.salesCount.show"
            :style="{ color: property.fields.salesCount.color }"
          >
            Sold {{ (spu.salesCount || 0) + (spu.virtualSalesCount || 0) }} piece
          </span>
          <!-- stock -->
          <span v-if="property.fields.stock.show" :style="{ color: property.fields.stock.color }">
            Stock {{ spu.stock || 0 }}
          </span>
        </div>
      </div>
      <!-- Purchase button -->
      <div class="absolute bottom-8px right-8px">
        <!-- text button -->
        <span
          v-if="property.btnBuy.type === 'text'"
          class="rounded-full p-x-12px p-y-4px text-12px text-white"
          :style="{
            background: `linear-gradient(to right, ${property.btnBuy.bgBeginColor}, ${property.btnBuy.bgEndColor}`
          }"
        >
          {{ property.btnBuy.text }}
        </span>
        <!-- Image button -->
        <el-image
          v-else
          class="h-28px w-28px rounded-full"
          fit="cover"
          :src="property.btnBuy.imgUrl"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ProductCardProperty } from './config'
import * as ProductSpuApi from '@/api/mall/product/spu'
import { fenToYuan } from '../../../../../utils'

/** Product card */
defineOptions({ name: 'ProductCard' })
// Define attributes
const props = defineProps<{ property: ProductCardProperty }>()
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

/**
 * Calculate the spacing between products
 * @param index Product Index
 */
const calculateSpace = (index: number) => {
  // Number of columns for the product
  const columns = props.property.layoutType === 'twoCol' ? 2 : 1
  // The first column has no left margin
  const marginLeft = index % columns === 0 ? '0' : props.property.space + 'px'
  // The first line has no top margin
  const marginTop = index < columns ? '0' : props.property.space + 'px'

  return { marginLeft, marginTop }
}

// container
const containerRef = ref()
// Calculate the width of the product
const calculateWidth = () => {
  let width = '100%'
  // The width of each column in double row is：（Total width - spacing）/ 2
  if (props.property.layoutType === 'twoCol') {
    width = `${(containerRef.value.offsetWidth - props.property.space) / 2}px`
  }
  return { width }
}
</script>

<style scoped lang="scss"></style>
