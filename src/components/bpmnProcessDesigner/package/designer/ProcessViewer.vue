<template>
  <div class="process-viewer">
    <div style="height: 100%" ref="processCanvas" v-show="!isLoading"> </div>
    <!-- Customize Arrow Style，Used for process connection arrows in the completed state -->
    <defs ref="customDefs">
      <marker
        id="sequenceflow-end-white-success"
        viewBox="0 0 20 20"
        refX="11"
        refY="10"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          class="success-arrow"
          d="M 1 5 L 11 10 L 1 15 Z"
          style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1"
        />
      </marker>
      <marker
        id="conditional-flow-marker-white-success"
        viewBox="0 0 20 20"
        refX="-1"
        refY="10"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          class="success-conditional"
          d="M 0 10 L 8 6 L 16 10 L 8 14 Z"
          style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1"
        />
      </marker>
    </defs>

    <!-- Approval Record -->
    <el-dialog :title="dialogTitle || 'Approval Record'" v-model="dialogVisible" width="1000px">
      <el-row>
        <el-table
          :data="selectTasks"
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
            label="Approver"
            min-width="100"
            align="center"
            v-if="selectActivityType === 'bpmn:UserTask'"
          >
            <template #default="scope">
              {{ scope.row.assigneeUser?.nickname || scope.row.ownerUser?.nickname }}
            </template>
          </el-table-column>
          <el-table-column
            label="Initiator"
            prop="assigneeUser.nickname"
            min-width="100"
            align="center"
            v-else
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
              <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Approval Suggestion"
            prop="reason"
            min-width="120"
            v-if="selectActivityType === 'bpmn:UserTask'"
          />
          <el-table-column align="center" label="Time Consuming" prop="durationInMillis" width="100">
            <template #default="scope">
              {{ formatPast2(scope.row.durationInMillis) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

    <!-- Zoom：enlarge、narrow -->
    <div style="position: absolute; top: 0; left: 0; width: 100%">
      <el-row type="flex" justify="end">
        <el-button-group key="scale-control" size="default">
          <el-button
            size="default"
            :plain="true"
            :disabled="defaultZoom <= 0.3"
            :icon="ZoomOut"
            @click="processZoomOut()"
          />
          <el-button size="default" style="width: 90px">
            {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
          </el-button>
          <el-button
            size="default"
            :plain="true"
            :disabled="defaultZoom >= 3.9"
            :icon="ZoomIn"
            @click="processZoomIn()"
          />
          <el-button size="default" :icon="ScaleToOriginal" @click="processReZoom()" />
        </el-button-group>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import '../theme/index.scss'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import { ZoomOut, ZoomIn, ScaleToOriginal } from '@element-plus/icons-vue'
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { BpmProcessInstanceStatus } from '@/utils/constants'

const props = defineProps({
  xml: {
    type: String,
    required: true
  },
  view: {
    type: Object,
    require: true
  }
})

const processCanvas = ref()
const bpmnViewer = ref<BpmnViewer | null>(null)
const customDefs = ref()
const defaultZoom = ref(1) // Default zoom ratio
const isLoading = ref(false) // Is it loading

const processInstance = ref<any>({}) // Process Examples
const tasks = ref([]) // Process tasks

const dialogVisible = ref(false) // Pop up visibility
const dialogTitle = ref<string | undefined>(undefined) // Pop up title
const selectActivityType = ref<string | undefined>(undefined) // Select Task Activity Number
const selectTasks = ref<any[]>([]) // Selected task array

/** Zoom：recovery */
const processReZoom = () => {
  defaultZoom.value = 1
  bpmnViewer.value?.get('canvas').zoom('fit-viewport', 'auto')
}

/** Zoom：enlarge */
const processZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value?.get('canvas').zoom(defaultZoom.value)
}

/** Zoom：narrow */
const processZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value?.get('canvas').zoom(defaultZoom.value)
}

/** Preview and clear the flowchart */
const clearViewer = () => {
  if (processCanvas.value) {
    processCanvas.value.innerHTML = ''
  }
  if (bpmnViewer.value) {
    bpmnViewer.value.destroy()
  }
  bpmnViewer.value = null
}

/** Add custom arrows */
// TODO Agruuu：Custom arrows do not take effect，It's a bit strange！！！！dependent marker-end、marker-start I have also provided annotations temporarily！！！
const addCustomDefs = () => {
  if (!bpmnViewer.value) {
    return
  }
  const canvas = bpmnViewer.value?.get('canvas')
  const svg = canvas?._svg
  svg.appendChild(customDefs.value)
}

/** Node selection */
const onSelectElement = (element: any) => {
  // Clear the original selection
  selectActivityType.value = undefined
  dialogTitle.value = undefined
  if (!element || !processInstance.value?.id) {
    return
  }

  // UserTask situation
  const activityType = element.type
  selectActivityType.value = activityType
  if (activityType === 'bpmn:UserTask') {
    dialogTitle.value = element.businessObject ? element.businessObject.name : undefined
    selectTasks.value = tasks.value.filter((item: any) => item?.taskDefinitionKey === element.id)
    dialogVisible.value = true
  } else if (activityType === 'bpmn:EndEvent' || activityType === 'bpmn:StartEvent') {
    dialogTitle.value = 'Approval Information'
    selectTasks.value = [
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

/** initialization BPMN view */
const importXML = async (xml: string) => {
  // Clear process diagram
  clearViewer()

  // Initialization flowchart
  if (xml != null && xml !== '') {
    try {
      bpmnViewer.value = new BpmnViewer({
        additionalModules: [MoveCanvasModule],
        container: processCanvas.value
      })
      // Add click events
      bpmnViewer.value.on('element.click', ({ element }) => {
        onSelectElement(element)
      })

      // initialization BPMN view
      isLoading.value = true
      await bpmnViewer.value.importXML(xml)
      // Custom success arrow
      addCustomDefs()
    } catch (e) {
      clearViewer()
    } finally {
      isLoading.value = false
      // Highlighting process
      setProcessStatus(props.view)
    }
  }
}

/** Highlighting process */
const setProcessStatus = (view: any) => {
  // Set related variables
  if (!view || !view.processInstance) {
    return
  }
  processInstance.value = view.processInstance
  tasks.value = view.tasks
  if (isLoading.value || !bpmnViewer.value) {
    return
  }
  const {
    unfinishedTaskActivityIds,
    finishedTaskActivityIds,
    finishedSequenceFlowActivityIds,
    rejectedTaskActivityIds
  } = view
  const canvas = bpmnViewer.value.get('canvas')
  const elementRegistry = bpmnViewer.value.get('elementRegistry')

  // Completed node
  if (Array.isArray(finishedSequenceFlowActivityIds)) {
    finishedSequenceFlowActivityIds.forEach((item: any) => {
      if (item != null) {
        canvas.addMarker(item, 'success')
        const element = elementRegistry.get(item)
        const conditionExpression = element.businessObject.conditionExpression
        if (conditionExpression) {
          canvas.addMarker(item, 'condition-expression')
        }
      }
    })
  }
  if (Array.isArray(finishedTaskActivityIds)) {
    finishedTaskActivityIds.forEach((item: any) => canvas.addMarker(item, 'success'))
  }

  // Unfinished nodes
  if (Array.isArray(unfinishedTaskActivityIds)) {
    unfinishedTaskActivityIds.forEach((item: any) => canvas.addMarker(item, 'primary'))
  }

  // Rejected node
  if (Array.isArray(rejectedTaskActivityIds)) {
    rejectedTaskActivityIds.forEach((item: any) => {
      if (item != null) {
        canvas.addMarker(item, 'danger')
      }
    })
  }

  // Special: Handle the highlighting of the end node. Because when there is a rejection or cancellation, the backend includes the end node in the finishedTaskActivityIds.
  if (
    [BpmProcessInstanceStatus.CANCEL, BpmProcessInstanceStatus.REJECT].includes(
      processInstance.value.status
    )
  ) {
    const endNodes = elementRegistry.filter((element: any) => element.type === 'bpmn:EndEvent')
    endNodes.forEach((item: any) => {
      canvas.removeMarker(item.id, 'success')
      if (processInstance.value.status === BpmProcessInstanceStatus.CANCEL) {
        canvas.addMarker(item.id, 'cancel')
      } else {
        canvas.addMarker(item.id, 'danger')
      }
    })
  }
}

watch(
  () => props.xml,
  (newXml) => {
    importXML(newXml)
  },
  { immediate: true }
)

watch(
  () => props.view,
  (newView) => {
    setProcessStatus(newView)
  },
  { immediate: true }
)

/** mounted：initialization */
onMounted(() => {
  importXML(props.xml)
  setProcessStatus(props.view)
})

/** unmount：Destruction */
onBeforeUnmount(() => {
  clearViewer()
})
</script>
