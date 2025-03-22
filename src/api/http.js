/**
 * HTTP请求工具
 * 封装axios，统一处理请求和响应
 */

import axios from 'axios'
import { BASE_URL, TIMEOUT, ERROR_MESSAGES, STATUS_CODES } from './config'
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
        // 从localStorage获取token
        const token = localStorage.getItem('token')
        if (token) {
            console.log('请求携带认证token')
            // 根据接口文档中的认证方式添加token
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
        
        // 检查是否返回了HTML页面（可能是认证失败或会话过期）
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('text/html') || 
            (typeof response.data === 'string' && response.data.includes('<html'))) {
            console.error('接收到HTML响应而非预期的JSON数据');
            
            // 如果包含登录相关内容，可能是认证失败
            if (typeof response.data === 'string' && 
                (response.data.includes('login') || response.data.includes('sign in'))) {
                const userStore = useUserStore();
                userStore.logout();
                router.push('/login');
                return Promise.reject(new Error('认证失败，请重新登录'));
            }
            
            // 返回原始HTML以供上层处理
            return response.data;
        }
        
        console.log('响应数据:', response.data)
        
        // 检查响应数据格式
        const data = response.data
        
        // 如果响应数据中有错误信息，显示错误提示
        if (data && data.code && data.code !== STATUS_CODES.SUCCESS && data.message) {
            ElMessage.error(data.message)
            // 对不同错误码进行额外处理
            if (data.code === STATUS_CODES.UNAUTHORIZED) {
                const userStore = useUserStore()
                userStore.logout()
                router.push('/login')
            }
        }
        
        return data
    },
    error => {
        console.error('请求失败:', error.config?.url)
        console.error('错误详情:', error.response?.data || error.message)
        
        let message = ERROR_MESSAGES.SERVER_ERROR
        
        // 处理不同类型的错误
        if (error.response) {
            // 处理HTTP状态码错误
            switch (error.response.status) {
                case STATUS_CODES.UNAUTHORIZED:
                    message = ERROR_MESSAGES.UNAUTHORIZED
                    // 未授权时，清除token并跳转到登录页
                    const userStore = useUserStore()
                    userStore.logout()
                    router.push('/login')
                    break
                    
                case STATUS_CODES.FORBIDDEN:
                    message = ERROR_MESSAGES.FORBIDDEN
                    break
                    
                case STATUS_CODES.NOT_FOUND:
                    message = '请求的资源不存在，请检查API路径是否正确'
                    break
                    
                case STATUS_CODES.SERVER_ERROR:
                    message = error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR
                    break
                    
                default:
                    // 如果错误响应中有详细信息，优先使用
                    if (error.response.data && error.response.data.message) {
                        message = error.response.data.message
                    } else if (error.response.data && error.response.data.errors) {
                        // 处理字段验证错误
                        const errors = error.response.data.errors
                        if (Array.isArray(errors) && errors.length > 0) {
                            message = errors.map(e => e.message || e.field).join('; ')
                        }
                    }
            }
        } else if (error.request) {
            // 请求发出但没有收到响应
            message = '服务器未响应，请稍后再试'
        } else if (error.code === 'ECONNABORTED') {
            // 请求超时
            message = ERROR_MESSAGES.TIMEOUT_ERROR
        } else if (error.message && error.message.includes('Network Error')) {
            message = ERROR_MESSAGES.NETWORK_ERROR
        }
        
        // 显示错误提示
        ElMessage.error(message)
        console.error('请求错误:', message)
        
        return Promise.reject(error)
    }
)

// 使用默认导出
export default http