<template>
  <div class="group-page">
    <div class="page-header">
      <h2>用户组管理</h2>
    </div>

    <el-card class="table-card">
      <!-- 使用表格工具栏组件 -->
      <table-toolbar 
        :columns="columns" 
        @refresh="fetchGroups" 
        @size-change="handleDensityChange"
        @column-change="handleColumnChange"
      >
        <template #left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新增用户组</span>
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
            placeholder="搜索用户组名称或编码"
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
        :data="groupList"
        border
        style="width: 100%"
        fit
        :size="tableDensity"
        row-key="id"
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

    <!-- 用户组表单对话框 -->
    <group-form-dialog
      v-model:visible="dialogVisible"
      :group="currentGroup"
      @success="handleSuccess"
    />

    <!-- 用户组用户对话框 -->
    <group-users-dialog
      v-model:visible="usersDialogVisible"
      :group="currentGroup"
      v-if="usersDialogVisible"
    />

    <!-- 分配用户对话框 -->
    <assign-users-to-group-dialog
      v-model:visible="assignUsersDialogVisible"
      :group="currentGroup"
      v-if="assignUsersDialogVisible"
      @success="handleAssignUsersSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Download } from '@element-plus/icons-vue'
import { groupApi } from '@/api/group'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import TableToolbar from '@/components/common/TableToolbar.vue'
import GroupFormDialog from '@/components/group/GroupFormDialog.vue'
import GroupUsersDialog from '@/components/group/GroupUsersDialog.vue'
import AssignUsersToGroupDialog from '@/components/group/AssignUsersToGroupDialog.vue'
import { formatDate } from '@/utils/format'
import { exportToExcel } from '@/utils/export'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

// 检查用户是否有权限访问该页面
const checkAdminPermission = () => {
  const userRoles = userStore.userInfo.roles || []
  const isAdmin = userRoles.some(role => 
    ['admin', 'administrator', 'ADMIN', 'SUPER_ADMIN'].includes(role)
  )
  
  if (!isAdmin) {
    ElMessage.error('只有管理员和超级管理员可以使用用户组管理功能')
    router.push('/dashboard')
    return false
  }
  
  return true
}

// 表格密度
const tableDensity = computed(() => appStore.tableDensity || 'default')

// 表格列配置
const columns = ref([
  { prop: 'name', label: '用户组名称', width: '180', visible: true },
  { prop: 'code', label: '用户组编码', width: '150', visible: true },
  { prop: 'description', label: '描述', width: '200', visible: true },
  { prop: 'enabled', label: '状态', width: '100', visible: true, slot: true },
  { prop: 'createdTime', label: '创建时间', width: '180', visible: true },
  { prop: 'updatedTime', label: '更新时间', width: '180', visible: true },
  { prop: 'actions', label: '操作', width: '350', visible: true, slot: true }
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
const currentGroup = ref({})
const groupList = ref([])
const searchQuery = ref('')

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取用户组列表
const fetchGroups = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize,
      query: searchQuery.value
    }
    
    const res = await groupApi.getGroups(params)
    if (res.data && res.data.success) {
      groupList.value = res.data.data.content
      pagination.total = res.data.data.totalElements
    }
  } catch (error) {
    console.error('获取用户组列表失败:', error)
    ElMessage.error('获取用户组列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchGroups()
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  fetchGroups()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchGroups()
}

// 处理查看用户组详情
const handleView = (group) => {
  currentGroup.value = { ...group }
  dialogVisible.value = true
}

// 处理添加用户组
const handleAdd = () => {
  currentGroup.value = {
    name: '',
    code: '',
    description: '',
    enabled: true
  }
  dialogVisible.value = true
}

// 处理编辑用户组
const handleEdit = (group) => {
  currentGroup.value = { ...group }
  dialogVisible.value = true
}

// 处理删除用户组
const handleDelete = (group) => {
  ElMessageBox.confirm(
    `确定要删除用户组 "${group.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        const res = await groupApi.deleteGroup(group.id)
        if (res.data && res.data.success) {
          ElMessage.success('删除用户组成功')
          fetchGroups()
        }
      } catch (error) {
        console.error('删除用户组失败:', error)
        ElMessage.error('删除用户组失败')
      }
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 处理查看用户组用户
const handleViewUsers = (group) => {
  currentGroup.value = { ...group }
  usersDialogVisible.value = true
}

// 处理分配用户到用户组
const handleAssignUsers = (group) => {
  currentGroup.value = { ...group }
  assignUsersDialogVisible.value = true
}

// 处理分配用户成功
const handleAssignUsersSuccess = () => {
  ElMessage.success('用户分配成功')
  // 刷新用户组列表
  fetchGroups()
}

// 处理导出
const handleExport = () => {
  loading.value = true
  try {
    // 准备导出数据
    const exportData = groupList.value.map(item => ({
      '用户组名称': item.name,
      '用户组编码': item.code,
      '描述': item.description,
      '状态': item.enabled ? '启用' : '禁用',
      '创建时间': formatDate(item.createdTime),
      '更新时间': formatDate(item.updatedTime)
    }))
    
    // 导出到Excel
    exportToExcel(exportData, '用户组列表')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

// 处理表格密度变化
const handleDensityChange = (size) => {
  appStore.setTableDensity(size)
}

// 处理列变化
const handleColumnChange = () => {
  // 保存列配置到本地存储
  localStorage.setItem('groupColumns', JSON.stringify(columns.value))
}

// 处理表单提交成功
const handleSuccess = () => {
  fetchGroups()
}

// 初始化
onMounted(() => {
  if (checkAdminPermission()) {
    // 加载本地保存的列配置
    const savedColumns = localStorage.getItem('groupColumns')
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns)
        columns.value = parsedColumns
      } catch (error) {
        console.error('解析保存的列配置失败:', error)
      }
    }
    
    // 获取用户组列表
    fetchGroups()
  }
})
</script>

<style scoped>
.group-page {
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
}

.search-area {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
