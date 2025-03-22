<template>
  <el-dialog
    v-model="visible"
    title="导入资产"
    width="520px"
    destroy-on-close
    :close-on-click-modal="false"
    @closed="removeFile"
  >
    <div class="import-dialog-content">
      <!-- 上传区域 -->
      <div 
        class="upload-area" 
        @click="triggerFileInput" 
        @dragover.prevent 
        @dragenter.prevent="(e) => e.target.classList.add('drag-over')" 
        @dragleave.prevent="(e) => e.target.classList.remove('drag-over')" 
        @drop.prevent="onFileDrop"
      >
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
      <div v-if="selectedFile" class="file-preview" :class="{'success-preview': uploadStatus === 'success'}">
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

      <!-- 上传进度 -->
      <div v-if="isProcessing" class="upload-progress">
        <el-progress 
          :percentage="uploadProgress" 
          :status="uploadStatus === 'error' ? 'exception' : uploadStatus === 'success' ? 'success' : ''" 
          :stroke-width="8"
          :show-text="false"
        />
        <div class="progress-text" :class="{'success-text': uploadStatus === 'success', 'error-text': uploadStatus === 'error'}">
          <el-icon v-if="uploadStatus === 'uploading'"><Loading class="is-loading" /></el-icon>
          <el-icon v-else-if="uploadStatus === 'processing'"><Loading class="is-loading" /></el-icon>
          <el-icon v-else-if="uploadStatus === 'success'"><CircleCheck /></el-icon>
          <el-icon v-else-if="uploadStatus === 'error'"><CircleClose /></el-icon>
          {{ uploadStatus === 'uploading' ? '正在上传文件...' : 
             uploadStatus === 'processing' ? '正在处理数据...' : 
             uploadStatus === 'success' ? '处理完成' : 
             uploadStatus === 'error' ? '处理失败' : '' }}
        </div>
      </div>

      <!-- 操作结果 -->
      <div v-if="importResult" class="import-result">
        <el-alert
          :title="importResult.success ? '导入成功' : '导入失败'"
          :type="importResult.success ? 'success' : 'error'"
          :description="importResult.message"
          show-icon
          :closable="false"
        />
        <div v-if="importResult.batchId" class="result-actions">
          <el-button type="primary" @click="downloadResult(importResult.batchId)">
            <el-icon><Download /></el-icon>
            下载导入结果
          </el-button>
        </div>
      </div>
      
      <!-- 导入提示 -->
      <div v-if="!selectedFile && !isProcessing && !importResult" class="import-tips">
        <el-alert
          title="导入提示"
          type="info"
          description="请确保您的Excel文件符合模板格式。如需模板，请点击'下载模板'按钮。"
          show-icon
          :closable="false"
        />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ importResult ? '关闭' : '取消' }}</el-button>
        <el-button 
          v-if="!importResult"
          type="primary" 
          @click="startUpload" 
          :disabled="!selectedFile || isProcessing"
          :loading="isProcessing"
        >
          {{ isProcessing ? '处理中' : '开始导入' }}
        </el-button>
        <el-button 
          v-else-if="importResult && importResult.success"
          type="success" 
          @click="visible = false"
        >
          完成
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fileApi } from '@/api/file'
import { useAssetStore } from '@/store/modules/asset'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import {
  Upload,
  Delete,
  Download,
  Document,
  Warning,
  Loading,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const assetStore = useAssetStore()
const userStore = useUserStore()
const router = useRouter()
const visible = ref(props.modelValue)
const fileInputRef = ref(null)
const selectedFile = ref(null)
const errorMessage = ref('')
const uploadProgress = ref(0)
const uploadStatus = ref('')
const isProcessing = ref(false)
const importResult = ref(null)

// 监听对话框可见性
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听对话框内部可见性变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

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
  event.target.classList.remove('drag-over')
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// 验证并设置文件
const validateAndSetFile = (file) => {
  // 清除之前的错误和结果
  errorMessage.value = ''
  importResult.value = null
  
  // 验证文件类型
  const validTypes = ['.xlsx', '.xls']
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  
  if (!validTypes.includes(fileExtension)) {
    errorMessage.value = '请上传有效的Excel文件 (.xlsx, .xls)'
    return
  }
  
  // 验证文件大小 (最大10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    errorMessage.value = '文件大小不能超过10MB'
    return
  }
  
  // 设置选中的文件
  selectedFile.value = file
}

// 移除文件
const removeFile = () => {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  errorMessage.value = ''
  importResult.value = null
}

