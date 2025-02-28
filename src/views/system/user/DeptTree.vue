<template>
  <div class="head-container">
    <el-input v-model="deptName" class="mb-20px" clearable placeholder="Please enter the department name">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container">
    <el-tree
      ref="treeRef"
      :data="deptList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="defaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import * as DeptApi from '@/api/system/dept'
import { defaultProps, handleTree } from '@/utils/tree'

defineOptions({ name: 'SystemUserDeptTree' })

const deptName = ref('')
const deptList = ref<Tree[]>([]) // tree structure
const treeRef = ref<InstanceType<typeof ElTree>>()

/** Obtain department tree */
const getTree = async () => {
  const res = await DeptApi.getSimpleDeptList()
  deptList.value = []
  deptList.value.push(...handleTree(res))
}

/** Name based filtering */
const filterNode = (name: string, data: Tree) => {
  if (!name) return true
  return data.name.includes(name)
}

/** Processing department clicked */
const handleNodeClick = async (row: { [key: string]: any }) => {
  emits('node-click', row)
}
const emits = defineEmits(['node-click'])

/** monitor deptName */
watch(deptName, (val) => {
  treeRef.value!.filter(val)
})

/** initialization */
onMounted(async () => {
  await getTree()
})
</script>
