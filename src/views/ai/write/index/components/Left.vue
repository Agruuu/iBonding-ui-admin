<template>
  <!-- definition tab assembly：compose/Reply, etc -->
  <DefineTab v-slot="{ active, text, itemClick }">
    <span
      :class="active ? 'text-black shadow-md' : 'hover:bg-[#DDDFE3]'"
      class="inline-block w-1/2 rounded-full cursor-pointer text-center leading-[30px] relative z-1 text-[5C6370] hover:text-black"
      @click="itemClick"
    >
      {{ text }}
    </span>
  </DefineTab>
  <!-- definition label assembly：length/format/tone/Language, etc -->
  <DefineLabel v-slot="{ label, hint, hintClick }">
    <h3 class="mt-5 mb-3 flex items-center justify-between text-[14px]">
      <span>{{ label }}</span>
      <span
        v-if="hint"
        class="flex items-center text-[12px] text-[#846af7] cursor-pointer select-none"
        @click="hintClick"
      >
        <Icon icon="ep:question-filled" />
        {{ hint }}
      </span>
    </h3>
  </DefineLabel>

  <div class="flex flex-col" v-bind="$attrs">
    <!-- tab -->
    <div class="w-full pt-2 bg-[#f5f7f9] flex justify-center">
      <div class="w-[303px] rounded-full bg-[#DDDFE3] p-1 z-10">
        <div
          :class="
            selectedTab === AiWriteTypeEnum.REPLY && 'after:transform after:translate-x-[100%]'
          "
          class="flex items-center relative after:content-[''] after:block after:bg-white after:h-[30px] after:w-1/2 after:absolute after:top-0 after:left-0 after:transition-transform after:rounded-full"
        >
          <ReuseTab
            v-for="tab in tabs"
            :key="tab.value"
            :active="tab.value === selectedTab"
            :itemClick="() => switchTab(tab.value)"
            :text="tab.text"
          />
        </div>
      </div>
    </div>
    <div
      class="px-7 pb-2 flex-grow overflow-y-auto lg:block w-[380px] box-border bg-[#f5f7f9] h-full"
    >
      <div>
        <template v-if="selectedTab === 1">
          <ReuseLabel :hint-click="() => example('write')" hint="Example" label="Writing Content" />
          <el-input
            v-model="formData.prompt"
            :maxlength="500"
            :rows="5"
            placeholder="Please enter the writing content"
            showWordLimit
            type="textarea"
          />
        </template>

        <template v-else>
          <ReuseLabel :hint-click="() => example('reply')" hint="Example" label="original text" />
          <el-input
            v-model="formData.originalContent"
            :maxlength="500"
            :rows="5"
            placeholder="Please enter the original text"
            showWordLimit
            type="textarea"
          />

          <ReuseLabel label="Reply content" />
          <el-input
            v-model="formData.prompt"
            :maxlength="500"
            :rows="5"
            placeholder="Please enter the reply content"
            showWordLimit
            type="textarea"
          />
        </template>

        <ReuseLabel label="Length" />
        <Tag v-model="formData.length" :tags="getIntDictOptions(DICT_TYPE.AI_WRITE_LENGTH)" />
        <ReuseLabel label="Format" />
        <Tag v-model="formData.format" :tags="getIntDictOptions(DICT_TYPE.AI_WRITE_FORMAT)" />
        <ReuseLabel label="Tone" />
        <Tag v-model="formData.tone" :tags="getIntDictOptions(DICT_TYPE.AI_WRITE_TONE)" />
        <ReuseLabel label="Language" />
        <Tag v-model="formData.language" :tags="getIntDictOptions(DICT_TYPE.AI_WRITE_LANGUAGE)" />

        <div class="flex items-center justify-center mt-3">
          <el-button :disabled="isWriting" @click="reset">Reset</el-button>
          <el-button :loading="isWriting" color="#846af7" @click="submit">Generate</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createReusableTemplate } from '@vueuse/core'
import { ref } from 'vue'
import Tag from './Tag.vue'
import { WriteVO } from '@/api/ai/write'
import { omit } from 'lodash-es'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { AiWriteTypeEnum, WriteExample } from '@/views/ai/utils/constants'

type TabType = WriteVO['type']

const message = useMessage() // Message pop-up window

defineProps<{
  isWriting: boolean
}>()

const emits = defineEmits<{
  (e: 'submit', params: Partial<WriteVO>)
  (e: 'example', param: 'write' | 'reply')
  (e: 'reset')
}>()

/** When clicking on the example，Show the defined article as an example **/
const example = (type: 'write' | 'reply') => {
  formData.value = {
    ...initData,
    ...omit(WriteExample[type], ['data'])
  }
  emits('example', type)
}

/** Reset，Use form values as initial selection values **/
const reset = () => {
  formData.value = { ...initData }
  emits('reset')
}

const selectedTab = ref<TabType>(AiWriteTypeEnum.WRITING)
const tabs: {
  text: string
  value: TabType
}[] = [
  { text: 'Compose', value: AiWriteTypeEnum.WRITING },
  { text: 'Reply', value: AiWriteTypeEnum.REPLY }
]
const [DefineTab, ReuseTab] = createReusableTemplate<{
  active?: boolean
  text: string
  itemClick: () => void
}>()

/**
 * You can define reusable components in the `template`. `DefineLabel` and `ReuseLabel` use destructuring assignment, and they are both Vue components.
 *
 * You can directly use them in the form of components. `<DefineLabel v-slot="{ label, hint, hintClick }">` Here goes the code of the component to be reused. `</DefineLabel>`. And you can use the defined component via `<ReuseLabel />`. 
 * The `v-slot="{ label, hint, hintClick }"` inside `DefineLabel` is equivalent to destructuring the component's props. It should be noted that for the boolean type, you need to explicitly assign a value, for example, `<ReuseLabel :flag="true" />`.
 * Events also need to be passed in the form of props, not in the form of `@event`. For example, the `hintClick` below should be passed like `<ReuseLabel :hintClick="() => { doSomething }"/>`.
 *
 * @see https://vueuse.org/createReusableTemplate
 */
const [DefineLabel, ReuseLabel] = createReusableTemplate<{
  label: string
  class?: string
  hint?: string
  hintClick?: () => void
}>()

const initData: WriteVO = {
  type: 1,
  prompt: '',
  originalContent: '',
  tone: 1,
  language: 1,
  length: 1,
  format: 1
}
const formData = ref<WriteVO>({ ...initData })

/** Used to record the data filled in before switching，Assign a value back when switching **/
const recordFormData = {} as Record<AiWriteTypeEnum, WriteVO>

/** switch tab **/
const switchTab = (value: TabType) => {
  if (value !== selectedTab.value) {
    // Save long data before
    recordFormData[selectedTab.value] = formData.value
    selectedTab.value = value
    // Assign the previous old data back
    formData.value = { ...initData, ...recordFormData[value] }
  }
}

/** Submit Writing */
const submit = () => {
  if (selectedTab.value === 2 && !formData.value.originalContent) {
    message.warning('Please enter the original text')
    return
  }
  if (!formData.value.prompt) {
    message.warning(`Please enter ${selectedTab.value === 1 ? 'writing' : 'reply'} content`)
    return
  }
  emits('submit', {
    /** There was no `originalContent` field when writing. **/
    ...(selectedTab.value === 1 ? omit(formData.value, ['originalContent']) : formData.value),
    /** Use the value of the selected tab to overwrite the current `type`. **/
    type: selectedTab.value
  })
}
</script>
