<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="40px" :model="formData">
      <el-form-item label="Article" prop="id">
        <el-select
          v-model="formData.id"
          placeholder="Please select an article"
          class="w-full"
          filterable
          remote
          :remote-method="queryArticleList"
          :loading="loading"
        >
          <el-option
            v-for="article in articles"
            :key="article.id"
            :label="article.title"
            :value="article.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { PromotionArticleProperty } from './config'
import { useVModel } from '@vueuse/core'
import * as ArticleApi from '@/api/mall/promotion/article/index'

// Marketing article attribute panel
defineOptions({ name: 'PromotionArticleProperty' })

const props = defineProps<{ modelValue: PromotionArticleProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
// Article List
const articles = ref<ArticleApi.ArticleVO>([])

// Loading in progress
const loading = ref(false)
// Search article list
const queryArticleList = async (title?: string) => {
  loading.value = true
  const { list } = await ArticleApi.getArticlePage({ title, pageSize: 10 })
  articles.value = list
  loading.value = false
}

// initialization
onMounted(() => {
  queryArticleList()
})
</script>

<style scoped lang="scss"></style>
