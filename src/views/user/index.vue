<template>
  <div class="user-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd" v-permission="'user:create'">
          <el-icon><Plus /></el-icon>新增用户
        </el-button>
      </div>
    </div>

    <el-card class="table-card">
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
        <div class="filter-area">
          <el-select v-model="roleFilter" placeholder="角色" clearable @change="handleSearch">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态" clearable @change="handleSearch">
            <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </el-select>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        :size="tableDensity"
      >
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column label="角色" min-width="140">
          <template #default="scope">
            <el-tag v-for="role in scope.row.roles" :key="role" class="role-tag">
              {{ getRoleName(role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              @click="handleEdit(scope.row)" 
              v-permission="'user:edit'"
            >
              编辑
            </el-button>
            <el-button 
              type="warning" 
              link 
              @click="handleResetPassword(scope.row)" 
              v-permission="'user:reset-password'"
            >
              重置密码
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleDelete(scope.row)"
              v-if="scope.row.id !== userStore.userInfo.id"
              v-permission="'user:delete'"
            >
              删除
            </el-button>
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
          @size-change="handleSizeChange"
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
import { Plus, Search } from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import UserFormDialog from '@/components/user/UserFormDialog.vue'
import { formatDate } from '@/utils/format'

const userStore = useUserStore()
const appStore = useAppStore()

// 表格密度
const tableDensity = computed(() => appStore.tableDensity)

// 搜索和筛选条件
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// 角色选项
const roleOptions = ref([])

// 状态选项
const statusOptions = [
  { value: 1, label: '启用' },
  { value: 0, label: '禁用' }
]

// 表格数据
const userList = ref([])
const loading = ref(false)

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
  }
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      query: searchQuery.value,
      role: roleFilter.value,
      status: statusFilter.value
    }
    
    const res = await userApi.getUsers(params)
    userList.value = res.data.items || []
    pagination.total = res.data.total || 0
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
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchUsers()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchUsers()
}

// 处理添加用户
const handleAdd = () => {
  currentUser.value = null
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (user) => {
  currentUser.value = { ...user }
  dialogVisible.value = true
}

// 处理重置密码
const handleResetPassword = (user) => {
  ElMessageBox.confirm(
    `确定要重置用户 "${user.name}" 的密码吗？`,
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
  ElMessageBox.confirm(
    `确定要删除用户 "${user.name}" 吗？`,
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

// 处理表单提交成功
const handleSuccess = () => {
  fetchUsers()
}

// 初始化
onMounted(() => {
  fetchRoles()
  fetchUsers()
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
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-area {
  width: 300px;
}

.filter-area {
  display: flex;
  gap: 10px;
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
