<template>
  <div class="min-h-30px" v-html="article?.content"></div>
</template>
<script setup lang="ts">
import { PromotionArticleProperty } from './config'

/** Marketing articles */
defineOptions({ name: 'PromotionArticle' })
// Define attributes
const props = defineProps<{ property: PromotionArticleProperty }>()
// Product List
const article = ref<ArticleApi.ArticleVO>()
watch(
  () => props.property.id,
  async () => {
    if (props.property.id) {
      article.value = await ArticleApi.getArticle(props.property.id)
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss"></style>
