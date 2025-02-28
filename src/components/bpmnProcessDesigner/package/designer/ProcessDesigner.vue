<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header" style="z-index: 999; display: table-row-group">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">
        <ElButtonGroup key="file-control">
          <XButton preIcon="ep:folder-opened" title="Open File" @click="refFile.click()" />
          <el-tooltip effect="light" placement="bottom">
            <template #content>
              <div style="color: #409eff">
                <!-- <el-button link @click="downloadProcessAsXml()">Download as XML file</el-button> -->
                <XTextButton title="Download as XML file" @click="downloadProcessAsXml()" />
                <br />

                <!-- <el-button link @click="downloadProcessAsSvg()">Download as SVG file</el-button> -->
                <XTextButton title="Download as SVG file" @click="downloadProcessAsSvg()" />
                <br />

                <!-- <el-button link @click="downloadProcessAsBpmn()">Download as BPMN file</el-button> -->
                <XTextButton title="Download as BPMN file" @click="downloadProcessAsBpmn()" />
              </div>
            </template>
            <XButton title="Download file" preIcon="ep:download" />
          </el-tooltip>
          <el-tooltip effect="light">
            <XButton preIcon="ep:view" title="Preview" />
            <template #content>
              <!-- <el-button link @click="previewProcessXML">Preview XML</el-button> -->
              <XTextButton title="Preview XML" @click="previewProcessXML" />
              <br />
              <!-- <el-button link @click="previewProcessJson">Preview JSON</el-button> -->
              <XTextButton title="Preview JSON" @click="previewProcessJson" />
            </template>
          </el-tooltip>
          <el-tooltip
            v-if="props.simulation"
            effect="light"
            :content="simulationStatus ? 'Exit Simulation' : 'Enable Simulation'"
          >
            <XButton preIcon="ep:cpu" title="Simulation" @click="processSimulation" />
          </el-tooltip>
        </ElButtonGroup>
        <ElButtonGroup key="align-control">
          <el-tooltip effect="light" content="Align to the left">
            <!-- <el-button
              class="align align-left"
              icon="el-icon-s-data"
              @click="elementsAlign('left')"
            /> -->
            <XButton
              preIcon="fa:align-left"
              class="align align-bottom"
              @click="elementsAlign('left')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="Align to the right">
            <!-- <el-button
              class="align align-right"
              icon="el-icon-s-data"
              @click="elementsAlign('right')"
            /> -->
            <XButton
              preIcon="fa:align-left"
              class="align align-top"
              @click="elementsAlign('right')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="Align upwards">
            <!-- <el-button
              class="align align-top"
              icon="el-icon-s-data"
              @click="elementsAlign('top')"
            /> -->
            <XButton
              preIcon="fa:align-left"
              class="align align-left"
              @click="elementsAlign('top')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="Align downwards">
            <!-- <el-button
              class="align align-bottom"
              icon="el-icon-s-data"
              @click="elementsAlign('bottom')"
            /> -->
            <XButton
              preIcon="fa:align-left"
              class="align align-right"
              @click="elementsAlign('bottom')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="Horizontally">
            <!-- <el-button
              class="align align-center"
              icon="el-icon-s-data"
              @click="elementsAlign('center')"
            /> -->
            <!-- class="align align-center" -->
            <XButton
              preIcon="fa:align-left"
              class="align align-center"
              @click="elementsAlign('center')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="Vertically centered">
            <!-- <el-button
              class="align align-middle"
              icon="el-icon-s-data"
              @click="elementsAlign('middle')"
            /> -->
            <XButton
              preIcon="fa:align-left"
              class="align align-middle"
              @click="elementsAlign('middle')"
            />
          </el-tooltip>
        </ElButtonGroup>
        <ElButtonGroup key="scale-control">
          <el-tooltip effect="light" content="Zoom out view">
            <!-- <el-button
              :disabled="defaultZoom < 0.2"
              icon="el-icon-zoom-out"
              @click="processZoomOut()"
            /> -->
            <XButton
              preIcon="ep:zoom-out"
              @click="processZoomOut()"
              :disabled="defaultZoom < 0.2"
            />
          </el-tooltip>
          <el-button>{{ Math.floor(defaultZoom * 10 * 10) + '%' }}</el-button>
          <el-tooltip effect="light" content="Zoom in view">
            <!-- <el-button
              :disabled="defaultZoom > 4"
              icon="el-icon-zoom-in"
              @click="processZoomIn()"
            /> -->
            <XButton preIcon="ep:zoom-in" @click="processZoomIn()" :disabled="defaultZoom > 4" />
          </el-tooltip>
          <el-tooltip effect="light" content="Reset the view and center it">
            <!-- <el-button icon="el-icon-c-scale-to-original" @click="processReZoom()" /> -->
            <XButton preIcon="ep:scale-to-original" @click="processReZoom()" />
          </el-tooltip>
        </ElButtonGroup>
        <ElButtonGroup key="stack-control">
          <el-tooltip effect="light" content="Revoke">
            <!-- <el-button :disabled="!revocable" icon="el-icon-refresh-left" @click="processUndo()" /> -->
            <XButton preIcon="ep:refresh-left" @click="processUndo()" :disabled="!revocable" />
          </el-tooltip>
          <el-tooltip effect="light" content="Recovery">
            <!-- <el-button
              :disabled="!recoverable"
              icon="el-icon-refresh-right"
              @click="processRedo()"
            /> -->
            <XButton preIcon="ep:refresh-right" @click="processRedo()" :disabled="!recoverable" />
          </el-tooltip>
          <el-tooltip effect="light" content="Redraw">
            <!-- <el-button icon="el-icon-refresh" @click="processRestart" /> -->
            <XButton preIcon="ep:refresh" @click="processRestart()" />
          </el-tooltip>
        </ElButtonGroup>
      </template>
      <!-- Used to open local files-->
      <input
        type="file"
        id="files"
        ref="refFile"
        style="display: none"
        accept=".xml, .bpmn"
        @change="importLocalFile"
      />
    </div>
    <div class="my-process-designer__container">
      <div
        class="my-process-designer__canvas"
        ref="bpmnCanvas"
        id="bpmnCanvas"
        style="width: 1680px; height: 800px"
      ></div>
      <!-- <div id="js-properties-panel" class="panel"></div> -->
      <!-- <div class="my-process-designer__canvas" ref="bpmn-canvas"></div> -->
    </div>
    <Dialog
      title="Preview"
      v-model="previewModelVisible"
      width="80%"
      :scroll="true"
      max-height="600px"
    >
      <!-- append-to-body -->
      <div v-highlight>
        <code class="hljs">
          <!-- Highlight code block -->
          {{ previewResult }}
        </code>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
