<template>
  <el-row>
    <!-- Left Section -->
    <el-col :span="12">
      <el-card>
        <!-- Segmented setting -->
        <el-form>
          <el-form-item label="Segmented Setting">
            <el-radio-group v-model="segmentSetting">
              <el-radio label="Automatic segmentation and cleaning">Automatic segmentation and cleaning</el-radio>
              <el-radio label="Custom">Custom</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- Index method -->
          <el-form-item label="Index Method">
            <el-radio-group v-model="indexingMethod">
              <el-radio label="High-Quality">High-Quality</el-radio>
              <el-radio label="Economic">Economic</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- Embedding Model -->
          <el-form-item label="Embedding Model">
            <el-select v-model="embeddingModel" placeholder="Select Embedding Model">
              <el-option label="text-embedding-3-large" value="text-embedding-3-large"/>
            </el-select>
          </el-form-item>

          <!-- Search Settings -->
          <el-form-item label="Search Settings">
            <el-card style="width: 400px;">
              <div class="card-header">
                <span>Vector Retrieval</span>
              </div>
              <el-slider v-model="topK" :min="1" :max="10" label="Top K"/>
              <el-slider v-model="scoreThreshold" :min="0" :max="1" step="0.1" label="Score threshold"/>
            </el-card>

            <el-card style="width: 400px;">
              <div class="card-header">
                <span>Full Text Search</span>
              </div>
              <el-slider v-model="topK" :min="1" :max="10" label="Top K"/>
              <el-slider v-model="scoreThreshold" :min="0" :max="1" step="0.1" label="Score threshold"/>
            </el-card>

            <el-card style="width: 400px;">
              <div class="card-header">
                <span>Mixed Search</span>
              </div>
              <el-slider v-model="topK" :min="1" :max="10" label="Top K"/>
              <el-slider v-model="scoreThreshold" :min="0" :max="1" step="0.1" label="Score threshold"/>
            </el-card>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <!-- Right Section: Segmented Preview -->
    <el-col :span="9">
      <el-card shadow="never">
        <div class="previews-title">Segmented Preview</div>
        <template v-for="(segment, index) in segmentPreviews" :key="index">
          <div class="segment-preview">
            <div class="title">
              <div class="left">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.74999 1.5L3.24999 10.5M8.74998 1.5L7.24998 10.5M10.25 4H1.75M9.75 8H1.25"
                    stroke="#98A2B3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="id">{{ segment.number }}</span>
              </div>

              <div class="right">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 3.5H8M6 3.5V8.5M3.9 10.5H8.1C8.94008 10.5 9.36012 10.5 9.68099 10.3365C9.96323 10.1927 10.1927 9.96323 10.3365 9.68099C10.5 9.36012 10.5 8.94008 10.5 8.1V3.9C10.5 3.05992 10.5 2.63988 10.3365 2.31901C10.1927 2.03677 9.96323 1.8073 9.68099 1.66349C9.36012 1.5 8.94008 1.5 8.1 1.5H3.9C3.05992 1.5 2.63988 1.5 2.31901 1.66349C2.03677 1.8073 1.8073 2.03677 1.66349 2.31901C1.5 2.63988 1.5 3.05992 1.5 3.9V8.1C1.5 8.94008 1.5 9.36012 1.66349 9.68099C1.8073 9.96323 2.03677 10.1927 2.31901 10.3365C2.63988 10.5 3.05992 10.5 3.9 10.5Z"
                    stroke="#667085" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="char-size">7777 Character</span>
              </div>
            </div>

            <div class="content">{{ segment.text }}</div>
          </div>
        </template>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref} from 'vue';

// Reactive variables for form control
const segmentSetting = ref('Automatic segmentation and cleaning');
const indexingMethod = ref('High-Quality');
const embeddingModel = ref('text-embedding-3-large');
const directionalSearch = ref(true);
const topK = ref(3);
const scoreThreshold = ref(0.5);

// Mock data for segment previews
const segmentPreviews = ref([
  {number: '001', text: "Sync OBS model...'UAE-large-V1'"},
  {number: '002', text: "Sync OBS model...'plip'"},
  {number: '003', text: "Sync OBS model...'phoBERT-base-v2'"},
  {number: '004', text: "Sync OBS model...'lama3-bb-bnb-4bit'"},
  {number: '005', text: "Sync OBS model...'t5-base-split-and-rephrase'"}
]);
</script>

<style scoped lang="scss">
/* Add any custom styles here */

.previews-title {
  font-size: 18px;
  font-weight: 500;
}

.segment-preview {
  background-color: rgba(228, 228, 228, 0.38);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;

  .title {
    display: flex;
    justify-content: space-between;

    .left {
      border-right: 5px;
      font-size: 13px;
      font-style: italic;
      font-weight: 500;
      color: #676767;
      box-sizing: border-box;
      align-items: center;

      .id {
        margin-left: 5px;
      }
    }

    .right {
      display: flex;
      flex-direction: row;
      align-items: center;

      .char-size {
        margin-left: 5px;
        font-size: 13px;
        color: rgba(57, 57, 57, 0.66);
      }
    }
  }

  .content {
    margin-top: 10px;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
