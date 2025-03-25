<template>
  <div class="user-page">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <el-card class="table-card">
      <!-- 使用表格工具栏组件 -->
      <table-toolbar 
        :columns="columns" 
        @refresh="fetchUsers" 
        @size-change="handleDensityChange"
        @column-change="handleColumnChange"
      >
        <template #left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新增用户</span>
          </el-button>
          
          <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            <span>批量删除</span>
          </el-button>
          
          <el-dropdown v-if="selectedRows.length" @command="handleBatchCommand" split-button type="primary">
            <span>批量操作</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                <el-dropdown-item command="disable">批量禁用</el-dropdown-item>
                <el-dropdown-item command="unlock">批量解锁账户</el-dropdown-item>
                <el-dropdown-item command="assignRoles">批量分配角色</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
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
            placeholder="搜索用户名、姓名或邮箱"
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
        :data="userList"
        border
        style="width: 100%"
        fit
        :size="tableDensity"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
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
            <template v-if="col.prop === 'roles'">
              <el-tag v-for="role in scope.row.roles" :key="role" class="role-tag">
                {{ getRoleName(role) }}
              </el-tag>
            </template>
            
            <template v-else-if="col.prop === 'status'">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
            
            <template v-else-if="col.prop === 'accountNonLocked'">
              <el-tag :type="scope.row.accountNonLocked ? 'success' : 'danger'">
                {{ scope.row.accountNonLocked ? '正常' : '锁定' }}
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
                type="warning" 
                link 
                @click="handleResetPassword(scope.row)" 
              >
                重置密码
              </el-button>
              <el-button 
                type="success" 
                link 
                @click="handleUnlockAccount(scope.row)"
                v-if="!scope.row.accountNonLocked"
              >
                解锁账户
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="handleDelete(scope.row)"
                v-if="scope.row.id !== userStore.userInfo.id"
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

    <!-- 用户表单对话框 -->
    <user-form-dialog
      v-model:visible="dialogVisible"
      :user="currentUser"
      :roles="roleOptions"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Delete, Download } from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import UserFormDialog from '@/components/user/UserFormDialog.vue'
import TableToolbar from '@/components/common/TableToolbar.vue'
import { formatDate } from '@/utils/format'
import RoleSelectDialog from '@/components/user/RoleSelectDialog.vue'

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
    ElMessage.error('只有管理员和超级管理员可以使用用户管理功能')
    router.push('/dashboard')
    return false
  }
  
  return true
}

// 表格密度
const tableDensity = computed(() => appStore.tableDensity || 'default')

// 表格列配置
const columns = ref([
  { prop: 'username', label: '用户名', width: '120', visible: true },
  { prop: 'realName', label: '姓名', width: '120', visible: true },
  { prop: 'email', label: '邮箱', width: '180', visible: true },
  { prop: 'phone', label: '手机号', width: '140', visible: true },
  { prop: 'department', label: '部门', width: '140', visible: true },
  { prop: 'roles', label: '角色', width: '140', visible: true, slot: true },
  { prop: 'status', label: '状态', width: '100', visible: true, slot: true },
  { prop: 'accountNonLocked', label: '账户状态', width: '120', visible: true, slot: true },
  { prop: 'actions', label: '操作', width: '280', visible: true, slot: true }
])

// 可见列
const visibleColumns = computed(() => columns.value.filter(col => col.visible))

// 搜索和筛选条件
const searchQuery = ref('')

// 角色选项
const roleOptions = ref([])

