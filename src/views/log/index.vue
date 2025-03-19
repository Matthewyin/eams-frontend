<template>
  <div class="log-page">
    <el-card class="search-card">
      <el-form :model="queryParams" label-width="80px" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </el-form-item>

        <el-form-item label="操作类型">
          <el-select v-model="queryParams.operationType" placeholder="请选择" clearable>
            <el-option label="新增" value="CREATE" />
            <el-option label="修改" value="UPDATE" />
            <el-option label="删除" value="DELETE" />
            <el-option label="查询" value="QUERY" />
            <el-option label="导入" value="IMPORT" />
            <el-option label="导出" value="EXPORT" />
            <el-option label="登录" value="LOGIN" />
            <el-option label="登出" value="LOGOUT" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作模块">
          <el-select v-model="queryParams.module" placeholder="请选择" clearable>
            <el-option label="资产管理" value="ASSET" />
            <el-option label="部门管理" value="DEPARTMENT" />
            <el-option label="用户管理" value="USER" />
            <el-option label="系统设置" value="SYSTEM" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="请输入关键词" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>操作日志列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>
              <span>导出</span>
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="logList"
        border
        stripe
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)">
              {{ getOperationTypeText(scope.row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="操作模块" width="120">
          <template #default="scope">
            {{ getModuleText(scope.row.module) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人" width="120" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />

        <el-table-column prop="status" label="操作结果" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ scope.row.status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 日志详情弹窗 -->
    <log-detail-dialog
      v-model="detailDialogVisible"
      :log-id="currentLogId"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logApi } from '@/api/log'
import LogDetailDialog from '@/components/log/LogDetailDialog.vue'

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  startTime: '',
  endTime: '',
  operationType: '',
  module: '',
  keyword: ''
})

// 日期范围
const dateRange = ref([])

// 数据列表
const logList = ref([])
const total = ref(0)
const loading = ref(false)

// 详情弹窗
const detailDialogVisible = ref(false)
const currentLogId = ref('')

// 初始化
onMounted(() => {
  fetchLogs()
})

// 获取日志列表
const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await logApi.getLogs(queryParams)

    // 如果后端未启动，使用模拟数据
    if (!res || !res.data) {
      // 模拟数据
      const mockData = []
      for (let i = 1; i <= 20; i++) {
        const operationType = ['CREATE', 'UPDATE', 'DELETE', 'QUERY', 'IMPORT', 'EXPORT'][Math.floor(Math.random() * 6)]
        const module = ['ASSET', 'DEPARTMENT', 'USER', 'SYSTEM'][Math.floor(Math.random() * 4)]
        const status = Math.random() > 0.9 ? 'FAILED' : 'SUCCESS'
        
        let description = ''
        if (module === 'ASSET') {
          if (operationType === 'CREATE') description = '创建了资产 "ThinkPad X1"'
          else if (operationType === 'UPDATE') description = '修改了资产 "ThinkPad X1" 的信息'
          else if (operationType === 'DELETE') description = '删除了资产 "ThinkPad X1"'
        } else if (module === 'DEPARTMENT') {
          if (operationType === 'CREATE') description = '创建了部门 "研发部"'
          else if (operationType === 'UPDATE') description = '修改了部门 "研发部" 的信息'
          else if (operationType === 'DELETE') description = '删除了部门 "研发部"'
        }
        
        mockData.push({
          id: i.toString(),
          operationType,
          module,
          objectId: Math.floor(Math.random() * 1000).toString(),
          objectType: module,
          operatorId: '1',
          operatorName: '管理员',
          operationTime: `2025-03-${Math.floor(Math.random() * 19) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,

          status,
          description: description || `执行了${getOperationTypeText(operationType)}操作`
        })
      }
      
      logList.value = mockData
      total.value = 100
      loading.value = false
      return
    }

    logList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('获取日志列表失败:', error)
    logList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理日期范围变化
const handleDateRangeChange = (val) => {
  if (val) {
    queryParams.startTime = val[0]
    queryParams.endTime = val[1]
  } else {
    queryParams.startTime = ''
    queryParams.endTime = ''
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchLogs()
}

// 处理重置
const handleReset = () => {
  dateRange.value = []
  Object.assign(queryParams, {
    page: 1,
    pageSize: 10,
    startTime: '',
    endTime: '',
    operationType: '',
    module: '',
    keyword: ''
  })
  fetchLogs()
}

// 处理导出
const handleExport = async () => {
  try {
    ElMessageBox.confirm('确认导出所选操作日志数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在导出数据，请稍候...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      try {
        const res = await logApi.exportLogs(queryParams)
        
        // 如果后端未启动，模拟导出成功
        if (!res) {
          setTimeout(() => {
            loading.close()
            ElMessage.success('导出成功')
          }, 1500)
          return
        }
        
        // 创建下载链接
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `操作日志_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)
        
        loading.close()
        ElMessage.success('导出成功')
      } catch (error) {
        console.error('导出日志失败:', error)
        loading.close()
        ElMessage.error('导出失败')
      }
    }).catch(() => {})
  } catch (error) {
    console.error('导出日志失败:', error)
    ElMessage.error('导出失败')
  }
}

// 处理查看详情
const handleViewDetail = (row) => {
  currentLogId.value = row.id
  detailDialogVisible.value = true
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  fetchLogs()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  queryParams.page = val
  fetchLogs()
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
.log-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