// import 'bpmn-js/dist/assets/diagram-js.css' // Styles of the left toolbar and editing nodes
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // Right side frame style
import { ElMessage, ElMessageBox } from 'element-plus'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DefaultEmptyXML from './plugins/defaultEmpty'
// Translation methods
import customTranslate from './plugins/translate/customTranslate'
import translationsCN from './plugins/translate/zh'
// Simulate the circulation process
import tokenSimulation from 'bpmn-js-token-simulation'
// Tag parsing builder
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// Tag parsing Moddle
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
// Tag parsing Extension
import camundaModdleExtension from './plugins/extension-moddle/camunda'
import activitiModdleExtension from './plugins/extension-moddle/activiti'
import flowableModdleExtension from './plugins/extension-moddle/flowable'
// introduce json conversion and highlighting
// import xml2js from 'xml-js'
// import xml2js from 'fast-xml-parser'
import { XmlNode, XmlNodeType, parseXmlString } from 'steady-xml'
// Code Highlighting Plugin
// import hljs from 'highlight.js/lib/highlight'
// import 'highlight.js/styles/github-gist.css'
// hljs.registerLanguage('xml', 'highlight.js/lib/languages/xml')
// hljs.registerLanguage('json', 'highlight.js/lib/languages/json')
// const eventName = reactive({
//   name: ''
// })

