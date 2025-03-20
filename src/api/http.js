/**
 * HTTP请求工具
 * 封装axios，统一处理请求和响应
 */

import axios from 'axios'
import { BASE_URL, TIMEOUT, ERROR_MESSAGES } from './config'
import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

// 创建axios实例
const http = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
http.interceptors.request.use(
    config => {
        console.log('发起请求:', config.url)
        // 这里可以添加token等认证信息
        const token = localStorage.getItem('token')
        if (token) {
            console.log('请求携带认证token')
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.log('请求未携带token')
        }
        return config
    },
    error => {
        console.error('请求发送失败:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    response => {
        console.log('请求成功:', response.config.url)
        console.log('响应数据:', response.data)
        // 检查响应数据格式
        const data = response.data
        
        // 如果响应数据中有错误信息，显示错误提示
        if (data && data.code && data.code !== 200 && data.message) {
            ElMessage.error(data.message)
        }
        
        return data
    },
    error => {
        console.error('请求失败:', error.config?.url)
        console.error('错误详情:', error.response?.data || error.message)
        
        // 处理401错误（未认证）
        if (error.response?.status === 401) {
            console.log('检测到401错误，准备登出...')
            const userStore = useUserStore()
            userStore.logout()
            router.push('/login')
        }
        
        let message = ERROR_MESSAGES.SERVER_ERROR
        let isAuthError = false
        let shouldReturnMockData = false
        
        // 检查请求URL是否与认证相关
        const isAuthRequest = error.config && (
            error.config.url.includes('/api/auth/') ||
            error.config.url.includes('/api/users/')
        )

        // 检查是否存在网络连接问题
        if (error.message && error.message.includes('Network Error')) {
            message = '网络连接失败，请检查您的网络连接'
            console.warn('后端服务未启动或不可访问')
            
            // 如果是认证请求，不返回模拟数据
            shouldReturnMockData = !isAuthRequest
        } else if (error.response) {
            // 服务器返回错误状态码
            switch (error.response.status) {
                case 400:
                    message = error.response.data?.message || '请求参数错误'
                    break
                case 403:
                    message = ERROR_MESSAGES.FORBIDDEN
                    break
                case 404:
                    message = '请求的资源不存在，请检查API路径是否正确'
                    break
                case 500:
                    message = error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR
                    break
                default:
                    message = error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR
            }
            
            // 如果是认证请求，不返回模拟数据
            shouldReturnMockData = !isAuthRequest
        } else if (error.request) {
            // 请求发出但没有收到响应
            message = '服务器未响应，请稍后再试'
            console.warn('服务器未响应')
            
            // 如果是认证请求，不返回模拟数据
            shouldReturnMockData = !isAuthRequest
        } else if (error.code === 'ECONNABORTED') {
            // 请求超时
            message = ERROR_MESSAGES.TIMEOUT_ERROR
            
            // 如果是认证请求，不返回模拟数据
            shouldReturnMockData = !isAuthRequest
        }

        // 显示错误提示，除非是401错误（已经在上面处理了）
        if (!isAuthError) {
            ElMessage.error(message)
        }
        
        console.error('请求错误:', message, '\n错误详情:', error)
        
        // 如果应该返回模拟数据，则返回模拟数据
        if (shouldReturnMockData) {
            return Promise.resolve({
                code: 200,
                data: [],
                message: 'success',
                success: true
            })
        }
        
        // 否则返回错误
        return Promise.reject(error)
    }
)

// 使用默认导出
export default http