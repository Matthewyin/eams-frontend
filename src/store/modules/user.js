import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    // 状态
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

    // 计算属性
    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value.username || '')
    const avatar = computed(() => userInfo.value.avatar || '')
    const roles = computed(() => userInfo.value.roles || [])

    // 判断是否有权限
    const hasPermission = (permission) => {
        if (!permission) return true
        
        // 如果用户未登录，没有权限
        if (!isLoggedIn.value) {
            return false
        }
        
        // 如果用户是超级管理员，有所有权限
        if (userInfo.value.roles && (userInfo.value.roles.includes('admin') || userInfo.value.roles.includes('administrator'))) {
            return true
        }
        
        // 检查具体权限
        return userInfo.value.permissions?.includes(permission) || userInfo.value.permissions?.includes('*') || false
    }
    
    // 检查并提示权限
    const checkAndNotifyPermission = (permission, action) => {
        if (!hasPermission(permission)) {
            ElMessage.error(`您没有${action}的权限`)
            return false
        }
        return true
    }

    // 设置Token
    const setToken = (newToken) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }
    
    // 设置用户信息
    const setUserInfo = (newUserInfo) => {
        userInfo.value = newUserInfo
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
    }

    // 登录 - 使用真实后端认证
    const login = async (loginData) => {
        try {
            // 调用真实登录API
            const response = await authApi.login(loginData)
            const data = response.data
            
            if (!data || !data.token) {
                throw new Error('登录响应缺少必要信息')
            }
            
            // 设置token
            setToken(data.token)
            
            // 如果响应中包含用户信息，则设置用户信息
            if (data.userInfo) {
                setUserInfo(data.userInfo)
            }
            
            return data
        } catch (error) {
            console.error('登录失败:', error)
            throw error
        }
    }

    // 获取用户信息 - 使用真实后端认证
    const getUserInfo = async () => {
        try {
            // 如果已有用户信息且不是空对象，直接返回
            if (Object.keys(userInfo.value).length > 0) {
                return userInfo.value
            }
            
            // 否则调用API获取用户信息
            const response = await authApi.getUserInfo()
            const data = response.data
            
            if (!data) {
                throw new Error('获取用户信息失败')
            }
            
            // 设置用户信息
            setUserInfo(data)
            
            return data
        } catch (error) {
            console.error('获取用户信息失败:', error)
            throw error
        }
    }

    // 登出
    const logout = async () => {
        try {
            // 如果有token，则调用后端API登出
            if (token.value) {
                try {
                    await authApi.logout()
                } catch (logoutError) {
                    console.error('调用登出接口失败:', logoutError)
                    // 即使调用API失败，仍然清除本地存储
                }
            }
            
            // 清除本地存储
            token.value = ''
            userInfo.value = {}
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
        } catch (error) {
            console.error('登出失败:', error)
        }
    }

    return {
        token,
        userInfo,
        isLoggedIn,
        username,
        avatar,
        roles,
        hasPermission,
        checkAndNotifyPermission,
        setToken,
        setUserInfo,
        login,
        getUserInfo,
        logout
    }
})