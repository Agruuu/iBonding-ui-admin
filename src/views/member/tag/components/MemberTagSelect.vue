<template>
  <el-select v-model="tagIds" placeholder="Please select a user tag" clearable multiple class="!w-240px">
    <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
  </el-select>
  <el-button
    v-if="showAdd"
    type="primary"
    class="ml-2"
    link
    @click="openForm('create')"
    v-hasPermi="['member:tag:create']"
  >
    Add tags
  </el-button>

  <!-- Form pop-up window：add to -->
  <TagForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import * as TagApi from '@/api/member/tag'
import TagForm from '@/views/member/tag/TagForm.vue'

defineOptions({ name: 'MemberTagSelect' })

const props = defineProps({
  /** Select value from dropdown menu **/
  modelValue: {
    type: Array,
    default: undefined
  },
  /** Is it displayed“Add tags”Button **/
  showAdd: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])
defineExpose({
  showAdd: props.showAdd
})

const tagIds = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})

const tags = ref<TagApi.TagVO[]>([])

const getList = async () => {
  tags.value = await TagApi.getSimpleTagList()
}

/** Add user tag form popup */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** initialization */
onMounted(() => {
  getList()
})
</script>