defineOptions({ name: 'MyProcessDesigner' })

const bpmnCanvas = ref()
const refFile = ref()
const emit = defineEmits([
  'destroy',
  'init-finished',
  'save',
  'commandStack-changed',
  'input',
  'change',
  'canvas-viewbox-changed',
  // eventName.name
  'element-click'
])

const props = defineProps({
  value: String, // xml character string
  // valueWatch: true, // xml The string's watch state
  processId: String, // technological process key identification
  processName: String, // technological process name name
  formId: Number, // technological process form Form number
  translations: {
    // Customized translation file
    type: Object,
    default: () => {}
  },
  additionalModel: [Object, Array], // custom model
  moddleExtension: {
    // custom moddle
    type: Object,
    default: () => {}
  },
  onlyCustomizeAddi: {
    type: Boolean,
    default: false
  },
  onlyCustomizeModdle: {
    type: Boolean,
    default: false
  },
  simulation: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  prefix: {
    type: String,
    default: 'camunda'
  },
  events: {
    type: Array,
    default: () => ['element.click']
  },
  headerButtonSize: {
    type: String,
    default: 'small',
    validator: (value: string) => ['default', 'medium', 'small', 'mini'].indexOf(value) !== -1
  },
  headerButtonType: {
    type: String,
    default: 'primary',
    validator: (value: string) =>
      ['default', 'primary', 'success', 'warning', 'danger', 'info'].indexOf(value) !== -1
  }
})

provide('configGlobal', props)
let bpmnModeler: any = null
const defaultZoom = ref(1)
const previewModelVisible = ref(false)
const simulationStatus = ref(false)
const previewResult = ref('')
const previewType = ref('xml')
const recoverable = ref(false)
const revocable = ref(false)
const additionalModules = computed(() => {
  console.log(props.additionalModel, 'additionalModel')
  const Modules: any[] = []
  // Only retain user-defined extension modules
  if (props.onlyCustomizeAddi) {
    if (Object.prototype.toString.call(props.additionalModel) == '[object Array]') {
      return props.additionalModel || []
    }
    return [props.additionalModel]
  }

  // Insert user-defined extension module
  if (Object.prototype.toString.call(props.additionalModel) == '[object Array]') {
    Modules.push(...(props.additionalModel as any[]))
  } else {
    props.additionalModel && Modules.push(props.additionalModel)
  }

  // Translation module
  const TranslateModule = {
    translate: ['value', customTranslate(props.translations || translationsCN)]
  }
  Modules.push(TranslateModule)

  // Simulation flow module
  if (props.simulation) {
    Modules.push(tokenSimulation)
  }

  // Set extension element construction module according to the required process type
  // if (this.prefix === "bpmn") {
  //   Modules.push(bpmnModdleExtension);
  // }
  console.log(props.prefix, 'props.prefix ')
  if (props.prefix === 'camunda') {
    Modules.push(camundaModdleExtension)
  }
  if (props.prefix === 'flowable') {
    Modules.push(flowableModdleExtension)
  }
  if (props.prefix === 'activiti') {
    Modules.push(activitiModdleExtension)
  }

  return Modules
})
const moddleExtensions = computed(() => {
  console.log(props.onlyCustomizeModdle, 'props.onlyCustomizeModdle')
  console.log(props.moddleExtension, 'props.moddleExtension')
  console.log(props.prefix, 'props.prefix')
  const Extensions: any = {}
  // Only use user-defined modules
  if (props.onlyCustomizeModdle) {
    return props.moddleExtension || null
  }

  // Insert user-defined module
  if (props.moddleExtension) {
    for (let key in props.moddleExtension) {
      Extensions[key] = props.moddleExtension[key]
    }
  }

  // As needed "Process type" set up Corresponding parsing file
  if (props.prefix === 'activiti') {
    Extensions.activiti = activitiModdleDescriptor
  }
  if (props.prefix === 'flowable') {
    Extensions.flowable = flowableModdleDescriptor
  }
  if (props.prefix === 'camunda') {
    Extensions.camunda = camundaModdleDescriptor
  }
  return Extensions
})
console.log(additionalModules, 'additionalModules()')
console.log(moddleExtensions, 'moddleExtensions()')
const initBpmnModeler = () => {
  if (bpmnModeler) return
  let data = document.getElementById('bpmnCanvas')
  console.log(data, 'data')
  console.log(props.keyboard, 'props.keyboard')
  console.log(additionalModules, 'additionalModules()')
  console.log(moddleExtensions, 'moddleExtensions()')

  bpmnModeler = new BpmnModeler({
    // container: this.$refs['bpmn-canvas'],
    // container: getCurrentInstance(),
    // container: needClass,
    // container: bpmnCanvas.value,
    container: data,
    // width: '100%',
    // Add Control Board
    // propertiesPanel: {
    // parent: '#js-properties-panel'
    // },
    keyboard: props.keyboard ? { bindTo: document } : null,
    // additionalModules: additionalModules.value,
    additionalModules: additionalModules.value,
    moddleExtensions: moddleExtensions.value

    // additionalModules: [
    // additionalModules.value
    // propertiesPanelModule,
    // propertiesProviderModule
    // propertiesProviderModule
    // ],
    // moddleExtensions: { camunda: moddleExtensions.value }
  })

  // bpmnModeler.createDiagram()

  // console.log(bpmnModeler, 'bpmnModeler111111')
  emit('init-finished', bpmnModeler)
  initModelListeners()
}

