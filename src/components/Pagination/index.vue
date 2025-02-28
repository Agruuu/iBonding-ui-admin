<!-- The core is to simplify useless attributes，And use it ts rewrite -->
<template>
  <el-pagination
    v-show="total > 0"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :background="true"
    :page-sizes="[10, 20, 30, 50, 100]"
    :pager-count="pagerCount"
    :total="total"
    :small="isSmall"
    class="float-right mb-15px mt-15px"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'Pagination' })

// Here, the problem that the style of the pagination component is too large when the global `size` is set to `small` is solved.
const appStore = useAppStore()
const layoutCurrentSize = computed(() => appStore.currentSize)
const isSmall = ref<boolean>(layoutCurrentSize.value === 'small')
watchEffect(() => {
  isSmall.value = layoutCurrentSize.value === 'small'
})

const props = defineProps({
  // Total number of entries
  total: {
    required: true,
    type: Number
  },
  // Current page count：pageNo
  page: {
    type: Number,
    default: 1
  },
  // Number of items displayed per page：pageSize
  limit: {
    type: Number,
    default: 20
  },
  // Set the maximum number of page buttons。 The number of page number buttons，When the total number of pages exceeds this value, it will be folded
  // Default value for the number of page buttons on mobile devices 5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    // Trigger the `update:page` event to update the `limit` attribute, thereby updating the `pageNo`.
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    // Trigger the `update:page` event to update the `limit` attribute, thereby updating the `pageSize`.
    emit('update:limit', val)
  }
})
const handleSizeChange = (val) => {
  // If the modified page exceeds the maximum page size，Force jump to the next step 1 page
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  // trigger pagination event，Reload List
  emit('pagination', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val) => {
  // trigger pagination event，Reload List
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>
