<template>
  <div class="import-page">
    <!-- 上传区域卡片 -->
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>Excel文件导入</span>
        </div>
      </template>
      
      <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
        <input
          type="file"
          ref="fileInputRef"
          accept=".xlsx,.xls"
          style="display: none"
          @change="onFileSelected"
        />
        
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">
          <p>点击或拖拽文件到此区域上传</p>
          <p class="upload-hint">支持 .xlsx, .xls 格式的Excel文件</p>
        </div>
      </div>
      
      <!-- 文件预览 -->
      <div v-if="selectedFile" class="file-preview">
        <div class="file-info">
          <el-icon><Document /></el-icon>
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        </div>
        
        <el-button type="danger" link @click="removeFile">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        <el-icon><Warning /></el-icon>
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- 操作按钮 -->
      <div class="upload-actions">
        <el-button
          type="primary"
          @click="startUpload"
          :disabled="!selectedFile || isProcessing"
          :loading="isProcessing"
        >
          {{ isProcessing ? '处理中...' : '开始导入' }}
        </el-button>
        
        <el-button
          @click="removeFile"
          :disabled="!selectedFile || isProcessing"
        >
          清空
        </el-button>
      </div>
      
      <!-- 进度条 -->
      <el-progress
        v-if="uploadProgress > 0 || isProcessing"
        :percentage="uploadProgress"
        :status="uploadStatus === 'success' ? 'success' : uploadStatus === 'exception' ? 'exception' : ''"
        :indeterminate="uploadStatus === 'processing'"
        :stroke-width="10"
      />
      
      <div v-if="uploadStatus === 'processing'" class="progress-text">
        正在处理数据，请稍候...
      </div>
    </el-card>
    
    <!-- 导入历史记录 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>导入历史记录</span>
          <el-button type="primary" link @click="fetchImportHistory">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      
      <el-table :data="importHistory" stripe style="width: 100%">
        <el-table-column prop="fileName" label="文件名" min-width="200" />
        <el-table-column prop="importTime" label="导入时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="记录数" width="100" />
        <el-table-column prop="message" label="消息" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'SUCCESS'"
              type="primary" 
              link 
              @click="downloadResult(scope.row.id)"
            >
              下载结果
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="deleteHistory(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fileApi } from '@/api/file'

// 文件上传相关
const fileInputRef = ref(null)
const selectedFile = ref(null)
const errorMessage = ref('')
const isProcessing = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('') // 'uploading', 'processing', 'success', 'exception'

// 导入历史记录
const importHistory = ref([])

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value.click()
}

// 文件选择事件
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// 文件拖拽事件
const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// 验证并设置文件
const validateAndSetFile = (file) => {
  // 验证文件类型
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  const fileExt = file.name.split('.').pop().toLowerCase()
  
  if (!validTypes.includes(file.type) && !['xls', 'xlsx'].includes(fileExt)) {
    errorMessage.value = '只支持Excel文件格式(.xlsx, .xls)'
    return
  }
  
  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过10MB'
    return
  }
  
  selectedFile.value = file
  errorMessage.value = ''
  uploadProgress.value = 0
  uploadStatus.value = ''
}

// 移除文件
const removeFile = () => {
  selectedFile.value = null
  fileInputRef.value.value = ''
  errorMessage.value = ''
  uploadProgress.value = 0
  uploadStatus.value = ''
}

