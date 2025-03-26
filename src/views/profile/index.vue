<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人信息</h2>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="profile-card" v-loading="loading">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
              <el-button type="primary" @click="handleEdit" v-if="!isEditing">
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </el-button>
              <div v-else>
                <el-button type="primary" @click="handleSave" :loading="saving">
                  <el-icon><Check /></el-icon>
                  <span>保存</span>
                </el-button>
                <el-button @click="handleCancel">
                  <el-icon><Close /></el-icon>
                  <span>取消</span>
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="profile-content">
            <el-form 
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="100px"
              :disabled="!isEditing"
            >
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="部门">
                <el-input v-model="userInfo.departmentName" disabled />
              </el-form-item>
              
              <el-form-item label="用户组" v-if="userInfo.groupNames && userInfo.groupNames.length">
                <el-tag 
                  v-for="(group, index) in userInfo.groupNames" 
                  :key="index"
                  class="group-tag"
                >
                  {{ group }}
                </el-tag>
              </el-form-item>
              
              <el-form-item label="创建时间" v-if="userInfo.createdTime">
                <span>{{ formatDate(userInfo.createdTime) }}</span>
              </el-form-item>
              
              <el-form-item label="更新时间" v-if="userInfo.updatedTime">
                <span>{{ formatDate(userInfo.updatedTime) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="security-card">
          <template #header>
            <div class="card-header">
              <h3>账户安全</h3>
            </div>
          </template>
          
          <div class="security-content">
            <div class="security-item">
              <div class="security-info">
                <h4>登录密码</h4>
                <p>定期修改密码可以保护账号安全</p>
              </div>
              <el-button @click="handleChangePassword">修改</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        :disabled="changingPassword"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitPasswordForm" 
            :loading="changingPassword"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils/format'
import { Edit, Check, Close } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

// 获取路由对象
const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const isEditing = ref(false)
const passwordDialogVisible = ref(false)

// 用户信息
const userInfo = ref({})
const form = ref({
  realName: '',
  email: '',
  phone: ''
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单引用
const formRef = ref(null)
const passwordFormRef = ref(null)

// 验证规则
const rules = {
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { max: 100, message: '邮箱长度不能超过100个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 密码验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
    { max: 20, message: '密码长度不能超过20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 获取用户状态
const userStore = useUserStore()

// 获取当前用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    // 使用已登录用户的信息
    userInfo.value = userStore.userInfo
    
    // 初始化表单数据
    form.value = {
      realName: userInfo.value.realName || '',
      email: userInfo.value.email || '',
      phone: userInfo.value.phone || ''
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 编辑个人信息
const handleEdit = () => {
  isEditing.value = true
}

// 取消编辑
const handleCancel = () => {
  // 重置表单
  form.value = {
    realName: userInfo.value.realName || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  }
  isEditing.value = false
}

// 保存个人信息
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    saving.value = true
    try {
      const response = await userApi.updateProfile(form.value)
      
      if (response.data && response.data.success) {
        ElMessage.success('个人信息更新成功')
        
        // 更新本地用户信息
        userInfo.value = response.data.data
        
        // 更新用户状态中的用户信息
        userStore.updateUserInfo(response.data.data)
        
        isEditing.value = false
      } else {
        ElMessage.error(response.data?.message || '个人信息更新失败')
      }
    } catch (error) {
      console.error('更新个人信息失败:', error)
      ElMessage.error('更新个人信息失败')
    } finally {
      saving.value = false
    }
  })
}

// 打开修改密码对话框
const handleChangePassword = () => {
  passwordDialogVisible.value = true
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 提交密码修改
const submitPasswordForm = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    changingPassword.value = true
    try {
      // 调用修改密码API
      const response = await userApi.changePassword(passwordForm.value)
      
      if (response.data && response.data.success) {
        ElMessage.success('密码修改成功')
        // 关闭对话框
        passwordDialogVisible.value = false
        // 重置表单
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        // 检查是否是强制修改密码场景
        if (route.query.forceChange === 'true') {
          ElMessage.success('初始密码修改成功，请使用新密码登录系统')
          // 如果是从首次登录跳转过来的，修改密码成功后跳转到首页
          router.push('/dashboard')
        }
      } else {
        ElMessage.error(response.data?.message || '密码修改失败')
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      // 如果密码错误次数过多，可能会导致账户锁定
      if (error.response && error.response.data) {
        ElMessage.error(error.response.data.message || '修改密码失败')
        
        // 检查是否账户锁定
        if (error.response.data.code === 'USER_LOCKED') {
          ElMessage.warning('账户已被锁定，请稍后再试或联系管理员')
        }
      } else {
        ElMessage.error('修改密码失败')
      }
    } finally {
      changingPassword.value = false
    }
  })
}

// 初始化
onMounted(() => {
  fetchUserInfo()
  
  // 检查URL参数，如果存在forceChange=true参数，则自动打开修改密码对话框
  if (route.query.forceChange === 'true') {
    // 显示强制修改密码对话框
    ElMessageBox.alert(
      '为了保护您的账户安全，请修改初始密码。',
      '首次登录安全提示',
      {
        confirmButtonText: '确定',
        type: 'warning',
        callback: () => {
          // 自动打开修改密码对话框
          handleChangePassword()
          
          // 移除URL参数但不刷新页面
          router.replace({ path: '/profile' })
        }
      }
    )
  }
})
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-card,
.security-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.profile-content,
.security-content {
  padding: 10px 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
}

.security-info p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.group-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
