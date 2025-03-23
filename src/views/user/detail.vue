<template>
  <div class="user-detail-page">
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>用户详情</h2>
      </div>
      <div class="header-actions" v-if="isAdmin">
        <el-button type="primary" @click="handleEdit" v-permission="'user:edit'">
          <el-icon><Edit /></el-icon>
          <span>编辑</span>
        </el-button>
        
        <el-tooltip content="刷新" placement="top">
          <el-button @click="fetchUserDetail" :loading="loading" circle>
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="密度" placement="top">
          <el-dropdown trigger="click" @command="handleSizeChange">
            <el-button circle>
              <el-icon><Grid /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="large">默认</el-dropdown-item>
                <el-dropdown-item command="default">中等</el-dropdown-item>
                <el-dropdown-item command="small">紧凑</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="detail-card" v-loading="loading">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
            </div>
          </template>
          
          <div class="detail-content" v-if="userDetail">
            <el-descriptions :column="2" border :size="tableDensity">
              <el-descriptions-item label="用户名">{{ userDetail.username }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{ userDetail.realName }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ userDetail.email }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ userDetail.phone }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ userDetail.department }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="userDetail.status === 1 ? 'success' : 'danger'">
                  {{ userDetail.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="角色">
                <el-tag v-for="role in userDetail.roles" :key="role" class="role-tag">
                  {{ getRoleName(role) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间" v-if="userDetail.createdAt">
                {{ formatDate(userDetail.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间" v-if="userDetail.updatedAt">
                {{ formatDate(userDetail.updatedAt) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          
          <div v-else class="no-data">
            <el-empty description="暂无数据" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="side-card">
          <template #header>
            <div class="card-header">
              <h3>操作</h3>
            </div>
          </template>
          
          <div class="actions-content">
            <el-button 
              type="warning" 
              @click="handleResetPassword" 
              v-permission="'user:reset-password'"
              :disabled="loading"
              block
            >
              <el-icon><Key /></el-icon>重置密码
            </el-button>
            
            <el-button 
              type="danger" 
              @click="handleDelete" 
              v-permission="'user:delete'"
              :disabled="loading || isCurrentUser"
              block
              class="mt-10"
            >
              <el-icon><Delete /></el-icon>删除用户
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单对话框 -->
    <user-form-dialog
      v-model:visible="dialogVisible"
      :user="userDetail"
      :roles="roleOptions"
      @success="fetchUserDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import UserFormDialog from '@/components/user/UserFormDialog.vue'
import { formatDate } from '@/utils/format'
import { ArrowLeft, Edit, Key, Delete, Refresh, Grid } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 表格密度
const tableDensity = computed(() => appStore.tableDensity || 'default')

// 用户ID
const userId = computed(() => route.params.id)

// 是否为当前登录用户
const isCurrentUser = computed(() => userStore.userInfo.id === userId.value)

// 是否为管理员
const isAdmin = computed(() => {
  const userRoles = userStore.userInfo.roles || []
  return userRoles.some(role => 
    ['admin', 'administrator', 'ADMIN', 'SUPER_ADMIN'].includes(role)
  )
})

// 角色选项
const roleOptions = ref([])

// 用户详情
const userDetail = ref(null)
const loading = ref(false)

// 对话框控制
const dialogVisible = ref(false)

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

// 获取用户详情
const fetchUserDetail = async () => {
  if (!userId.value) return
  
  loading.value = true
  try {
    const res = await userApi.getUser(userId.value)
    userDetail.value = res.data
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 根据角色代码获取角色名称
const getRoleName = (roleCode) => {
  const role = roleOptions.value.find(r => r.value === roleCode)
  return role ? role.label : roleCode
}

// 处理编辑用户
const handleEdit = () => {
  if (!userStore.checkAndNotifyPermission('user:edit', '编辑用户')) return
  
  dialogVisible.value = true
}

// 处理重置密码
const handleResetPassword = () => {
  if (!userStore.checkAndNotifyPermission('user:reset-password', '重置密码')) return
  
  ElMessageBox.confirm(
    `确定要重置用户 "${userDetail.value.realName || userDetail.value.username}" 的密码吗？`,
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await userApi.resetPassword(userId.value)
      ElMessage.success('密码重置成功')
    } catch (error) {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    }
  }).catch(() => {})
}

// 处理删除用户
const handleDelete = () => {
  if (!userStore.checkAndNotifyPermission('user:delete', '删除用户')) return
  if (isCurrentUser.value) {
    ElMessage.warning('不能删除当前登录用户')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除用户 "${userDetail.value.realName || userDetail.value.username}" 吗？此操作不可恢复！`,
    '删除用户',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      await userApi.deleteUser(userId.value)
      ElMessage.success('用户删除成功')
      router.replace('/user')
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {})
}

// 处理表格密度变化
const handleSizeChange = (size) => {
  appStore.setTableDensity(size)
}

// 检查用户权限
const checkAdminPermission = () => {
  if (!isAdmin.value) {
    ElMessage.error('只有管理员和超级管理员可以访问用户管理页面')
    router.push('/dashboard')
    return false
  }
  
  return true
}

// 初始化
onMounted(() => {
  if (checkAdminPermission()) {
    fetchRoles()
    fetchUserDetail()
  }
})
</script>

<style scoped>
.user-detail-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-card,
.side-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  padding: 10px 0;
}

.actions-content {
  padding: 20px 0;
}

.role-tag {
  margin-right: 5px;
}

.no-data {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.mt-10 {
  margin-top: 10px;
}
</style>