// 开始上传
const startUpload = async () => {
  if (!selectedFile.value) return
  
  try {
    isProcessing.value = true
    uploadProgress.value = 0
    uploadStatus.value = 'uploading'
    errorMessage.value = ''
    
    // 创建临时记录
    const tempRecord = {
      id: Date.now().toString(),
      fileName: selectedFile.value.name,
      importTime: new Date().toLocaleString(),
      status: 'PROCESSING',
      count: 0,
      message: '正在处理...'
    }
    
    // 添加到历史记录
    importHistory.value.unshift(tempRecord)
    
    // 上传文件
    const res = await fileApi.uploadExcel(selectedFile.value, {
      onProgress: (progress) => {
        uploadProgress.value = progress
      }
    })
    
    // 上传完成，开始轮询进度
    uploadStatus.value = 'processing'
    uploadProgress.value = 100
    
    // 轮询导入进度
    const taskId = res.taskId
    const pollInterval = 2000 // 2秒
    let pollCount = 0
    const maxPollCount = 30 // 最多轮询30次
    
    const pollProgress = async () => {
      if (pollCount >= maxPollCount) {
        throw new Error('导入处理超时，请稍后查看结果')
      }
      
      pollCount++
      
      try {
        const progressRes = await fileApi.getImportProgress(taskId)
        
        // 更新历史记录
        const index = importHistory.value.findIndex(item => item.id === tempRecord.id)
        if (index !== -1) {
          importHistory.value[index] = {
            ...importHistory.value[index],
            ...progressRes
          }
        }
        
        // 如果还在处理中，继续轮询
        if (progressRes.status === 'PROCESSING') {
          setTimeout(pollProgress, pollInterval)
        } else {
          // 处理完成
          uploadStatus.value = progressRes.status === 'SUCCESS' ? 'success' : 'exception'
          isProcessing.value = false
          
          if (progressRes.status === 'SUCCESS') {
            ElMessage.success('导入成功')
          } else {
            ElMessage.error(progressRes.message || '导入失败')
          }
          
          clearFile()
          errorMessage.value = '' // 清除可能存在的错误信息
        }
      } catch (error) {
        // 如果错误信息包含网络异常，但文件可能已上传成功，不显示大错误，而是小提示
        if (error.message && error.message.includes('网络异常')) {
          console.warn('轮询进度出错，但文件可能已上传成功:', error.message)
          // 不清除处理状态，让用户查看历史记录
          // 不显示错误消息，更新历史记录状态
          const index = importHistory.value.findIndex(item => item.id === tempRecord.id || item.status === 'PROCESSING')
          if (index !== -1) {
            importHistory.value[index] = {
              ...importHistory.value[index],
              message: '文件已上传，请稍后查看结果'
            }
          }
          clearFile() // 清除文件，允许用户继续上传
        } else {
          // 对于其他错误，正常显示错误信息
          errorMessage.value = error.message
          const index = importHistory.value.findIndex(item => item.id === tempRecord.id || item.status === 'PROCESSING')
          if (index !== -1) {
            importHistory.value[index] = {
              ...importHistory.value[index],
              status: 'FAILED',
              message: error.message
            }
          }
        }
      }
    }
    
    // 开始轮询
    setTimeout(pollProgress, pollInterval)
    
  } catch (error) {
    errorMessage.value = error.message
    uploadStatus.value = 'exception'
    isProcessing.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取导入历史记录
const fetchImportHistory = async () => {
  try {
    // 这里应该调用获取历史记录的API
    // 由于没有具体API，这里模拟一些数据
    const res = [
      {
        id: '1',
        fileName: 'assets_2023.xlsx',
        importTime: '2023-11-20 10:30:45',
        status: 'SUCCESS',
        count: 120,
        message: '导入成功'
      },
      {
        id: '2',
        fileName: 'new_assets.xlsx',
        importTime: '2023-11-19 15:20:10',
        status: 'FAILED',
        count: 0,
        message: '文件格式错误'
      }
    ]
    
    // 合并现有的处理中记录
    const processingRecords = importHistory.value.filter(item => item.status === 'PROCESSING')
    importHistory.value = [...processingRecords, ...res]
  } catch (error) {
    console.error('获取导入历史记录失败:', error)
    ElMessage.error('获取历史记录失败')
  }
}

// 下载导入结果
const downloadResult = async (id) => {
  try {
    const res = await fileApi.getImportResult(id)
    
    // 创建下载链接
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `导入结果_${id}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('下载结果失败:', error)
    ElMessage.error('下载结果失败')
  }
}

// 删除历史记录
const deleteHistory = (id) => {
  ElMessageBox.confirm('确认删除该导入记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用删除API
    // 由于没有具体API，这里直接从本地数组中删除
    importHistory.value = importHistory.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'SUCCESS': 'success',
    'PROCESSING': 'warning',
    'FAILED': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'SUCCESS': '成功',
    'PROCESSING': '处理中',
    'FAILED': '失败'
  }
  return statusMap[status] || '未知'
}

// 清除文件
const clearFile = () => {
  selectedFile.value = null
  fileInputRef.value.value = ''
  uploadProgress.value = 0
  uploadStatus.value = ''
}

// 初始化
onMounted(() => {
  fetchImportHistory()
})
</script>

<style scoped>
.import-page {
  padding: 20px;
}

.upload-card {
  margin-bottom: 20px;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 40px 0;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
}

.upload-text {
  color: #606266;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.file-preview {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-weight: bold;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.error-message {
  margin-top: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #fef0f0;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.progress-text {
  margin-top: 8px;
  text-align: center;
  color: #909399;
}
</style>

