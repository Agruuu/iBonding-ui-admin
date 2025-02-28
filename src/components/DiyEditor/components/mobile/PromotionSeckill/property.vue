<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-card header="Seckill Activity" class="property-group" shadow="never">
        <SeckillShowcase v-model="formData.activityIds" />
      </el-card>
      <el-card header="Product Style" class="property-group" shadow="never">
        <el-form-item label="Layout" prop="type">
          <el-radio-group v-model="formData.layoutType">
            <el-tooltip class="item" content="Single column large image" placement="bottom">
              <el-radio-button value="oneColBigImg">
                <Icon icon="fluent:text-column-one-24-filled" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="Single column diagram" placement="bottom">
              <el-radio-button value="oneColSmallImg">
                <Icon icon="fluent:text-column-two-left-24-filled" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="Double Columns" placement="bottom">
              <el-radio-button value="twoCol">
                <Icon icon="fluent:text-column-two-24-filled" />
              </el-radio-button>
            </el-tooltip>
            <!--<el-tooltip class="item" content="Three Columns" placement="bottom">
              <el-radio-button value="threeCol">
                <Icon icon="fluent:text-column-three-24-filled" />
              </el-radio-button>
            </el-tooltip>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Name" prop="fields.name.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.name.color" />
            <el-checkbox v-model="formData.fields.name.show" />
          </div>
        </el-form-item>
        <el-form-item label="Introduction" prop="fields.introduction.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.introduction.color" />
            <el-checkbox v-model="formData.fields.introduction.show" />
          </div>
        </el-form-item>
        <el-form-item label="Price" prop="fields.price.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.price.color" />
            <el-checkbox v-model="formData.fields.price.show" />
          </div>
        </el-form-item>
        <el-form-item label="Market Price" prop="fields.marketPrice.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.marketPrice.color" />
            <el-checkbox v-model="formData.fields.marketPrice.show" />
          </div>
        </el-form-item>
        <el-form-item label="Sales Count" prop="fields.salesCount.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.salesCount.color" />
            <el-checkbox v-model="formData.fields.salesCount.show" />
          </div>
        </el-form-item>
        <el-form-item label="Stock" prop="fields.stock.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.stock.color" />
            <el-checkbox v-model="formData.fields.stock.show" />
          </div>
        </el-form-item>
      </el-card>
      <el-card header="Badge" class="property-group" shadow="never">
        <el-form-item label="Badge" prop="badge.show">
          <el-switch v-model="formData.badge.show" />
        </el-form-item>
        <el-form-item label="Badge" prop="badge.imgUrl" v-if="formData.badge.show">
          <UploadImg v-model="formData.badge.imgUrl" height="44px" width="72px">
            <template #tip> Suggested Size：36 * 22</template>
          </UploadImg>
        </el-form-item>
      </el-card>
      <el-card header="Button" class="property-group" shadow="never">
        <el-form-item label="Button Type" prop="btnBuy.type">
          <el-radio-group v-model="formData.btnBuy.type">
            <el-radio-button value="text">Text</el-radio-button>
            <el-radio-button value="img">Image</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.btnBuy.type === 'text'">
          <el-form-item label="Button Text" prop="btnBuy.text">
            <el-input v-model="formData.btnBuy.text" />
          </el-form-item>
          <el-form-item label="Left Background" prop="btnBuy.bgBeginColor">
            <ColorInput v-model="formData.btnBuy.bgBeginColor" />
          </el-form-item>
          <el-form-item label="Right Background" prop="btnBuy.bgEndColor">
            <ColorInput v-model="formData.btnBuy.bgEndColor" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="Image" prop="btnBuy.imgUrl">
            <UploadImg v-model="formData.btnBuy.imgUrl" height="56px" width="56px">
              <template #tip> Suggested Size：56 * 56</template>
            </UploadImg>
          </el-form-item>
        </template>
      </el-card>
      <el-card header="Product Style" class="property-group" shadow="never">
        <el-form-item label="Top Rounded Corner" prop="borderRadiusTop">
          <el-slider
            v-model="formData.borderRadiusTop"
            :max="100"
            :min="0"
            show-input
            input-size="small"
            :show-input-controls="false"
          />
        </el-form-item>
        <el-form-item label="Bottom Rounded Corner" prop="borderRadiusBottom">
          <el-slider
            v-model="formData.borderRadiusBottom"
            :max="100"
            :min="0"
            show-input
            input-size="small"
            :show-input-controls="false"
          />
        </el-form-item>
        <el-form-item label="Interval" prop="space">
          <el-slider
            v-model="formData.space"
            :max="100"
            :min="0"
            show-input
            input-size="small"
            :show-input-controls="false"
          />
        </el-form-item>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { PromotionSeckillProperty } from './config'
import { useVModel } from '@vueuse/core'
import * as SeckillActivityApi from '@/api/mall/promotion/seckill/seckillActivity'
import { CommonStatusEnum } from '@/utils/constants'
import SeckillShowcase from '@/views/mall/promotion/seckill/components/SeckillShowcase.vue'

// Flash Kill Attribute Panel
defineOptions({ name: 'PromotionSeckillProperty' })

const props = defineProps<{ modelValue: PromotionSeckillProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
// Activity List
const activityList = ref<SeckillActivityApi.SeckillActivityVO[]>([])
onMounted(async () => {
  const { list } = await SeckillActivityApi.getSeckillActivityPage({
    status: CommonStatusEnum.ENABLE
  })
  activityList.value = list
})
</script>

<style scoped lang="scss"></style>
