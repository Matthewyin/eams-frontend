import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
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
        return userInfo.value.permissions?.includes(permission) || userInfo.value.permissions?.includes('*') || false
    }

    // 登录 - 修改为不需要后端认证
    const login = async (loginData) => {
        try {
            // 模拟登录成功，不调用后端API
            const mockUserInfo = {
                id: 1,
                username: loginData.username,
                name: '管理员',
                avatar: '',
                roles: ['admin'],
                permissions: ['*']
            }

            // 模拟登录成功的token
            const mockToken = 'mock-token-' + Date.now()

            // 直接设置用户信息和token
            token.value = mockToken
            userInfo.value = mockUserInfo

            localStorage.setItem('token', mockToken)
            localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))

            return { token: mockToken }
        } catch (error) {
            console.error('登录失败:', error)
            throw error
        }
    }

    // 获取用户信息 - 修改为不需要后端认证
    const getUserInfo = async () => {
        try {
            // 如果已有用户信息，直接返回
            if (Object.keys(userInfo.value).length > 0) {
                return userInfo.value
            }

            // 否则模拟获取用户信息
            const mockUserInfo = {
                id: 1,
                username: 'admin',
                name: '管理员',
                avatar: '',
                roles: ['admin'],
                permissions: ['*']
            }

            userInfo.value = mockUserInfo
            localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))

            return mockUserInfo
        } catch (error) {
            console.error('获取用户信息失败:', error)
            throw error
        }
    }

    // 登出
    const logout = async () => {
        try {
            // 不调用后端API
            // 直接清除本地存储
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
        login,
        getUserInfo,
        logout
    }
})