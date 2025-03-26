<template>
  <div class="department-page">
    <div class="page-header">
      <h2>部门管理</h2>
    </div>

    <el-card class="table-card">
      <!-- 使用表格工具栏组件 -->
      <table-toolbar 
        :columns="columns" 
        @refresh="fetchDepartments" 
        @size-change="handleDensityChange"
        @column-change="handleColumnChange"
      >
        <template #left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新增部门</span>
          </el-button>
          
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            <span>导出</span>
          </el-button>
        </template>
      </table-toolbar>

      <div class="table-toolbar">
        <div class="search-area">
          <el-input
            v-model="searchQuery"
            placeholder="搜索部门名称或编码"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon class="el-input__icon" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="departmentList"
        border
        style="width: 100%"
        fit
        :size="tableDensity"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column 
          v-for="col in visibleColumns" 
          :key="col.prop" 
          :prop="col.prop" 
          :label="col.label" 
          :width="col.width"
          :show-overflow-tooltip="true"
          :fixed="col.prop === 'actions' ? 'right' : false"
        >
          <template #default="scope" v-if="col.slot">
            <template v-if="col.prop === 'enabled'">
              <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
                {{ scope.row.enabled ? '启用' : '禁用' }}
              </el-tag>
            </template>
            
            <template v-else-if="col.prop === 'actions'">
              <el-button 
                type="primary" 
                link 
                @click="handleView(scope.row)" 
              >
                查看
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="handleEdit(scope.row)" 
              >
                编辑
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="handleViewUsers(scope.row)" 
              >
                查看用户
              </el-button>
              <el-button 
                type="success" 
                link 
                @click="handleAssignUsers(scope.row)" 
              >
                分配用户
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 部门表单对话框 -->
    <department-form-dialog
      v-model:visible="dialogVisible"
      :department="currentDepartment"
      :departments="allDepartments"
      @success="handleSuccess"
    />

    <!-- 部门用户对话框 -->
    <department-users-dialog
      v-model:visible="usersDialogVisible"
      :department="currentDepartment"
      v-if="usersDialogVisible"
    />

    <!-- 分配用户对话框 -->
    <assign-users-to-department-dialog
      v-model:visible="assignUsersDialogVisible"
      :department="currentDepartment"
      v-if="assignUsersDialogVisible"
      @success="handleAssignUsersSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Download } from '@element-plus/icons-vue'
import { departmentApi } from '@/api/department'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import TableToolbar from '@/components/common/TableToolbar.vue'
import DepartmentFormDialog from '@/components/department/DepartmentFormDialog.vue'
import DepartmentUsersDialog from '@/components/department/DepartmentUsersDialog.vue'
import AssignUsersToDepartmentDialog from '@/components/department/AssignUsersToDepartmentDialog.vue'
import { formatDate } from '@/utils/format'
import { exportToExcel } from '@/utils/export'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

// 检查用户是否有权限访问该页面
const checkAdminPermission = () => {
  const userRoles = userStore.userInfo.roles || []
  const isAdmin = userRoles.some(role => 
    ['admin', 'administrator', 'ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(role)
  )
  
  if (!isAdmin) {
    ElMessage.error('只有管理员和超级管理员可以使用部门管理功能')
    router.push('/dashboard')
    return false
  }
  
  return true
}

// 表格密度
const tableDensity = computed(() => appStore.tableDensity || 'default')

// 表格列配置
const columns = ref([
  { prop: 'name', label: '部门名称', width: '180', visible: true },
  { prop: 'code', label: '部门编码', width: '150', visible: true },
  { prop: 'description', label: '描述', width: '200', visible: true },
  { prop: 'enabled', label: '状态', width: '100', visible: true, slot: true },
  { prop: 'createdTime', label: '创建时间', width: '180', visible: true },
  { prop: 'updatedTime', label: '更新时间', width: '180', visible: true },
  { prop: 'actions', label: '操作', width: '280', visible: true, slot: true }
])

// 可见列
const visibleColumns = computed(() => {
  return columns.value.filter(col => col.visible)
})

// 状态
const loading = ref(false)
const dialogVisible = ref(false)
const usersDialogVisible = ref(false)
const assignUsersDialogVisible = ref(false)
const currentDepartment = ref({})
const departmentList = ref([])
const allDepartments = ref([])
const searchQuery = ref('')

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取所有部门（用于下拉选择）
const fetchAllDepartments = async () => {
  try {
    const res = await departmentApi.getAllDepartments()
    if (res.data && res.data.success) {
      allDepartments.value = res.data.data
    }
  } catch (error) {
    console.error('获取所有部门失败:', error)
  }
}

// 获取部门列表
const fetchDepartments = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize,
      name: searchQuery.value || undefined
    }
    
    const res = await departmentApi.getDepartments(params)
    if (res.data && res.data.success) {
      departmentList.value = res.data.data.content
      pagination.total = res.data.data.totalElements
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchDepartments()
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  fetchDepartments()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchDepartments()
}

// 处理查看部门详情
const handleView = (department) => {
  currentDepartment.value = { ...department }
  dialogVisible.value = true
}

// 处理添加部门
const handleAdd = () => {
  currentDepartment.value = {
    name: '',
    code: '',
    description: '',
    enabled: true,
    parentId: null
  }
  dialogVisible.value = true
}

// 处理编辑部门
const handleEdit = (department) => {
  currentDepartment.value = { ...department }
  dialogVisible.value = true
}

// 处理删除部门
const handleDelete = (department) => {
  ElMessageBox.confirm(
    `确定要删除部门 "${department.name}" 吗？删除后不可恢复，且会删除该部门下的所有子部门。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    loading.value = true
    try {
      const res = await departmentApi.deleteDepartment(department.id)
      if (res.data && res.data.success) {
        ElMessage.success('删除部门成功')
        fetchDepartments()
      }
    } catch (error) {
      console.error('删除部门失败:', error)
      ElMessage.error(error.response?.data?.message || '删除部门失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 处理查看部门用户
const handleViewUsers = (department) => {
  currentDepartment.value = { ...department }
  usersDialogVisible.value = true
}

// 处理导出
const handleExport = () => {
  loading.value = true
  
  const exportData = departmentList.value.map(item => ({
    '部门名称': item.name,
    '部门编码': item.code,
    '描述': item.description,
    '状态': item.enabled ? '启用' : '禁用',
    '创建时间': formatDate(item.createdTime),
    '更新时间': formatDate(item.updatedTime)
  }))
  
  exportToExcel(exportData, '部门列表')
  loading.value = false
}

// 处理表格密度变化
const handleDensityChange = (size) => {
  appStore.setTableDensity(size)
}

// 处理列变化
const handleColumnChange = () => {
  // 保存列配置到本地存储
  localStorage.setItem('departmentColumns', JSON.stringify(columns.value))
}

// 处理表单提交成功
const handleSuccess = () => {
  // 刷新部门列表
  fetchDepartments()
  // 刷新下拉选择框中的部门列表
  fetchAllDepartments()
  // 显示成功提示
  ElMessage.success('操作成功')
}

// 初始化
onMounted(() => {
  if (checkAdminPermission()) {
    // 加载本地保存的列配置
    const savedColumns = localStorage.getItem('departmentColumns')
    if (savedColumns) {
      columns.value = JSON.parse(savedColumns)
    }
    
    // 获取部门列表和所有部门
    fetchDepartments()
    fetchAllDepartments()
  }
})
</script>

<style scoped>
.department-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.table-toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
