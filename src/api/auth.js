import http from './http'
import { API_PATHS } from './config'

export const authApi = {
    // 用户登录
    login(data) {
        // 确保只传入用户名和密码，符合接口文档要求
        const loginData = {
            username: data.username,
            password: data.password
        }
        return http.post(API_PATHS.AUTH.LOGIN, loginData)
    },

    // 用户登出
    logout() {
        return http.post(API_PATHS.AUTH.LOGOUT)
    },

    // 获取当前用户信息
    getUserInfo() {
        return http.get(API_PATHS.AUTH.USER_INFO)
    }
}