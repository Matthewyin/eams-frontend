<template>
  <div class="user-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button v-if="hasPermission('user:create')" type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon> 新增用户
          </el-button>
        </div>
      </template>
      
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户搜索">
          <el-input v-model="queryParams.query" placeholder="用户名/姓名/邮箱" @keyup.enter="handleQuery" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="角色" min-width="150">
          <template #default="scope">
            <el-tag v-for="role in scope.row.roles" :key="role" class="role-tag">
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后登录" width="170">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.lastLoginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button v-if="hasPermission('user:role')" link type="primary" @click="handleUserRole(scope.row)">
              <el-icon><Setting /></el-icon> 分配角色
            </el-button>
            <el-button v-if="hasPermission('user:update')" link type="primary" @click="handleEditUser(scope.row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button v-if="hasPermission('user:reset-password')" link type="warning" @click="handleResetPassword(scope.row)">
              <el-icon><Key /></el-icon> 重置密码
            </el-button>
            <el-button v-if="hasPermission('user:delete') && !isAdmin(scope.row)" link type="danger" @click="handleDeleteUser(scope.row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="userDialog.visible"
      :title="userDialog.title"
      width="600px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="userDialog.isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item v-if="!userDialog.isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitUserForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 角色分配对话框 -->
    <el-dialog
      v-model="roleDialog.visible"
      title="角色分配"
      width="500px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form label-width="100px">
        <el-form-item label="用户名">
          <span>{{ roleDialog.username }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{ roleDialog.realName }}</span>
        </el-form-item>
        <el-form-item label="角色分配">
          <el-checkbox-group v-model="selectedRoles">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitUserRoles">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search, Refresh, Edit, Delete, Setting, Key } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api/user'
import { roleApi } from '@/api/role'
import { formatDateTime } from '@/utils/format'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 权限判断
const hasPermission = (permission) => {
  return userStore.hasPermission(permission)
}

// 判断是否是管理员
const isAdmin = (user) => {
  return user.roles && user.roles.some(role => 
    role.toLowerCase() === 'admin' || 
    role.toLowerCase() === 'administrator' || 
    role.toLowerCase() === 'superadmin'
  )
}

// 数据列表
const loading = ref(false)
const userList = ref([])
const total = ref(0)
const queryParams = reactive({
  query: '',
  pageNum: 1,
  pageSize: 10
})

// 用户表单对话框
const userFormRef = ref(null)
const userDialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})
const userForm = reactive({
  id: undefined,
  username: '',
  realName: '',
  email: '',
  phone: '',
  password: '',
  status: 1
})
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 角色分配对话框
const roleDialog = reactive({
  visible: false,
  userId: undefined,
  username: '',
  realName: ''
})
const roleList = ref([])
const selectedRoles = ref([])

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const res = await userApi.getUsers({
      query: queryParams.query,
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize
    })
    userList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to load user list:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 加载角色列表
const loadRoleList = async () => {
  try {
    const res = await roleApi.getAllRolesExceptSuperAdmin()
    roleList.value = res
  } catch (error) {
    console.error('Failed to load role list:', error)
    ElMessage.error('获取角色列表失败')
  }
}

// 加载用户角色
const loadUserRoles = async (userId) => {
  try {
    selectedRoles.value = await getUserRoles(userId);
  } catch (error) {
    console.error('Failed to load user roles:', error);
    ElMessage.error('获取用户角色失败');
  }
};

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1
  loadUserList()
}

// 重置查询
const resetQuery = () => {
  queryParams.query = ''
  handleQuery()
}

// 页码改变
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  loadUserList()
}

// 页数改变
const handleCurrentChange = (page) => {
  queryParams.pageNum = page
  loadUserList()
}

// 新增用户
const handleAddUser = () => {
  userDialog.title = '新增用户'
  userDialog.isEdit = false
  resetUserForm()
  userDialog.visible = true
}

// 编辑用户
const handleEditUser = (row) => {
  userDialog.title = '编辑用户'
  userDialog.isEdit = true
  resetUserForm()
  // 填充表单数据
  Object.assign(userForm, row)
  delete userForm.password // 编辑时不需要密码字段
  userDialog.visible = true
}

// 删除用户
const handleDeleteUser = (row) => {
  if (isAdmin(row)) {
    ElMessage.warning('管理员账号不可删除')
    return
  }
  
  ElMessageBox.confirm(`确认删除用户"${row.realName}(${row.username})"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userApi.deleteUser(row.id)
      ElMessage.success('删除成功')
      loadUserList()
    } catch (error) {
      console.error('Failed to delete user:', error)
      ElMessage.error('删除失败：' + error.message)
    }
  }).catch(() => {})
}

// 重置密码
const handleResetPassword = (row) => {
  ElMessageBox.confirm(`确认重置"${row.realName}(${row.username})"的密码吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userApi.resetPassword(row.id)
      ElMessage.success('密码重置成功')
    } catch (error) {
      console.error('Failed to reset password:', error)
      ElMessage.error('密码重置失败：' + error.message)
    }
  }).catch(() => {})
}

// 分配角色
const handleUserRole = (row) => {
  roleDialog.userId = row.id
  roleDialog.username = row.username
  roleDialog.realName = row.realName
  selectedRoles.value = []
  
  // 加载用户角色
  loadUserRoles(row.id)
  
  roleDialog.visible = true
}

// 重置用户表单
const resetUserForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  userForm.id = undefined
  userForm.username = ''
  userForm.realName = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.password = ''
  userForm.status = 1
}

// 提交用户表单
const submitUserForm = async () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (userForm.id) {
          // 更新
          await userApi.updateUser(userForm.id, userForm)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await userApi.createUser(userForm)
          ElMessage.success('新增成功')
        }
        userDialog.visible = false
        loadUserList()
      } catch (error) {
        console.error('Failed to save user:', error)
        ElMessage.error('保存失败：' + error.message)
      }
    }
  })
}

// 提交用户角色
const submitUserRoles = async () => {
  try {
    await roleApi.assignUserRoles(roleDialog.userId, selectedRoles.value)
    ElMessage.success('角色分配成功')
    roleDialog.visible = false
    loadUserList()
  } catch (error) {
    console.error('Failed to assign user roles:', error)
    ElMessage.error('角色分配失败: ' + error.message)
  }
}

// 获取用户角色
const getUserRoles = async (userId) => {
  try {
    const res = await roleApi.getUserRoles(userId)
    return res.map(role => role.id)
  } catch (error) {
    console.error('Failed to get user roles:', error)
    ElMessage.error('获取用户角色失败')
    return []
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadUserList()
  loadRoleList()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.status-tag {
  min-width: 60px;
  text-align: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info-container {
  display: flex;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
}

.user-email {
  font-size: 12px;
  color: #909399;
}
</style> 