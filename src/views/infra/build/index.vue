<template>
  <ContentWrap :body-style="{ padding: '0px' }" class="!mb-0">
    <!-- form designer  -->
    <div
      class="h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
    >
      <fc-designer class="my-designer" ref="designer" :config="designerConfig">
        <template #handle>
          <el-button size="small" type="primary" plain @click="showJson">Generate JSON</el-button>
          <el-button size="small" type="success" plain @click="showOption">Generate Options</el-button>
          <el-button size="small" type="danger" plain @click="showTemplate">Generate Components</el-button>
        </template>
      </fc-designer>
    </div>
  </ContentWrap>

  <!-- pop-up notification：Form Preview -->
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="600">
    <div v-if="dialogVisible" ref="editor">
      <el-button style="float: right" @click="copy(formData)">
        {{ t('common.copy') }}
      </el-button>
      <el-scrollbar height="580">
        <div>
          <pre><code v-dompurify-html="highlightedCode(formData)" class="hljs"></code></pre>
        </div>
      </el-scrollbar>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { useFormCreateDesigner } from '@/components/FormCreate'
import { useClipboard } from '@vueuse/core'
import { isString } from '@/utils/is'

import hljs from 'highlight.js' // Import code highlight file
import 'highlight.js/styles/github.css' // Import code highlight style
import xml from 'highlight.js/lib/languages/java'
import json from 'highlight.js/lib/languages/json'
import formCreate from '@form-create/element-ui'

defineOptions({ name: 'InfraBuild' })

const { t } = useI18n() // internationalization
const message = useMessage() // news

// Form Designer Configuration
const designerConfig = ref({
  switchType: [], // Can I switch component types,Or fields that can be switched between each other
  autoActive: true, // Automatically select dragged components
  useTemplate: false, // Whether to generate vue2 template components for syntax
  formOptions: {
    form: {
      labelWidth: '100px' // Set default label Width is 100px
    }
  }, // Define default values for form configuration
  fieldReadonly: false, // to configure field can it be edited
  hiddenDragMenu: false, // Hide drag and drop operation buttons
  hiddenDragBtn: false, // Hide drag and drop button
  hiddenMenu: [], // Hide some menus
  hiddenItem: [], // Hide some components
  hiddenItemConfig: {}, // Partial configuration items of hidden components
  disabledItemConfig: {}, // Disable some configuration items of the component
  showSaveBtn: false, // Do you want to display the save button
  showConfig: true, // Is the configuration interface on the right displayed
  showBaseForm: true, // Whether to display the basic configuration form of the component
  showControl: true, // Whether to display component linkage
  showPropsForm: true, // Whether to display the attribute configuration form of the component
  showEventForm: true, // Whether to display the event configuration form of the component
  showValidateForm: true, // Whether to display the validation configuration form of the component
  showFormConfig: true, // Whether to display form configuration
  showInputData: true, // Whether to display the input button
  showDevice: true, // Whether to display multi terminal adaptation options
  appendConfigData: [] // Define the required rendering rules formData
})
const designer = ref() // form designer 
const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formType = ref(-1) // Type of Form：0 - generate JSON；1 - generate Options；2 - Generate Components
const formData = ref('') // Form Data 
useFormCreateDesigner(designer) // Form Designer Enhancement

/** Open pop-up window */
const openModel = (title: string) => {
  dialogVisible.value = true
  dialogTitle.value = title
}

/** generate JSON */
const showJson = () => {
  openModel('Generate JSON')
  formType.value = 0
  formData.value = designer.value.getRule()
}

/** generate Options */
const showOption = () => {
  openModel('Generate Options')
  formType.value = 1
  formData.value = designer.value.getOption()
}

/** Generate Components */
const showTemplate = () => {
  openModel('Generate Components')
  formType.value = 2
  formData.value = makeTemplate()
}

const makeTemplate = () => {
  const rule = designer.value.getRule()
  const opt = designer.value.getOption()
  return `<template>
    <form-create
      v-model:api="fApi"
      :rule="rule"
      :option="option"
      @submit="onSubmit"
    ></form-create>
  </template>
  <script setup lang=ts>
    const faps = ref(null)
    const rule = ref('')
    const option = ref('')
    const init = () => {
      rule.value = formCreate.parseJson('${formCreate.toJson(rule).replaceAll('\\', '\\\\')}')
      option.value = formCreate.parseJson('${JSON.stringify(opt)}')
    }
    const onSubmit = (formData) => {
      //todo Submit Form 
    }
    init()
  <\/script>`
}

/** copy **/
const copy = async (text: string) => {
  const textToCopy = JSON.stringify(text, null, 2)
  const { copy, copied, isSupported } = useClipboard({ source: textToCopy })
  if (!isSupported) {
    message.error(t('common.copyError'))
  } else {
    await copy()
    if (unref(copied)) {
      message.success(t('common.copySuccess'))
    }
  }
}

/**
 * Code highlighting 
 */
const highlightedCode = (code: string) => {
  // Processing language and code
  let language = 'json'
  if (formType.value === 2) {
    language = 'xml'
  }
  // debugger
  if (!isString(code)) {
    code = JSON.stringify(code, null, 2)
  }
  // Highlight 
  const result = hljs.highlight(code, { language: language, ignoreIllegals: true })
  return result.value || '&nbsp;'
}

/** initialization **/
onMounted(async () => {
  // Various languages with highlighted registration codes
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('json', json)
})
</script>

<style>
.my-designer {
  ._fc-l,
  ._fc-m,
  ._fc-r {
    border-top: none;
  }
}
</style>
