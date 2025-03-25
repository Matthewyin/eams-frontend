/**
 * 权限管理API
 */
import http from './http'
import { API_PATHS } from './config'

export const permissionApi = {
  /**
   * 获取所有权限
   * @returns {Promise}
   */
  getAllPermissions() {
    return http.get(API_PATHS.PERMISSION.LIST)
  },
  
  /**
   * 获取权限树
   * @returns {Promise}
   */
  getPermissionTree() {
    return http.get(API_PATHS.PERMISSION.TREE)
  },
  
  /**
   * 获取权限详情
   * @param {number|string} id - 权限ID
   * @returns {Promise}
   */
  getPermission(id) {
    return http.get(`${API_PATHS.PERMISSION.DETAIL}${id}`)
  },
  
  /**
   * 创建权限
   * @param {Object} data - 权限数据
   * @returns {Promise}
   */
  createPermission(data) {
    return http.post(API_PATHS.PERMISSION.LIST, data)
  },
  
  /**
   * 更新权限
   * @param {number|string} id - 权限ID
   * @param {Object} data - 权限数据
   * @returns {Promise}
   */
  updatePermission(id, data) {
    return http.put(`${API_PATHS.PERMISSION.DETAIL}${id}`, data)
  },
  
  /**
   * 删除权限
   * @param {number|string} id - 权限ID
   * @returns {Promise}
   */
  deletePermission(id) {
    return http.delete(`${API_PATHS.PERMISSION.DETAIL}${id}`)
  },
  
  /**
   * 获取角色权限
   * @param {number|string} roleId - 角色ID
   * @returns {Promise}
   */
  getRolePermissions(roleId) {
    return http.get(`${API_PATHS.PERMISSION.ROLE}${roleId}`)
  },
  
  /**
   * 获取用户权限
   * @param {number|string} userId - 用户ID
   * @returns {Promise}
   */
  getUserPermissions(userId) {
    return http.get(`${API_PATHS.PERMISSION.USER}${userId}`)
  },
  
  /**
   * 获取用户权限编码
   * @param {number|string} userId - 用户ID
   * @returns {Promise}
   */
  getUserPermissionCodes(userId) {
    return http.get(`${API_PATHS.PERMISSION.USER}${userId}/codes`)
  },
  
  /**
   * 获取用户菜单
   * @param {number|string} userId - 用户ID
   * @returns {Promise}
   */
  getUserMenus(userId) {
    return http.get(`${API_PATHS.PERMISSION.USER}${userId}/menus`)
  }
} 