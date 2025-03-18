<!-- src/views/setting/index.vue -->
<template>
  <div class="setting-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="profile">
          <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>

            <el-form-item label="姓名" prop="name">
              <el-input v-model="profileForm.name" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="updateProfile">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="password">
          <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPassword">
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

            <el-form-item>
              <el-button type="primary" @click="updatePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="主题设置" name="theme">
          <div class="theme-setting">
            <div class="setting-item">
              <span class="setting-label">主题模式</span>
              <el-switch
                  v-model="isDarkMode"
                  active-text="暗色"
                  inactive-text="亮色"
                  @change="toggleTheme"
              />
            </div>

            <div class="setting-item">
              <span class="setting-label">表格密度</span>
              <el-radio-group v-model="tableDensity" @change="setTableDensity">
                <el-radio-button :value="'large'">默认</el-radio-button>
                <el-radio-button :value="'default'">中等</el-radio-button>
                <el-radio-button :value="'small'">紧凑</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const userStore = useUserStore()

// 当前激活的标签页
const activeTab = ref('profile')

// 个人信息表单
const profileFormRef = ref(null)
const profileForm = ref({
  username: userStore.username,
  name: '管理员',
  email: 'admin@example.com',
  phone: '13800138000'
})

// 个人信息表单验证规则
const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 更新个人信息
const updateProfile = async () => {
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟更新操作
      setTimeout(() => {
        ElMessage.success('个人信息更新成功')
      }, 500)
    } else {
      return false
    }
  })
}

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 更新密码
const updatePassword = async () => {
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟更新操作
      setTimeout(() => {
        ElMessage.success('密码修改成功')
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }, 500)
    } else {
      return false
    }
  })
}

// 主题设置
const isDarkMode = computed({
  get: () => appStore.theme === 'dark',
  set: (value) => appStore.setTheme(value ? 'dark' : 'light')
})

// 切换主题
const toggleTheme = (value) => {
  appStore.setTheme(value ? 'dark' : 'light')
}

// 表格密度
const tableDensity = computed({
  get: () => appStore.tableDensity,
  set: (value) => appStore.setTableDensity(value)
})

// 设置表格密度
const setTableDensity = (value) => {
  appStore.setTableDensity(value)
}
</script>

<style scoped>
.setting-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-setting {
  padding: 20px 0;
}

.setting-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.setting-label {
  width: 100px;
  font-weight: bold;
}
</style>