const initModelListeners = () => {
  const EventBus = bpmnModeler.get('eventBus')
  console.log(EventBus, 'EventBus')
  // Registration requires listening events, take. Replace with - , Avoid parsing exceptions
  props.events.forEach((event: any) => {
    EventBus.on(event, function (eventObj) {
      let eventName = event.replace(/\./g, '-')
      // eventName.name = eventName
      let element = eventObj ? eventObj.element : null
      console.log(eventName, 'eventName')
      console.log(element, 'element')
      emit('element-click', element, eventObj)
      // emit(eventName, element, eventObj)
    })
  })
  // Monitor graphic changes and returnxml
  EventBus.on('commandStack.changed', async (event) => {
    try {
      recoverable.value = bpmnModeler.get('commandStack').canRedo()
      revocable.value = bpmnModeler.get('commandStack').canUndo()
      let { xml } = await bpmnModeler.saveXML({ format: true })
      emit('commandStack-changed', event)
      emit('input', xml)
      emit('change', xml)
      emit('save', xml)
    } catch (e: any) {
      console.error(`[Process Designer Warn]: ${e.message || e}`)
    }
  })
  // Monitor view zoom changes
  bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
    emit('canvas-viewbox-changed', { viewbox })
    const { scale } = viewbox
    defaultZoom.value = Math.floor(scale * 100) / 100
  })
}
/* Create a new flowchart */
const createNewDiagram = async (xml) => {
  console.log(xml, 'xml')
  // Convert the string into a graph for display
  let newId = props.processId || `Process_${new Date().getTime()}`
  let newName = props.processName || `BusinessProcess_${new Date().getTime()}`
  let xmlString = xml || DefaultEmptyXML(newId, newName, props.prefix)
  try {
    // console.log(xmlString, 'xmlString')
    // console.log(this.bpmnModeler.importXML);
    let { warnings } = await bpmnModeler.importXML(xmlString)
    console.log(warnings, 'warnings')
    if (warnings && warnings.length) {
      warnings.forEach((warn) => console.warn(warn))
    }
  } catch (e: any) {
    console.error(`[Process Designer Warn]: ${e.message || e}`)
  }
}

