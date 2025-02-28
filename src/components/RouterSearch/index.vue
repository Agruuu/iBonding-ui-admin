<template>
  <ElDialog v-if="isModal" v-model="showSearch" :show-close="false" title="Menu Search">
    <el-select
      filterable
      :reserve-keyword="false"
      remote
      placeholder="Please enter the menu content"
      :remote-method="remoteMethod"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </ElDialog>
  <div v-else class="custom-hover" @click.stop="showTopSearch = !showTopSearch">
    <Icon icon="ep:search" />
    <el-select
      @click.stop
      filterable
      :reserve-keyword="false"
      remote
      placeholder="Please enter the menu content"
      :remote-method="remoteMethod"
      class="overflow-hidden transition-all-600"
      :class="showTopSearch ? '!w-220px ml2' : '!w-0'"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isModal: {
    type: Boolean,
    default: true
  }
})

const router = useRouter() // Routing object
const showSearch = ref(false) // Do you want to display a pop-up box
const showTopSearch = ref(false) // Do you want to display the top search box
const value: Ref = ref('') // The value entered by the user

const routers = router.getRoutes() // Routing object
const options = computed(() => {
  // prompt option
  if (!value.value) {
    return []
  }
  const list = routers.filter((item: any) => {
    if (item.meta.title?.indexOf(value.value) > -1 || item.path.indexOf(value.value) > -1) {
      return true
    }
  })
  return list.map((item) => {
    return {
      label: `${item.meta.title}${item.path}`,
      value: item.path
    }
  })
})

function remoteMethod(data) {
  // Corresponding operations can be performed here（For example, opening the search box, etc）
  value.value = data
}

function handleChange(path) {
  router.push({ path })
  hiddenSearch()
  hiddenTopSearch()
}

function hiddenSearch() {
  showSearch.value = false
}

function hiddenTopSearch() {
  showTopSearch.value = false
}

onMounted(() => {
  window.addEventListener('keydown', listenKey)
  window.addEventListener('click', hiddenTopSearch)
})

onUnmounted(() => {
  window.removeEventListener('keydown', listenKey)
  window.removeEventListener('click', hiddenTopSearch)
})

// monitor ctrl + k
function listenKey(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    // Prevent triggering browser default events
    event.preventDefault()
    showSearch.value = !showSearch.value
    // Corresponding operations can be performed here（For example, opening the search box, etc）
  }
}

defineExpose({
  openSearch: () => {
    showSearch.value = true
  }
})
</script>
