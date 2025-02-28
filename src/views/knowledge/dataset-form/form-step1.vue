<template>
  <div class="upload-container">
    <!-- title -->
    <div class="title">
      <div>Select Data Source</div>
    </div>

    <!-- Data source selection -->
    <div class="resource-btn" >Import Existing Text</div>

    <!-- Upload file area -->
    <el-form>
      <div class="upload-section">
        <div class="upload-label">Upload Text File</div>
        <el-upload
          class="upload-area"
          action="#"
          :file-list="fileList"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          list-type="text"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drag and drop the file here, or <em>Select file</em></div>
          <div class="el-upload__tip">
            Supported TXT、MARKDOWN、PDF、HTML、XLSX、XLS、DOCX、CSV、EML、MSG、PPTX、PPT、XML、EPUB，Each file should not exceed 15MB。
          </div>
        </el-upload>
      </div>

      <!-- Next button -->
      <div class="next-button">
        <el-button type="primary" :disabled="!fileList.length">Next Step</el-button>
      </div>
    </el-form>

    <!-- Knowledge base creation -->
    <div class="create-knowledge">
      <el-link type="primary" underline>Create an empty knowledge base</el-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileList = ref([])

const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

const beforeUpload = (file) => {
  fileList.value.push(file)
  return false
}
</script>

<style scoped lang="scss">
.upload-container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ebebeb;
}

.title {
  font-size: 22px;
  font-weight: bold;
}

.resource-btn {
  margin-top: 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 150px;
  border: 1.5px solid #528bff;
  padding: 10px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 30px;
  color: #101828;
}

.upload-section {
  margin: 20px 0;
  padding-top: 10px;
}

.upload-label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.upload-area {
  margin-top: 10px;
  border: 1px dashed #d9d9d9;
  padding: 40px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.el-upload__text em {
  color: #409eff;
  cursor: pointer;
}

.el-upload__tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.next-button {
  text-align: left;
  margin-top: 20px;
}

.create-knowledge {
  text-align: left;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 0;
}

.source-radio-group {
  display: flex;
  justify-content: space-between;
}

.el-radio-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 10px 20px;
}

.el-radio-button .el-icon {
  margin-right: 8px;
}
</style>
