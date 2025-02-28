<template>
  <ContentWrap class="w-300px h-full mb-[0!important]">
    <el-radio-group v-model="generateMode" class="mb-15px">
      <el-radio-button value="desc"> Description mode </el-radio-button>
      <el-radio-button value="lyric"> Lyrics mode </el-radio-button>
    </el-radio-group>

    <!-- Description mode/Lyrics mode switch -->
    <component :is="generateMode === 'desc' ? desc : lyric" ref="modeRef" />

    <el-button type="primary" round class="w-full" @click="generateMusic"> Create music </el-button>
  </ContentWrap>
</template>

<script lang="ts" setup>
import desc from './desc.vue'
import lyric from './lyric.vue'

defineOptions({ name: 'Index' })

const emits = defineEmits(['generate-music'])

const generateMode = ref('lyric')

const modeRef = ref<Nullable<{ formData: Recordable }>>(null)

/*
 *@Description: Generate music based on information
 */
function generateMusic() {
  emits('generate-music', { formData: unref(modeRef)?.formData })
}
</script>
