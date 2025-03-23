/**
 * 用户管理API
 */
import http from './http'

// API路径
const API_PATHS = {
  USERS: '/api/users',
  USER_DETAIL: '/api/users/',
  ROLES: '/api/roles/all'
}

export const userApi = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getUsers(params) {
    return http.get(API_PATHS.USERS, { params })
  },
  
  /**
   * 获取用户详情
   * @param {number|string} id - 用户ID
   * @returns {Promise}
   */
  getUser(id) {
    return http.get(`${API_PATHS.USER_DETAIL}${id}`)
  },
  
  /**
   * 创建用户
   * @param {Object} data - 用户数据
   * @returns {Promise}
   */
  createUser(data) {
    return http.post(API_PATHS.USERS, data)
  },
  
  /**
   * 更新用户
   * @param {number|string} id - 用户ID
   * @param {Object} data - 用户数据
   * @returns {Promise}
   */
  updateUser(id, data) {
    return http.put(`${API_PATHS.USER_DETAIL}${id}`, data)
  },
  
  /**
   * 删除用户
   * @param {number|string} id - 用户ID
   * @returns {Promise}
   */
  deleteUser(id) {
    return http.delete(`${API_PATHS.USER_DETAIL}${id}`)
  },
  
  /**
   * 重置用户密码
   * @param {number|string} id - 用户ID
   * @returns {Promise}
   */
  resetPassword(id) {
    return http.post(`${API_PATHS.USER_DETAIL}reset-password/${id}`)
  },
  
  /**
   * 获取所有角色列表
   * @returns {Promise}
   */
  getRoles() {
    return http.get(API_PATHS.ROLES)
  }
}
