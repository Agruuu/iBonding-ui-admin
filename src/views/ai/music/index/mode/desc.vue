<template>
  <div>
    <Title title="Music/lyrics description" desc="Describe the music style and theme you want，Use genres and atmospheres instead of specific artists and songs">
      <el-input
        v-model="formData.desc"
        :autosize="{ minRows: 6, maxRows: 6}"
        resize="none"
        type="textarea"
        maxlength="1200"
        show-word-limit
        placeholder="A cheerful song about a terrible breakup"
      />
    </Title>

    <Title title="Instrumental music" desc="Create a song without lyrics">
      <template #extra>
        <el-switch v-model="formData.pure" size="small"/>
      </template>
    </Title>

    <Title title="Version" desc="Describe the music style and theme you want，Use genres and atmospheres instead of specific artists and songs">
      <el-select v-model="formData.version" placeholder="Please choose">
        <el-option
          v-for="item in [{
            value: '3',
            label: 'V3'
          }, {
            value: '2',
            label: 'V2'
          }]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </Title>
  </div>
</template>

<script lang="ts" setup>
import Title from '../title/index.vue'

defineOptions({ name: 'Desc' })

const formData = reactive({
  desc: '',
  pure: false,
  version: '3'
})

defineExpose({
  formData
})

</script>
