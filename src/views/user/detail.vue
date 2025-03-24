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
                <el-tag v-if="userDetail.locked" type="warning" class="ml-5">
                  账户锁定
                </el-tag>
              </el-descriptions-item>
              
              <el-descriptions-item label="登录失败次数" v-if="userDetail.loginFailCount > 0">
                {{ userDetail.loginFailCount }}
              </el-descriptions-item>
              
              <el-descriptions-item label="锁定时间" v-if="userDetail.lockTime">
                {{ formatDate(userDetail.lockTime) }}
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
              <h3>用户头像</h3>
            </div>
          </template>
          
          <div class="avatar-content">
            <el-avatar 
              :size="100" 
              :src="userDetail?.avatar || defaultAvatar" 
              class="user-avatar"
            >
              {{ userDetail?.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            
            <div class="avatar-actions" v-if="userDetail">
              <div class="avatar-buttons">
                <el-button 
                  type="primary" 
                  @click="handleUpdateAvatar" 
                  :disabled="loading || avatarLoading"
                  class="mt-10"
                  size="small"
                >
                  <el-icon><Link /></el-icon>
                  使用URL更新
                </el-button>
                
                <el-upload
                  class="avatar-upload mt-10"
                  :action="null"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarFileChange"
                  accept="image/jpeg,image/png,image/gif"
                >
                  <el-button 
                    type="success" 
                    :disabled="loading || avatarLoading"
                    size="small"
                  >
                    <el-icon><Upload /></el-icon>
                    上传头像
                  </el-button>
                </el-upload>
              </div>
              
              <el-progress 
                v-if="avatarLoading" 
                :percentage="100" 
                :indeterminate="true" 
                status="exception"
                class="mt-10"
              />
            </div>
          </div>
        </el-card>
        
        <el-card class="side-card mt-20">
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
            
            <el-button 
              type="warning" 
              @click="handleUnlockAccount" 
              v-permission="'user:edit'"
              :disabled="loading || !userDetail?.locked"
              block
              class="mt-10"
            >
              <el-icon><Unlock /></el-icon>解锁账户
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
import { ArrowLeft, Edit, Key, Delete, Refresh, Grid, Upload, Link, Unlock } from '@element-plus/icons-vue'

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
const unlockLoading = ref(false)

// 头像相关
const avatarLoading = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

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

// 处理更新头像
const handleUpdateAvatar = () => {
  ElMessageBox.prompt('请输入头像 URL', '更新头像', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
    inputErrorMessage: '请输入有效的URL地址',
    inputValue: userDetail.value?.avatar || ''
  })
    .then(({ value }) => {
      if (value === userDetail.value?.avatar) {
        ElMessage.info('头像未变更')
        return
      }
      
      avatarLoading.value = true
      
      // 判断是否是当前用户
      const updatePromise = isCurrentUser.value
        ? userApi.updateCurrentUserAvatar(value) // 更新当前用户头像
        : userApi.updateUserAvatar(userDetail.value.id, value) // 更新指定用户头像
      
      updatePromise.then(response => {
        if (response.data && response.data.success) {
          ElMessage.success('头像更新成功')
          // 更新本地用户详情
          userDetail.value.avatar = value
          // 如果是当前用户，同时更新用户状态
          if (isCurrentUser.value) {
            userStore.updateUserInfo({ avatar: value })
          }
          } else {
            ElMessage.error(response.data?.message || '头像更新失败')
          }
        })
        .catch(error => {
          console.error('更新头像失败:', error)
          ElMessage.error('更新头像失败')
        })
        .finally(() => {
          avatarLoading.value = false
        })
    })
    .catch(() => {
      // 取消操作
    })
}

// 处理解锁用户账户
const handleUnlockAccount = () => {
  if (!userDetail.value || !userDetail.value.locked) {
    ElMessage.info('该用户账户未锁定')
    return
  }
  
  ElMessageBox.confirm(
    '确定要解锁该用户账户吗？解锁后用户可以立即登录。',
    '解锁账户',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      unlockLoading.value = true
      userApi.unlockUserAccount(userDetail.value.id)
        .then(response => {
          if (response.data && response.data.success) {
            ElMessage.success('账户解锁成功')
            // 更新本地用户详情
            userDetail.value.locked = false
            userDetail.value.loginFailCount = 0
            userDetail.value.lockTime = null
            // 刷新用户详情
            fetchUserDetail()
          } else {
            ElMessage.error(response.data?.message || '账户解锁失败')
          }
        })
        .catch(error => {
          console.error('解锁账户失败:', error)
          ElMessage.error('解锁账户失败')
        })
        .finally(() => {
          unlockLoading.value = false
        })
    })
    .catch(() => {
      // 取消操作
    })
}

// 处理头像文件上传
const handleAvatarFileChange = (file) => {
  if (!file) return
  
  // 文件类型验证
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片格式的文件')
    return
  }
  
  // 文件大小验证（限制2MB）
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过2MB')
    return
  }
  
  avatarLoading.value = true
  
  // 判断是否是当前用户
  const uploadPromise = isCurrentUser.value
    ? userApi.uploadCurrentUserAvatar(file.raw) // 上传当前用户头像
    : userApi.uploadUserAvatar(userDetail.value.id, file.raw) // 上传指定用户头像
  
  uploadPromise
    .then(response => {
      if (response.data && response.data.success) {
        ElMessage.success('头像上传成功')
        // 获取返回的头像 URL
        const avatarUrl = response.data.data
        // 更新本地用户详情
        userDetail.value.avatar = avatarUrl
        // 如果是当前用户，同时更新用户状态
        if (isCurrentUser.value) {
          userStore.updateUserInfo({ avatar: avatarUrl })
        }
      } else {
        ElMessage.error(response.data?.message || '头像上传失败')
      }
    })
    .catch(error => {
      console.error('上传头像失败:', error)
      ElMessage.error('上传头像失败')
    })
    .finally(() => {
      avatarLoading.value = false
    })
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

.mt-20 {
  margin-top: 20px;
}

.ml-5 {
  margin-left: 5px;
}

.avatar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.user-avatar {
  margin-bottom: 15px;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.avatar-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.avatar-upload {
  width: 100%;
}

.avatar-upload :deep(.el-upload) {
  width: 100%;
}

.avatar-upload :deep(.el-button) {
  width: 100%;
}
</style>