// 表格数据
const userList = ref([])
const loading = ref(false)
const selectedRows = ref([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 对话框控制
const dialogVisible = ref(false)
const currentUser = ref(null)

// 获取角色列表
const fetchRoles = async () => {
  try {
    const res = await userApi.getRoles()
    roleOptions.value = res.data.map(role => ({
      value: role.code,
      label: role.name
    }))
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('角色列表获取失败')
  }
}

// 获取用户列表
const fetchUsers = async () => {
  if (!checkAdminPermission()) return
  
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize,
      query: searchQuery.value
    }
    
    const res = await userApi.getUsers(params)
    userList.value = res.data.content || []
    pagination.total = res.data.totalElements || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 根据角色代码获取角色名称
const getRoleName = (roleCode) => {
  const role = roleOptions.value.find(r => r.value === roleCode)
  return role ? role.label : roleCode
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchUsers()
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  fetchUsers()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchUsers()
}

// 处理查看用户详情
const handleView = (user) => {
  router.push(`/user/${user.id}`)
}

// 处理添加用户
const handleAdd = () => {
  // 不阻止操作，只显示提示
  if (!userStore.hasPermission('user:create')) {
    ElMessage.warning('您可能没有创建用户的权限，操作可能会失败')
  }
  
  currentUser.value = null
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (user) => {
  // 不阻止操作，只显示提示
  if (!userStore.hasPermission('user:edit')) {
    ElMessage.warning('您可能没有编辑用户的权限，操作可能会失败')
  }
  
  currentUser.value = { ...user }
  dialogVisible.value = true
}

// 处理重置密码
const handleResetPassword = (user) => {
  // 不阻止操作，只显示提示
  if (!userStore.hasPermission('user:reset-password')) {
    ElMessage.warning('您可能没有重置密码的权限，操作可能会失败')
  }
  
  ElMessageBox.confirm(
    `确定要重置用户 "${user.realName || user.username}" 的密码吗？`,
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await userApi.resetPassword(user.id)
      ElMessage.success('密码重置成功')
    } catch (error) {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    }
  }).catch(() => {})
}

// 处理删除用户
const handleDelete = (user) => {
  // 不阻止操作，只显示提示
  if (!userStore.hasPermission('user:delete')) {
    ElMessage.warning('您可能没有删除用户的权限，操作可能会失败')
  }
  
  ElMessageBox.confirm(
    `确定要删除用户 "${user.realName || user.username}" 吗？`,
    '删除用户',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      await userApi.deleteUser(user.id)
      ElMessage.success('用户删除成功')
      fetchUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {})
}

// 处理批量删除
const handleBatchDelete = () => {
  // 不阻止操作，只显示提示
  if (!userStore.hasPermission('user:delete')) {
    ElMessage.warning('您可能没有删除用户的权限，操作可能会失败')
  }
  
  if (selectedRows.value.length === 0) return
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
    '批量删除用户',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      const currentUserInSelected = selectedRows.value.some(row => row.id === userStore.userInfo.id)
      if (currentUserInSelected) {
        ElMessage.warning('不能删除当前登录用户，其他用户将被删除')
      }
      
      const deletePromises = selectedRows.value
        .filter(row => row.id !== userStore.userInfo.id)
        .map(row => userApi.deleteUser(row.id))
      
      await Promise.all(deletePromises)
      ElMessage.success('用户删除成功')
      fetchUsers()
    } catch (error) {
      console.error('批量删除用户失败:', error)
      ElMessage.error('批量删除用户失败')
    }
  }).catch(() => {})
}

// 处理导出用户
const handleExport = () => {
  if (!userStore.checkAndNotifyPermission('user:export', '导出用户')) return
  
  ElMessage.info('导出用户功能开发中')
  // TODO: 实现导出用户功能
}

// 处理表格行选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理表格密度变化
const handleDensityChange = (size) => {
  appStore.setTableDensity(size)
}

// 处理列变化
const handleColumnChange = () => {
  localStorage.setItem('userColumns', JSON.stringify(columns.value))
}

// 处理表单提交成功
const handleSuccess = () => {
  fetchUsers()
}

