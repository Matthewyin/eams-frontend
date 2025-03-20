/**
 * 角色管理API
 */
import http from './http'
import { API_PATHS } from './config'

export const roleApi = {
  /**
   * 获取角色列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getRoles(params) {
    return http.get(API_PATHS.ROLE.LIST, { params })
  },
  
  /**
   * 获取所有角色（不分页）
   * @returns {Promise}
   */
  getAllRoles() {
    return http.get(API_PATHS.ROLE.ALL)
  },
  
  /**
   * 获取除超级管理员外的所有角色
   * @returns {Promise}
   */
  getAllRolesExceptSuperAdmin() {
    return http.get(API_PATHS.ROLE.ALL + '/except-superadmin')
  },
  
  /**
   * 获取角色详情
   * @param {number|string} id - 角色ID
   * @returns {Promise}
   */
  getRole(id) {
    return http.get(`${API_PATHS.ROLE.DETAIL}${id}`)
  },
  
  /**
   * 创建角色
   * @param {Object} data - 角色数据
   * @returns {Promise}
   */
  createRole(data) {
    return http.post(API_PATHS.ROLE.LIST, data)
  },
  
  /**
   * 更新角色
   * @param {number|string} id - 角色ID
   * @param {Object} data - 角色数据
   * @returns {Promise}
   */
  updateRole(id, data) {
    return http.put(`${API_PATHS.ROLE.DETAIL}${id}`, data)
  },
  
  /**
   * 删除角色
   * @param {number|string} id - 角色ID
   * @returns {Promise}
   */
  deleteRole(id) {
    return http.delete(`${API_PATHS.ROLE.DETAIL}${id}`)
  },
  
  /**
   * 获取角色权限
   * @param {number|string} id - 角色ID
   * @returns {Promise}
   */
  getRolePermissions(id) {
    return http.get(`${API_PATHS.ROLE.DETAIL}${id}/permissions`)
  },
  
  /**
   * 分配角色权限
   * @param {number|string} id - 角色ID
   * @param {Array} permissionIds - 权限ID列表
   * @returns {Promise}
   */
  assignRolePermissions(id, permissionIds) {
    return http.post(`${API_PATHS.ROLE.DETAIL}${id}/permissions`, permissionIds)
  },
  
  /**
   * 获取用户角色
   * @param {number|string} userId - 用户ID
   * @returns {Promise}
   */
  getUserRoles(userId) {
    return http.get(`${API_PATHS.ROLE.LIST}/user/${userId}`)
  },
  
  /**
   * 分配用户角色
   * @param {number|string} userId - 用户ID
   * @param {Array} roleIds - 角色ID列表
   * @returns {Promise}
   */
  assignUserRoles(userId, roleIds) {
    return http.post(`${API_PATHS.ROLE.LIST}/user/${userId}`, roleIds)
  }
} 