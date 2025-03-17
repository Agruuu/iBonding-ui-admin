<template>
  <div class="">
    <Title title="Lyric" desc="Writing your own lyrics or using AI to generate them, a format of two stanzas (8 lines) yields the best results">
      <el-input
        v-model="formData.lyric"
        :autosize="{ minRows: 6, maxRows: 6}"
        resize="none"
        type="textarea"
        maxlength="1200"
        show-word-limit
        placeholder="Please enter your own lyrics"
      />
    </Title>

    <Title title="Music style">
      <el-space class="flex-wrap">
        <el-tag v-for="tag in tags" :key="tag" round class="mb-8px">{{tag}}</el-tag>
      </el-space>

      <el-button
        :type="showCustom ? 'primary': 'default'" 
        round 
        size="small" 
        class="mb-6px"
        @click="showCustom = !showCustom"
      >Custom Style
      </el-button>
    </Title>

    <Title v-show="showCustom" desc="Describe the music style you want. Suno can't recognize the names of artists, but it can understand genres and atmospheres." class="-mt-12px">
      <el-input
        v-model="formData.style"
        :autosize="{ minRows: 4, maxRows: 4}"
        resize="none"
        type="textarea"
        maxlength="256"
        show-word-limit
        placeholder="Please enter music style(english)"
      />
    </Title>

    <Title title="Music/Song name">
      <el-input v-model="formData.name" placeholder="Please enter Music/Song name"/>
    </Title>

    <Title title="Version">
      <el-select v-model="formData.version" placeholder="Please Choose">
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
defineOptions({ name: 'Lyric' })

const tags = ['rock', 'punk', 'jazz', 'soul', 'country', 'kidsmusic', 'pop']

const showCustom = ref(false)

const formData = reactive({
  lyric: '',
  style: '',
  name: '',
  version: ''
})

defineExpose({
  formData
})
</script>
