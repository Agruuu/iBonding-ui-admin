<template>
  <div class="knowledge-base-container">
    <div class="card-container">
      <el-card class="create-card" shadow="hover">
        <div class="create-content">
          <el-icon class="create-icon"><Plus /></el-icon>
          <span class="create-text">Create a knowledge base</span>
        </div>
        <div class="create-footer">
          Import your own text data or use Webhook Real time writing of data to enhance LLM The context。
        </div>
      </el-card>

      <el-card class="document-card" shadow="hover" v-for="index in 4" :key="index">
        <div class="document-header">
          <el-icon><Folder /></el-icon>
          <span>接口鉴权示例代码.md</span>
        </div>
        <div class="document-info">
          <el-tag size="small">1 File</el-tag>
          <el-tag size="small" type="info">5 Thousand Characters</el-tag>
          <el-tag size="small" type="warning">0 Related Applications</el-tag>
        </div>
        <p class="document-description">
          useful for when you want to answer queries about the 接口鉴权示例代码.md
        </p>
      </el-card>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder, Plus } from '@element-plus/icons-vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100) // Assuming there are a total of100Article data

const handleSizeChange = (val) => {
  console.log(`Each page ${val} strip`)
}

const handleCurrentChange = (val) => {
  console.log(`Current page: ${val}`)
}
</script>

<style scoped>
.knowledge-base-container {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Microsoft YaHei ', Arial, sans-serif;
  position: absolute;
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 40px;
  width: 100%;
}

.card-container {
  display: flex;
  flex-wrap: wrap; /* Enable wrapping */
  gap: 20px;
  margin-bottom: auto; /* Pushes pagination to the bottom */
}

.create-card, .document-card {
  flex: 1 1 360px; /* Allow cards to grow and shrink */
  min-width: 0;
  max-width: 400px;
  border-radius: 10px;
  cursor: pointer;
}

.create-card {
  background-color: rgba(168, 168, 168, 0.22);
}
.create-card:hover {
  background-color: #fff;
}

.create-content {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.create-icon {
  font-size: 24px;
  color: #409EFF;
}

.create-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.create-footer {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

.document-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.document-info {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.document-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.pagination-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