// Download the flowchart to your local device
const downloadProcess = async (type) => {
  try {
    // Create files of the required type and download them
    if (type === 'xml' || type === 'bpmn') {
      const { err, xml } = await bpmnModeler.saveXML()
      // Throwing an exception when reading an exception
      if (err) {
        console.error(`[Process Designer Warn ]: ${err.message || err}`)
      }
      let { href, filename } = setEncoded(type.toUpperCase(), xml)
      downloadFunc(href, filename)
    } else {
      const { err, svg } = await bpmnModeler.saveSVG()
      // Throwing an exception when reading an exception
      if (err) {
        return console.error(err)
      }
      let { href, filename } = setEncoded('SVG', svg)
      downloadFunc(href, filename)
    }
  } catch (e: any) {
    console.error(`[Process Designer Warn ]: ${e.message || e}`)
  }
  // File download method
  function downloadFunc(href, filename) {
    if (href && filename) {
      let a = document.createElement('a')
      a.download = filename //Specify the file name for download
      a.href = href //  URL object
      a.click() // Simulate Click
      URL.revokeObjectURL(a.href) // release URL object
    }
  }
}

// Transcode according to the required type and return the download address
const setEncoded = (type, data) => {
  const filename = 'diagram'
  const encodedData = encodeURIComponent(data)
  return {
    filename: `${filename}.${type}`,
    href: `data:application/${
      type === 'svg' ? 'text/xml' : 'bpmn20-xml'
    };charset=UTF-8,${encodedData}`,
    data: data
  }
}

// Load local files
const importLocalFile = () => {
  const file = refFile.value.files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = function () {
    let xmlStr = this.result
    createNewDiagram(xmlStr)
    emit('save', xmlStr)
  }
}
/* ------------------------------------------------ refs methods ------------------------------------------------------ */
const downloadProcessAsXml = () => {
  downloadProcess('xml')
}
const downloadProcessAsBpmn = () => {
  downloadProcess('bpmn')
}
const downloadProcessAsSvg = () => {
  downloadProcess('svg')
}
const processSimulation = () => {
  simulationStatus.value = !simulationStatus.value
  console.log(bpmnModeler.get('toggleMode', 'strict'), "bpmnModeler.get('toggleMode')")
  props.simulation && bpmnModeler.get('toggleMode', 'strict').toggleMode()
}
const processRedo = () => {
  bpmnModeler.get('commandStack').redo()
}
const processUndo = () => {
  bpmnModeler.get('commandStack').undo()
}
const processZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnModeler.get('canvas').zoom(defaultZoom.value)
}
const processZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  defaultZoom.value = newZoom
  bpmnModeler.get('canvas').zoom(defaultZoom.value)
}
const processReZoom = () => {
  defaultZoom.value = 1
  bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
}
const processRestart = () => {
  recoverable.value = false
  revocable.value = false
  createNewDiagram(null)
}
const elementsAlign = (align) => {
  const Align = bpmnModeler.get('alignElements')
  const Selection = bpmnModeler.get('selection')
  const SelectedElements = Selection.get()
  if (!SelectedElements || SelectedElements.length <= 1) {
    ElMessage.warning('Please hold down the Shift key to select multiple elements for alignment')
    // alert('Please hold down the Ctrl key to select multiple elements for alignment.')
    return
  }
  ElMessageBox.confirm('Automatic alignment may cause graphic distortion，Do you want to continue?', 'warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    Align.trigger(SelectedElements, align)
  })
}
/*-----------------------------    Method End     ---------------------------------*/
const previewProcessXML = () => {
  console.log(bpmnModeler.saveXML, 'bpmnModeler')
  bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
    // console.log(xml, 'xml111111')
    previewResult.value = xml
    previewType.value = 'xml'
    previewModelVisible.value = true
  })
}
const previewProcessJson = () => {
  bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
    const rootNodes = new XmlNode(XmlNodeType.Root, parseXmlString(xml))
    previewResult.value = rootNodes.parent?.toJSON() as unknown as string
    previewType.value = 'json'
    previewModelVisible.value = true
  })
}

/* ------------------------------------------------ methods ------------------------------------------------------ */
onMounted(() => {
  initBpmnModeler()
  createNewDiagram(props.value)
})
onBeforeUnmount(() => {
  if (bpmnModeler) bpmnModeler.destroy()
  emit('destroy', bpmnModeler)
  bpmnModeler = null
})
</script>
