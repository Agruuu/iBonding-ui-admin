<template>
  <div class="end-node-wrapper">
    <div class="end-node-box cursor-pointer" :class="`${useTaskStatusClass(currentNode?.activityStatus)}`" @click="nodeClick">
      <span class="node-fixed-name" title="End">End</span>
    </div>
  </div>
  <el-dialog title="Approval Information" v-model="dialogVisible" width="1000px" append-to-body>
      <el-row>
        <el-table
          :data="processInstanceInfos"
          size="small"
          border
          header-cell-class-name="table-header-gray"
        >
          <el-table-column
            label="ID"
            header-align="center"
            align="center"
            type="index"
            width="50"
          />
          <el-table-column
            label="Initiator"
            prop="assigneeUser.nickname"
            min-width="100"
            align="center"
          />
          <el-table-column label="Department" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.assigneeUser?.deptName || scope.row.ownerUser?.deptName }}
            </template>
          </el-table-column>
          <el-table-column
            :formatter="dateFormatter"
            align="center"
            label="Start Time"
            prop="createTime"
            min-width="140"
          />
          <el-table-column
            :formatter="dateFormatter"
            align="center"
            label="End Time"
            prop="endTime"
            min-width="140"
          />
          <el-table-column align="center" label="Approval Status" prop="status" min-width="90">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
         
          <el-table-column align="center" label="Duration" prop="durationInMillis" width="100">
            <template #default="scope">
              {{ formatPast2(scope.row.durationInMillis) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
</template>
<script setup lang="ts">
import { SimpleFlowNode } from '../consts'
import { useWatchNode, useTaskStatusClass } from '../node'
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
defineOptions({
  name: 'EndEventNode'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  }
})
// Monitoring node changes
const currentNode = useWatchNode(props)
// Read only or not
const readonly = inject<Boolean>('readonly')
const processInstance = inject<Ref<any>>('processInstance', ref({}))
// Pop up display of approval information，Used for read-only mode
const dialogVisible = ref(false) // Pop up visibility
const processInstanceInfos = ref<any[]>([]) // Approval information for the process

const nodeClick = () => {
  if (readonly) { 
    if(processInstance && processInstance.value){
      processInstanceInfos.value = [
      {
        assigneeUser: processInstance.value.startUser,
        createTime: processInstance.value.startTime,
        endTime: processInstance.value.endTime,
        status: processInstance.value.status,
        durationInMillis: processInstance.value.durationInMillis
      }
    ]
      dialogVisible.value = true
    }
  }
}
</script>
<style lang="scss" scoped></style>
