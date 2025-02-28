export const template = (isTaskListener) => {
  return `
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="small" border>
      <el-table-column label="ID" width="50px" type="index" />
      <el-table-column label="Event Type" min-width="100px" prop="event" />
      <el-table-column label="Listener Type" min-width="100px" show-overflow-tooltip :formatter="row => listenerTypeObject[row.listenerType]" />
      <el-table-column label="Operation" width="90px">
        <template #default="scope">
          <el-button size="small" type="primary" link @click="openListenerForm(scope, scope.$index)">edit</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" type="primary" link style="color: #ff4d4f" @click="removeListener(scope, scope.$index)">remove</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">Add listener</el-button>
    </div>

    <!-- monitor edit/establish part -->
    <el-drawer :visible.sync="listenerFormModelVisible" title="Execute Listener" :size="width + 'px'" append-to-body destroy-on-close>
      <el-form size="small" :model="listenerForm" label-width="96px" ref="listenerFormRef" @submit.native.prevent>
        <el-form-item label="Event Type" prop="event" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.event">
            <el-option label="start" value="start" />
            <el-option label="end" value="end" />
          </el-select>
        </el-form-item>
        <el-form-item label="Listener Type" prop="listenerType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.listenerType">
            <el-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :label="listenerTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java Class"
          prop="class"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="Expression"
          prop="expression"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="Proxy Expression"
          prop="delegateExpression"
          key="listener-delegate"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.delegateExpression" clearable />
        </el-form-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
          <el-form-item
            label="Script Format"
            prop="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the script format' }"
          >
            <el-input v-model="listenerForm.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="Script Type"
            prop="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please select script type' }"
          >
            <el-select v-model="listenerForm.scriptType">
              <el-option label="Inline Script " value="inlineScript" />
              <el-option label="External Script" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="Script Content"
            prop="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the script content' }"
          >
            <el-input v-model="listenerForm.value" clearable />
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="Resource Url"
            prop="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the resource url' }"
          >
            <el-input v-model="listenerForm.resource" clearable />
          </el-form-item>
        </template>
        ${
          isTaskListener
            ? "<el-form-item label='Timer Type' prop='eventDefinitionType' key='eventDefinitionType'>" +
              "<el-select v-model='listenerForm.eventDefinitionType'>" +
              "<el-option label='Date' value='date' />" +
              "<el-option label='Duration' value='duration' />" +
              "<el-option label='Loop' value='cycle' />" +
              "<el-option label='None' value='' />" +
              '</el-select>' +
              '</el-form-item>' +
              "<el-form-item v-if='!!listenerForm.eventDefinitionType' label='Timer' prop='eventDefinitions' key='eventDefinitions'>" +
              "<el-input v-model='listenerForm.eventDefinitions' clearable />" +
              '</el-form-item>'
            : ''
        }
      </el-form>
      <el-divider />
      <p class="listener-filed__title">
        <span><i class="el-icon-menu"></i>Inject Fields：</span>
        <el-button size="small" type="primary" @click="openListenerFieldForm(null)">Add Fields</el-button>
      </p>
      <el-table :data="fieldsListOfListener" size="small" max-height="240" border fit style="flex: none">
        <el-table-column label="ID" width="50px" type="index" />
        <el-table-column label="Field Name" min-width="100px" prop="name" />
        <el-table-column label="Field Type" min-width="80px" show-overflow-tooltip :formatter="row => fieldTypeObject[row.fieldType]" />
        <el-table-column label="Field Value/Expression" min-width="100px" show-overflow-tooltip :formatter="row => row.string || row.expression" />
        <el-table-column label="Operation" width="100px">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="openListenerFieldForm(scope, scope.$index)">Edit</el-button>
            <el-divider direction="vertical" />
            <el-button size="small" type="primary" link style="color: #ff4d4f" @click="removeListenerField(scope, scope.$index)">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="element-drawer__button">
        <el-button size="small" @click="listenerFormModelVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="saveListenerConfig">Save</el-button>
      </div>
    </el-drawer>

    <!-- Inject into the western section edit/establish part -->
    <el-dialog title="Field Config" :visible.sync="listenerFieldFormModelVisible" width="600px" append-to-body destroy-on-close>
      <el-form :model="listenerFieldForm" size="small" label-width="96px" ref="listenerFieldFormRef" style="height: 136px" @submit.native.prevent>
        <el-form-item label="Field Name：" prop="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.name" clearable />
        </el-form-item>
        <el-form-item label="Field Type：" prop="fieldType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :label="fieldTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="Field Value："
          prop="string"
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.string" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="Expression："
          prop="expression"
          key="field-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.expression" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="listenerFieldFormModelVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="saveListenerFiled">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
  `
}
