<template>
  <el-scrollbar class="z-1 min-h-30px" wrap-class="w-full" ref="containerRef">
    <div
      class="flex flex-row text-12px"
      :style="{
        gap: `${property.space}px`,
        width: scrollbarWidth
      }"
    >
      <div
        class="box-content"
        :style="{
          background: property.bgImg
            ? `url(${property.bgImg}) 100% center / 100% 100% no-repeat`
            : '#fff',
          width: `${couponWidth}px`,
          color: property.textColor
        }"
        v-for="(coupon, index) in couponList"
        :key="index"
      >
        <!-- layout1：1column-->
        <div v-if="property.columns === 1" class="m-l-16px flex flex-row justify-between p-8px">
          <div class="flex flex-col justify-evenly gap-4px">
            <!-- Discount Value -->
            <CouponDiscount :coupon="coupon" />
            <!-- Discount Description -->
            <CouponDiscountDesc :coupon="coupon" />
            <!-- term of validity -->
            <CouponValidTerm :coupon="coupon" />
          </div>
          <div class="flex flex-col justify-evenly">
            <div
              class="rounded-20px p-x-8px p-y-2px"
              :style="{
                color: property.button.color,
                background: property.button.bgColor
              }"
            >
              Get it now
            </div>
          </div>
        </div>
        <!-- layout2：2column-->
        <div
          v-else-if="property.columns === 2"
          class="m-l-16px flex flex-row justify-between p-8px"
        >
          <div class="flex flex-col justify-evenly gap-4px">
            <!-- Discount Value -->
            <CouponDiscount :coupon="coupon" />
            <div>{{ coupon.name }}</div>
          </div>
          <div class="flex flex-col">
            <div
              class="h-full w-20px rounded-20px p-x-2px p-y-8px text-center"
              :style="{
                color: property.button.color,
                background: property.button.bgColor
              }"
            >
              Get it now
            </div>
          </div>
        </div>
        <!-- layout3：3column-->
        <div v-else class="flex flex-col items-center justify-around gap-4px p-4px">
          <!-- Discount Value -->
          <CouponDiscount :coupon="coupon" />
          <div>{{ coupon.name }}</div>
          <div
            class="rounded-20px p-x-8px p-y-2px"
            :style="{
              color: property.button.color,
              background: property.button.bgColor
            }"
          >
            Get it Now
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { CouponCardProperty } from './config'
import * as CouponTemplateApi from '@/api/mall/promotion/coupon/couponTemplate'
import { CouponDiscount } from './component'
import {
  CouponDiscountDesc,
  CouponValidTerm
} from '@/components/DiyEditor/components/mobile/CouponCard/component'

/** Product card */
defineOptions({ name: 'CouponCard' })
// Define attributes
const props = defineProps<{ property: CouponCardProperty }>()
// Product List
const couponList = ref<CouponTemplateApi.CouponTemplateVO[]>([])
watch(
  () => props.property.couponIds,
  async () => {
    if (props.property.couponIds?.length > 0) {
      couponList.value = await CouponTemplateApi.getCouponTemplateList(props.property.couponIds)
    }
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
// Scroll bar width
const scrollbarWidth = ref('100%')
// Width of coupon
const couponWidth = ref(375)
// Calculate layout parameters
watch(
  () => [props.property, phoneWidth, couponList.value.length],
  () => {
    // The width of each column is: (total width - spacing * (number of columns - 1)) / number of columns.
    couponWidth.value =
      (phoneWidth.value * 0.95 - props.property.space * (props.property.columns - 1)) /
      props.property.columns
    // Display scrollbar
    scrollbarWidth.value = `${
      couponWidth.value * couponList.value.length +
      props.property.space * (couponList.value.length - 1)
    }px`
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  // Extract phone width
  phoneWidth.value = containerRef.value?.wrapRef?.offsetWidth || 375
})
</script>
<style scoped lang="scss"></style>
