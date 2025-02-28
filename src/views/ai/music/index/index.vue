<template>
<div class="flex h-full items-stretch">
    <!-- mode -->
    <Mode class="flex-none" @generate-music="generateMusic"/>
    <!-- Audio list -->
    <List ref="listRef" class="flex-auto"/>
  </div>
</template>

<script lang="ts" setup>
import Mode from './mode/index.vue'
import List from './list/index.vue'

defineOptions({ name: 'Index' })

const listRef = ref<Nullable<{generateMusic: (...args) => void}>>(null)

/*
 *@Description: Retrieve the configuration information on the left and call the method for generating music on the right
*/
function generateMusic (args: {formData: Recordable}) {
 unref(listRef)?.generateMusic(args.formData)
}
</script>
