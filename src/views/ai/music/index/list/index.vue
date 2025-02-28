<template>
  <div class="flex flex-col">
    <div class="flex-auto flex overflow-hidden">
      <el-tabs v-model="currentType" class="flex-auto px-[var(--app-content-padding)]">
        <!-- My creation -->
        <el-tab-pane v-loading="loading" label="My creation" name="mine">
          <el-row v-if="mySongList.length" :gutter="12">
            <el-col v-for="song in mySongList" :key="song.id" :span="24">
              <songCard :songInfo="song" @play="setCurrentSong(song)"/>
            </el-col>
          </el-row>
          <el-empty v-else description="No music available at the moment"/>
        </el-tab-pane>

        <!-- Listening Square -->
        <el-tab-pane v-loading="loading" label="Listening Square" name="square">
          <el-row v-if="squareSongList.length" v-loading="loading" :gutter="12">
            <el-col v-for="song in squareSongList" :key="song.id" :span="24">
              <songCard :songInfo="song" @play="setCurrentSong(song)"/>
            </el-col>
          </el-row>
          <el-empty v-else description="No music available at the moment"/>
        </el-tab-pane>
      </el-tabs>
      <!-- songInfo -->
      <songInfo class="flex-none"/>
    </div>
    <audioBar class="flex-none"/>
  </div>
</template>

<script lang="ts" setup>
import songCard from './songCard/index.vue'
import songInfo from './songInfo/index.vue'
import audioBar from './audioBar/index.vue'

defineOptions({ name: 'Index' })


const currentType = ref('mine')
// loading status
const loading = ref(false)
// Current music
const currentSong = ref({})

const mySongList = ref<Recordable[]>([])
const squareSongList = ref<Recordable[]>([])

provide('currentSong', currentSong)

/*
 *@Description: Generate music list through API tuning
*/
function generateMusic (formData: Recordable) {
  console.log(formData);
  loading.value = true
  setTimeout(() => {
    mySongList.value = Array.from({ length: 20 }, (_, index) => {
      return {
        id: index,
        audioUrl: '',
        videoUrl: '',
        title: 'After I leave ' + index,
        imageUrl: 'https://www.carsmp3.com/data/attachment/forum/201909/19/091020q5kgre20fidreqyt.jpg',
        desc: 'Metal, symphony, film soundtrack, grand, majesticMetal, dtrack, grand, majestic',
        date: '2024-04-30 14:02:57',
        lyric: `<div class="_words_17xen_66"><div>the mighty river flows eastward，The waves wash away，A timeless figure。
          </div><div>To the west of the old fortress，Humanity is，Three Kingdoms Zhou Lang Chibi。
          </div><div>Scattered stones piercing through the void，Shocking waves hitting the shore，Roll up a thousand piles of snow。
          </div><div>picturesque landscape，How many heroes were there at that time。
          </div><div>
          </div><div>Thinking back to Gong Jin's past，Xiao Qiao has just gotten married，take a heroic posture。
          </div><div>calm，Talking and laughing，The pillars and oars were destroyed by smoke and dust。
          </div><div>Journey to the Homeland of the Gods，Love should laugh at me，Early born Huafa。
          </div><div>life is but a dream，A statue of the Moon Returning to the River。</div></div>`
      }
    })
    loading.value = false
  }, 3000)
}

/*
 *@Description: Set the currently playing music
*/
function setCurrentSong (music: Recordable) {
  currentSong.value = music
}

defineExpose({
  generateMusic
})
</script>


<style lang="scss" scoped>
:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  .el-tabs__content {
    padding: 0 7px;
    overflow: auto;
  }
}
</style>
