<template>
  <el-dialog
    v-model="visible"
    title="操作日志详情"
    width="800px"
    destroy-on-close
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="操作类型">
        <el-tag :type="getOperationTypeTag(detail.operationType)">
          {{ getOperationTypeText(detail.operationType) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="操作模块">
        {{ getModuleText(detail.module) }}
      </el-descriptions-item>
      <el-descriptions-item label="操作人">
        {{ detail.operatorName }}
      </el-descriptions-item>
      <el-descriptions-item label="操作时间">
        {{ detail.operationTime }}
      </el-descriptions-item>

      <el-descriptions-item label="操作结果">
        <el-tag :type="detail.status === 'SUCCESS' ? 'success' : 'danger'">
          {{ detail.status === 'SUCCESS' ? '成功' : '失败' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="操作描述" :span="2">
        {{ detail.description }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detail.status === 'FAILED'" label="失败原因" :span="2">
        <div class="error-message">{{ detail.errorMessage }}</div>
      </el-descriptions-item>
    </el-descriptions>

    <div v-if="hasDataChanges" class="data-diff-container">
      <h3>数据变更对比</h3>
      <el-tabs type="border-card">
        <el-tab-pane label="JSON对比">
          <div class="json-diff">
            <div class="json-panel">
              <h4>操作前数据</h4>
              <pre v-if="detail.beforeData">{{ formatJson(detail.beforeData) }}</pre>
              <div v-else class="no-data">无数据</div>
            </div>
            <div class="json-panel">
              <h4>操作后数据</h4>
              <pre v-if="detail.afterData">{{ formatJson(detail.afterData) }}</pre>
              <div v-else class="no-data">无数据</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="表格对比">
          <el-table :data="diffData" border stripe>
            <el-table-column prop="key" label="字段" width="180" />
            <el-table-column prop="before" label="修改前">
              <template #default="scope">
                <div :class="{ 'diff-highlight': scope.row.changed }">
                  {{ scope.row.before }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="after" label="修改后">
              <template #default="scope">
                <div :class="{ 'diff-highlight': scope.row.changed }">
                  {{ scope.row.after }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { logApi } from '@/api/log'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  logId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const detail = ref({})
const loading = ref(false)

// 监听logId变化，获取日志详情
watch(() => props.logId, async (newVal) => {
  if (newVal && visible.value) {
    await fetchLogDetail()
  }
})

// 监听visible变化，获取日志详情
watch(() => visible.value, async (newVal) => {
  if (newVal && props.logId) {
    await fetchLogDetail()
  }
})

// 获取日志详情
const fetchLogDetail = async () => {
  if (!props.logId) return
  
  loading.value = true
  try {
    const res = await logApi.getLogById(props.logId)
    
    // 如果后端未启动，使用模拟数据
    if (!res || !res.data) {
      // 模拟数据
      detail.value = {
        id: props.logId,
        operationType: 'UPDATE',
        module: 'ASSET',
        objectId: '123',
        objectType: 'ASSET',
        beforeData: { name: '旧资产名称', status: 'IN_USE', departmentId: 1 },
        afterData: { name: '新资产名称', status: 'IDLE', departmentId: 2 },
        operatorId: '1',
        operatorName: '管理员',
        operationTime: '2025-03-19 10:00:00',

        status: 'SUCCESS',
        errorMessage: null,
        description: '修改了资产 "ThinkPad X1" 的信息'
      }
      loading.value = false
      return
    }

    detail.value = res.data
  } catch (error) {
    console.error('获取日志详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 是否有数据变更
const hasDataChanges = computed(() => {
  return (detail.value.beforeData && Object.keys(detail.value.beforeData).length > 0) || 
         (detail.value.afterData && Object.keys(detail.value.afterData).length > 0)
})

// 数据对比结果
const diffData = computed(() => {
  if (!hasDataChanges.value) return []
  
  const beforeData = detail.value.beforeData || {}
  const afterData = detail.value.afterData || {}
  
  // 合并所有键
  const allKeys = [...new Set([...Object.keys(beforeData), ...Object.keys(afterData)])]
  
  return allKeys.map(key => {
    const before = beforeData[key]
    const after = afterData[key]
    const changed = JSON.stringify(before) !== JSON.stringify(after)
    
    return {
      key,
      before: before !== undefined ? JSON.stringify(before) : '无数据',
      after: after !== undefined ? JSON.stringify(after) : '无数据',
      changed
    }
  })
})

// 格式化JSON
const formatJson = (json) => {
  if (!json) return ''
  return JSON.stringify(json, null, 2)
}

// 获取操作类型标签类型
const getOperationTypeTag = (type) => {
  const map = {
    'CREATE': 'success',
    'UPDATE': 'warning',
    'DELETE': 'danger',
    'QUERY': 'info',
    'IMPORT': 'primary',
    'EXPORT': 'primary',
    'LOGIN': 'info',
    'LOGOUT': 'info'
  }
  return map[type] || 'info'
}

// 获取操作类型文本
const getOperationTypeText = (type) => {
  const map = {
    'CREATE': '新增',
    'UPDATE': '修改',
    'DELETE': '删除',
    'QUERY': '查询',
    'IMPORT': '导入',
    'EXPORT': '导出',
    'LOGIN': '登录',
    'LOGOUT': '登出'
  }
  return map[type] || type
}

// 获取模块文本
const getModuleText = (module) => {
  const map = {
    'ASSET': '资产管理',
    'DEPARTMENT': '部门管理',
    'USER': '用户管理',
    'SYSTEM': '系统设置'
  }
  return map[module] || module
}
</script>

<style scoped>
.error-message {
  color: #f56c6c;
  word-break: break-all;
}

.data-diff-container {
  margin-top: 20px;
}

.json-diff {
  display: flex;
  gap: 20px;
}

.json-panel {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

.json-panel h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #606266;
}

.json-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow: auto;
}

.no-data {
  color: #909399;
  font-style: italic;
}

.diff-highlight {
  background-color: #fdf6ec;
  color: #e6a23c;
  padding: 2px 4px;
  border-radius: 2px;
}
</style>
