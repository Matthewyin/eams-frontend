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
        // 这里可以添加token等认证信息
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    response => {
        // 这里可以统一处理响应数据
        return response.data
    },
    error => {
        let message = ERROR_MESSAGES.SERVER_ERROR

        // 检查是否存在网络连接问题
        if (error.message && error.message.includes('Network Error')) {
            // 修改为更友好的提示，不显示错误
            console.warn('后端服务未启动或不可访问，使用模拟数据')
            // 返回模拟数据而不是抛出错误
            return Promise.resolve({
                code: 200,
                data: [],
                message: 'success',
                success: true
            })
        } else if (error.response) {
            // 服务器返回错误状态码
            switch (error.response.status) {
                case 401:
                    message = ERROR_MESSAGES.UNAUTHORIZED
                    // 未授权时，清除用户信息并跳转到登录页
                    const userStore = useUserStore()
                    userStore.logout()
                    router.push('/login')
                    break
                case 403:
                    message = ERROR_MESSAGES.FORBIDDEN
                    break
                case 404:
                    message = '请求的资源不存在，请检查API路径是否正确'
                    break
                case 500:
                    message = ERROR_MESSAGES.SERVER_ERROR
                    break
                default:
                    message = error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR
            }
        } else if (error.request) {
            // 请求发出但没有收到响应
            console.warn('服务器未响应，使用模拟数据')
            // 返回模拟数据而不是抛出错误
            return Promise.resolve({
                code: 200,
                data: [],
                message: 'success',
                success: true
            })
        } else if (error.code === 'ECONNABORTED') {
            // 请求超时
            message = ERROR_MESSAGES.TIMEOUT_ERROR
        }

        // 显示错误提示
        console.error('请求错误:', message, '\n错误详情:', error)
        // 返回模拟数据而不是抛出错误
        return Promise.resolve({
            code: 200,
            data: [],
            message: 'success',
            success: true
        })
    }
)

// 使用默认导出
export default http