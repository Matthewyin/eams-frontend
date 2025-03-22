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
        console.log('设置新token:', newToken ? '已设置' : '未设置')
        token.value = newToken
        localStorage.setItem('token', newToken)
    }
    
    // 设置用户信息
    const setUserInfo = (newUserInfo) => {
        console.log('设置新用户信息:', newUserInfo)
        userInfo.value = newUserInfo
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
    }

    // 登录 - 根据接口文档实现
    const login = async (loginData) => {
        console.log('开始登录流程...')
        try {
            // 调用登录API
            const response = await authApi.login(loginData)
            console.log('登录API响应:', response)
            
            // 根据接口文档检查响应格式
            if (response.code !== 200 || !response.data || !response.data.token) {
                throw new Error(response.message || '登录响应缺少必要信息')
            }
            
            const { token, expires, userInfo } = response.data
            
            // 先清除旧的登录状态
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            
            // 设置新的token和用户信息
            setToken(token)
            if (userInfo) {
                console.log('登录响应包含用户信息，设置用户信息')
                setUserInfo(userInfo)
            } else {
                console.log('登录响应不包含用户信息，尝试获取用户信息')
                // 如果登录响应中没有用户信息，立即获取用户信息
                try {
                    const userInfoResponse = await authApi.getUserInfo()
                    if (userInfoResponse.data) {
                        setUserInfo(userInfoResponse.data)
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error)
                    throw new Error('登录成功但获取用户信息失败')
                }
            }
            
            return response.data
        } catch (error) {
            console.error('登录失败，详细错误:', error)
            // 确保清除任何可能的部分登录状态
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            token.value = ''
            userInfo.value = {}
            throw error
        }
    }

    // 获取用户信息 - 使用真实后端认证
    const getUserInfo = async () => {
        console.log('开始获取用户信息...')
        try {
            // 如果已有用户信息且不是空对象，直接返回
            if (Object.keys(userInfo.value).length > 0) {
                console.log('已有用户信息，直接返回:', userInfo.value)
                return userInfo.value
            }
            
            // 否则调用API获取用户信息
            console.log('调用API获取用户信息...')
            const response = await authApi.getUserInfo()
            const data = response.data
            console.log('获取用户信息API响应:', data)
            
            if (!data) {
                throw new Error('获取用户信息失败')
            }
            
            // 设置用户信息
            setUserInfo(data)
            
            return data
        } catch (error) {
            console.error('获取用户信息失败，详细错误:', error)
            throw error
        }
    }

    // 登出
    const logout = async () => {
        console.log('开始登出流程...')
        try {
            // 如果有token，则调用后端API登出
            if (token.value) {
                try {
                    await authApi.logout()
                    console.log('后端登出成功')
                } catch (logoutError) {
                    console.error('调用登出接口失败:', logoutError)
                    // 即使调用API失败，仍然清除本地存储
                }
            }
            
            // 清除本地存储
            console.log('清除本地存储的用户信息和token')
            token.value = ''
            userInfo.value = {}
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
        } catch (error) {
            console.error('登出失败，详细错误:', error)
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