// 开始上传
const startUpload = async () => {
  if (!selectedFile.value) {
    errorMessage.value = '请先选择文件'
    return
  }
  
  try {
    isProcessing.value = true
    uploadStatus.value = 'uploading'
    uploadProgress.value = 0
    importResult.value = null
    
    // 上传文件
    const uploadResponse = await fileApi.uploadExcel(selectedFile.value, {
      onProgress: (progress) => {
        uploadProgress.value = progress
      }
    })
    
    // 检查是否是HTML登录页面（认证失败）
    if (typeof uploadResponse === 'string' && uploadResponse.includes('<html') && 
        (uploadResponse.includes('sign in') || uploadResponse.includes('login'))) {
      // 关闭当前对话框
      visible.value = false;
      
      // 使用setTimeout确保对话框关闭后再处理登出操作
      setTimeout(() => {
        // 提示用户重新登录
        ElMessage.error('登录已过期，请重新登录');
        
        // 先跳转到登录页面，然后再清除用户信息
        // 这样可以避免其他组件在跳转过程中还在请求数据
        router.push('/login').then(() => {
          userStore.logout(); // 清除当前用户信息
        });
      }, 100);
      
      return;
    }
    
    // 检查是否收到了HTML内容而不是预期的JSON响应
    if (typeof uploadResponse === 'string' && uploadResponse.includes('<html')) {
      console.error('接收到HTML内容而不是JSON数据:', uploadResponse.substring(0, 100) + '...');
      throw new Error('服务器返回了无效的响应格式，请联系管理员');
    }
    
    // 获取任务ID
    // 后端API返回的data字段直接就是taskId字符串
    if (!uploadResponse) {
      throw new Error('上传响应为空');
    }
    
    // 检查是否有网络连接问题
    if (Array.isArray(uploadResponse.data) && uploadResponse.data.length === 0) {
      throw new Error('后端服务不可用，请检查网络连接或联系管理员');
    }
    
    // 检查data是否存在
    if (uploadResponse.data === undefined || uploadResponse.data === null) {
      throw new Error('认证失败或会话过期，请重新登录');
    }
    
    // 如果data是对象，尝试从不同属性中获取taskId
    let taskId;
    if (typeof uploadResponse.data === 'object' && uploadResponse.data !== null && !Array.isArray(uploadResponse.data)) {
      // 尝试从各种可能的属性中获取taskId
      taskId = uploadResponse.data.taskId || uploadResponse.data.id || uploadResponse.data.data;
      console.log('从对象中提取的taskId:', taskId);
      
      if (!taskId) {
        // 如果仍然找不到taskId，打印对象的所有属性
        console.log('对象的所有属性:', Object.keys(uploadResponse.data));
        throw new Error('无法从响应中提取taskId');
      }
    } else {
      // 如果data不是对象，直接使用
      taskId = uploadResponse.data;
      console.log('直接使用的taskId:', taskId);
    }
    
    // 更新状态为处理中
    uploadStatus.value = 'processing'
    uploadProgress.value = 100
    
    // 轮询处理状态
    let pollCount = 0
    const maxPolls = 30 // 最大轮询次数
    const pollInterval = 2000 // 轮询间隔 (ms)
    
    const pollStatus = async () => {
      try {
        if (pollCount >= maxPolls) {
          throw new Error('处理超时')
        }
        
        pollCount++
        
        // 获取处理进度
        const progressResponse = await fileApi.getImportProgress(taskId)
        const status = progressResponse.data.status
        
        if (status === 'COMPLETED') {
          // 处理完成
          uploadStatus.value = 'success'
          importResult.value = {
            success: true,
            message: `成功导入 ${progressResponse.data.successCount || 0} 条记录`,
            batchId: progressResponse.data.batchId
          }
          isProcessing.value = false
          // 刷新资产列表
          assetStore.fetchAssets()
          emit('success')
          return
        } else if (status === 'FAILED') {
          // 处理失败
          throw new Error(progressResponse.data.message || '导入处理失败')
        } else {
          // 继续轮询
          setTimeout(pollStatus, pollInterval)
        }
      } catch (error) {
        uploadStatus.value = 'error'
        importResult.value = {
          success: false,
          message: error.message || '导入处理失败'
        }
        isProcessing.value = false
      }
    }
    
    // 开始轮询
    setTimeout(pollStatus, pollInterval)
    
  } catch (error) {
    uploadStatus.value = 'error'
    uploadProgress.value = 0
    errorMessage.value = `上传失败: ${error.message || '未知错误'}`
    isProcessing.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
</script>

<style scoped>
.import-dialog-content {
  padding: 10px 0;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 30px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.upload-area.drag-over {
  border-color: #409eff;
  background-color: #ecf5ff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.2);
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
  transition: all 0.3s;
  border-left: 3px solid #909399;
}

.file-preview.success-preview {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-weight: bold;
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

.upload-progress {
  margin-top: 16px;
}

.progress-text {
  margin-top: 8px;
  text-align: center;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.progress-text .is-loading {
  animation: rotating 2s linear infinite;
}

.progress-text.success-text {
  color: #67c23a;
}

.progress-text.error-text {
  color: #f56c6c;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.import-result {
  margin-top: 16px;
}

.import-tips {
  margin-top: 16px;
}
</style>