// 处理解锁用户账户
const handleUnlockAccount = (user) => {
  ElMessageBox.confirm(
    `确定要解锁用户 ${user.username} 的账户吗？`,
    '解锁账户确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    loading.value = true
    userApi.unlockUserAccount(user.id)
      .then(response => {
        ElMessage.success('用户账户解锁成功')
        fetchUsers() // 刷新用户列表
      })
      .catch(error => {
        console.error('解锁用户账户失败:', error)
        ElMessage.error(error.response?.data?.message || '解锁用户账户失败')
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {
    // 用户取消操作
  })
}

// 处理批量操作
const handleBatchCommand = (command) => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要操作的用户')
    return
  }
  
  switch (command) {
    case 'enable':
      handleBatchEnable()
      break
    case 'disable':
      handleBatchDisable()
      break
    case 'unlock':
      handleBatchUnlock()
      break
    case 'assignRoles':
      roleDialogVisible.value = true
      break
    default:
      break
  }
}

// 批量启用用户
const handleBatchEnable = () => {
  const ids = selectedRows.value.map(row => row.id)
  
  ElMessageBox.confirm(
    `确定要启用选中的 ${ids.length} 个用户吗？`,
    '批量启用确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    loading.value = true
    userApi.batchEnableUsers(ids)
      .then(response => {
        ElMessage.success(`成功启用 ${response.data.count} 个用户`)
        fetchUsers() // 刷新用户列表
      })
      .catch(error => {
        console.error('批量启用用户失败:', error)
        ElMessage.error(error.response?.data?.message || '批量启用用户失败')
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量禁用用户
const handleBatchDisable = () => {
  const ids = selectedRows.value.map(row => row.id)
  
  ElMessageBox.confirm(
    `确定要禁用选中的 ${ids.length} 个用户吗？`,
    '批量禁用确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    loading.value = true
    userApi.batchDisableUsers(ids)
      .then(response => {
        ElMessage.success(`成功禁用 ${response.data.count} 个用户`)
        fetchUsers() // 刷新用户列表
      })
      .catch(error => {
        console.error('批量禁用用户失败:', error)
        ElMessage.error(error.response?.data?.message || '批量禁用用户失败')
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量解锁用户账户
const handleBatchUnlock = () => {
  const ids = selectedRows.value.map(row => row.id)
  
  ElMessageBox.confirm(
    `确定要解锁选中的 ${ids.length} 个用户账户吗？`,
    '批量解锁账户确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    loading.value = true
    userApi.batchUnlockUserAccounts({ userIds: ids })
      .then(response => {
        ElMessage.success(`成功解锁 ${response.data.count} 个用户账户`)
        fetchUsers() // 刷新用户列表
      })
      .catch(error => {
        console.error('批量解锁用户账户失败:', error)
        ElMessage.error(error.response?.data?.message || '批量解锁用户账户失败')
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量分配角色
const handleBatchAssignRoles = (roleIds) => {
  if (!roleIds || !roleIds.length) {
    ElMessage.warning('请选择要分配的角色')
    return
  }
  
  const userIds = selectedRows.value.map(row => row.id)
  
  loading.value = true
  userApi.batchAssignRoles(userIds, roleIds)
    .then(response => {
      ElMessage.success(`成功为 ${response.data.count} 个用户分配角色`)
      fetchUsers() // 刷新用户列表
    })
    .catch(error => {
      console.error('批量分配角色失败:', error)
      ElMessage.error(error.response?.data?.message || '批量分配角色失败')
    })
    .finally(() => {
      loading.value = false
      roleDialogVisible.value = false
    })
}

// 初始化
onMounted(() => {
  if (checkAdminPermission()) {
    // 加载本地保存的列配置
    const savedColumns = localStorage.getItem('userColumns')
    if (savedColumns) {
      columns.value = JSON.parse(savedColumns)
    }
    
    fetchRoles()
    fetchUsers()
  }
})
</script>

<style scoped>
.user-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
  width: 100%;
}

.el-table {
  width: 100% !important;
}

.table-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.search-area {
  width: 300px;
}

.role-tag {
  margin-right: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
