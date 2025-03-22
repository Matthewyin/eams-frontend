<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="login-logo">
        <h2 class="login-title">EAMS 资产管理系统</h2>
      </div>

      <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
      >
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 登录表单
const loginFormRef = ref(null)
const loading = ref(false)
const loginForm = reactive({
  username: 'admin',
  password: 'cisco123',
  remember: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录方法 - 使用真实后端认证
const handleLogin = async () => {
  try {
    // 先验证表单
    const valid = await loginFormRef.value.validate()
    if (!valid) {
      return false
    }

    // 开始登录流程
    loading.value = true
    
    // 调用登录API
    const response = await authApi.login({
      username: loginForm.username,
      password: loginForm.password,
      remember: loginForm.remember
    })

    console.log('登录响应:', response)

    // 简化检查，只要有token就认为登录成功
    const { token, userInfo } = response.data || {}
    
    if (!token) {
      throw new Error('登录失败：未获取到认证令牌')
    }
    
    // 存储认证信息
    localStorage.setItem('token', token)
    userStore.setToken(token)

    // 存储用户信息
    if (userInfo) {
      console.log('存储用户信息:', userInfo)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      userStore.setUserInfo(userInfo)
    }

    ElMessage.success('登录成功')
    
    // 执行路由跳转
    const redirect = route.query.redirect || '/dashboard'
    console.log('准备跳转到:', redirect)
    
    // 直接跳转
    await router.push(redirect)
    
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-content {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  height: 60px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.login-form {
  margin-top: 30px;
}

.login-button {
  width: 100%;
}
</style>