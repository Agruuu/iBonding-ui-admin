<template>
  <div ref="containerRef" :class="`box-content min-h-30px w-full flex flex-row flex-wrap`">
    <div
      v-for="(spu, index) in spuList"
      :key="index"
      :style="{
        ...calculateSpace(index),
        ...calculateWidth(),
        borderTopLeftRadius: `${property.borderRadiusTop}px`,
        borderTopRightRadius: `${property.borderRadiusTop}px`,
        borderBottomLeftRadius: `${property.borderRadiusBottom}px`,
        borderBottomRightRadius: `${property.borderRadiusBottom}px`
      }"
      class="relative box-content flex flex-row flex-wrap overflow-hidden bg-white"
    >
      <!-- Corner marker -->
      <div v-if="property.badge.show" class="absolute left-0 top-0 z-1 items-center justify-center">
        <el-image :src="property.badge.imgUrl" class="h-26px w-38px" fit="cover" />
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
        <el-image :src="spu.picUrl" class="h-full w-full" fit="cover" />
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
          :style="{ color: property.fields.introduction.color }"
          class="truncate text-12px"
        >
          {{ spu.introduction }}
        </div>
        <div>
          <!-- integral -->
          <span
            v-if="property.fields.price.show"
            :style="{ color: property.fields.price.color }"
            class="text-16px"
          >
            {{ spu.point }} Integral
            {{ !spu.pointPrice || spu.pointPrice === 0 ? '' : `+${fenToYuan(spu.pointPrice)} euro` }}
          </span>
          <!-- market value -->
          <span
            v-if="property.fields.marketPrice.show && spu.marketPrice"
            :style="{ color: property.fields.marketPrice.color }"
            class="ml-4px text-10px line-through"
          >
            ￥{{ fenToYuan(spu.marketPrice) }}
          </span>
        </div>
        <div class="text-12px">
          <!-- sales volume -->
          <span
            v-if="property.fields.salesCount.show"
            :style="{ color: property.fields.salesCount.color }"
          >
            Already redeemed {{ (spu.pointTotalStock || 0) - (spu.pointStock || 0) }} piece
          </span>
          <!-- stock -->
          <span v-if="property.fields.stock.show" :style="{ color: property.fields.stock.color }">
            stock {{ spu.pointTotalStock || 0 }}
          </span>
        </div>
      </div>
      <!-- Purchase button -->
      <div class="absolute bottom-8px right-8px">
        <!-- text button -->
        <span
          v-if="property.btnBuy.type === 'text'"
          :style="{
            background: `linear-gradient(to right, ${property.btnBuy.bgBeginColor}, ${property.btnBuy.bgEndColor}`
          }"
          class="rounded-full p-x-12px p-y-4px text-12px text-white"
        >
          {{ property.btnBuy.text }}
        </span>
        <!-- Image button -->
        <el-image
          v-else
          :src="property.btnBuy.imgUrl"
          class="h-28px w-28px rounded-full"
          fit="cover"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PromotionPointProperty } from './config'
import * as ProductSpuApi from '@/api/mall/product/spu'
import { PointActivityApi, PointActivityVO, SpuExtension0 } from '@/api/mall/promotion/point'
import { fenToYuan } from '@/utils'

/** Points Mall Card */
defineOptions({ name: 'PromotionPoint' })
// Define attributes
const props = defineProps<{ property: PromotionPointProperty }>()
// Product List
const spuList = ref<SpuExtension0[]>([])
const spuIdList = ref<number[]>([])
const pointActivityList = ref<PointActivityVO[]>([])

watch(
  () => props.property.activityIds,
  async () => {
    try {
      // The newly added component of the points mall doesn't have an activity ID.
      const activityIds = props.property.activityIds
      // Check the validity of the activity ID.
      if (Array.isArray(activityIds) && activityIds.length > 0) {
        // Get the detailed list of points mall activities
        pointActivityList.value = await PointActivityApi.getPointActivityListByIds(activityIds)

        // Get the SPU details list of the points mall activity.
        spuList.value = []
        spuIdList.value = pointActivityList.value.map((activity) => activity.spuId)
        if (spuIdList.value.length > 0) {
          spuList.value = await ProductSpuApi.getSpuDetailList(spuIdList.value)
        }

        // Update the minimum redemption points and the required redemption amount for the SPU.
        pointActivityList.value.forEach((activity) => {
          // matching spuId
          const spu = spuList.value.find((spu) => spu.id === activity.spuId)
          if (spu) {
            spu.pointStock = activity.stock
            spu.pointTotalStock = activity.totalStock
            spu.point = activity.point
            spu.pointPrice = activity.price
          }
        })
      }
    } catch (error) {
      console.error('An error occurred when getting the details of the point mall activity or SPU details.:', error)
    }
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

<style lang="scss" scoped></style>
