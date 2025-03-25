/**
 * 用户组管理API
 */
import http from './http'

// API路径
const API_PATHS = {
  GROUPS: '/api/groups',
  GROUP_DETAIL: '/api/groups/',
  GROUP_USERS: '/api/groups/'
}

export const groupApi = {
  /**
   * 获取用户组列表（分页）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getGroups(params) {
    return http.get(API_PATHS.GROUPS, { params })
  },
  
  /**
   * 获取所有用户组（不分页）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getAllGroups(params) {
    return http.get(`${API_PATHS.GROUPS}/all`, { params })
  },
  
  /**
   * 获取用户组详情
   * @param {number|string} id - 用户组ID
   * @returns {Promise}
   */
  getGroup(id) {
    return http.get(`${API_PATHS.GROUP_DETAIL}${id}`)
  },
  
  /**
   * 创建用户组
   * @param {Object} data - 用户组数据
   * @returns {Promise}
   */
  createGroup(data) {
    return http.post(API_PATHS.GROUPS, data)
  },
  
  /**
   * 更新用户组
   * @param {number|string} id - 用户组ID
   * @param {Object} data - 用户组数据
   * @returns {Promise}
   */
  updateGroup(id, data) {
    return http.put(`${API_PATHS.GROUP_DETAIL}${id}`, data)
  },
  
  /**
   * 删除用户组
   * @param {number|string} id - 用户组ID
   * @returns {Promise}
   */
  deleteGroup(id) {
    return http.delete(`${API_PATHS.GROUP_DETAIL}${id}`)
  },
  
  /**
   * 获取用户组用户
   * @param {number|string} id - 用户组ID
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getGroupUsers(id, params) {
    return http.get(`${API_PATHS.GROUP_USERS}${id}/users`, { params })
  },
  
  /**
   * 添加用户到用户组
   * @param {number|string} id - 用户组ID
   * @param {Object} data - 包含用户ID数组的对象 {userIds: []}
   * @returns {Promise}
   */
  addUsersToGroup(id, data) {
    return http.post(`${API_PATHS.GROUP_USERS}${id}/users`, data)
  },
  
  /**
   * 从用户组移除用户
   * @param {number|string} id - 用户组ID
   * @param {Object} data - 包含用户ID数组的对象 {userIds: []}
   * @returns {Promise}
   */
  removeUsersFromGroup(id, data) {
    return http.delete(`${API_PATHS.GROUP_USERS}${id}/users`, { data })
  }
}
