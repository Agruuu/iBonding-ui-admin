<template>
  <div class="category-list">
    <div class="category" v-for="category in categoryList" :key="category">
      <el-button
        plain
        round
        size="small"
        :type="category === active ? 'primary' : ''"
        @click="handleCategoryClick(category)"
      >
        {{ category }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'

// Define attributes
defineProps({
  categoryList: {
    type: Array as PropType<string[]>,
    required: true
  },
  active: {
    type: String,
    required: false,
    default: 'All'
  }
})

// Define callback
const emits = defineEmits(['onCategoryClick'])

/** Handling category click events */
const handleCategoryClick = async (category: string) => {
  emits('onCategoryClick', category)
}
</script>
<style scoped lang="scss">
.category-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  .category {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
  }
}
</style>
