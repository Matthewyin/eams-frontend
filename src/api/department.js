/**
 * 部门管理API
 */
import http from './http'

// API路径
const API_PATHS = {
  DEPARTMENTS: '/api/departments',
  DEPARTMENT_DETAIL: '/api/departments/',
  DEPARTMENT_TREE: '/api/departments/tree',
  DEPARTMENT_USERS: '/api/departments/',
  ASSIGN_USERS: '/api/departments/'
}

export const departmentApi = {
  /**
   * 获取部门列表（分页）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getDepartments(params) {
    return http.get(API_PATHS.DEPARTMENTS, { params })
  },
  
  /**
   * 获取所有部门（不分页）
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getAllDepartments(params) {
    return http.get(`${API_PATHS.DEPARTMENTS}/all`, { params })
  },
  
  /**
   * 获取部门详情
   * @param {number|string} id - 部门ID
   * @returns {Promise}
   */
  getDepartment(id) {
    return http.get(`${API_PATHS.DEPARTMENT_DETAIL}${id}`)
  },
  
  /**
   * 创建部门
   * @param {Object} data - 部门数据
   * @returns {Promise}
   */
  createDepartment(data) {
    return http.post(API_PATHS.DEPARTMENTS, data)
  },
  
  /**
   * 更新部门
   * @param {number|string} id - 部门ID
   * @param {Object} data - 部门数据
   * @returns {Promise}
   */
  updateDepartment(id, data) {
    return http.put(`${API_PATHS.DEPARTMENT_DETAIL}${id}`, data)
  },
  
  /**
   * 删除部门
   * @param {number|string} id - 部门ID
   * @returns {Promise}
   */
  deleteDepartment(id) {
    return http.delete(`${API_PATHS.DEPARTMENT_DETAIL}${id}`)
  },
  
  /**
   * 获取部门树
   * @returns {Promise}
   */
  getDepartmentTree() {
    return http.get(API_PATHS.DEPARTMENT_TREE)
  },
  
  /**
   * 获取部门用户
   * @param {number|string} id - 部门ID
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getDepartmentUsers(id, params) {
    return http.get(`${API_PATHS.DEPARTMENT_USERS}${id}/users`, { params })
  },
  
  /**
   * 分配用户到部门
   * @param {number|string} id - 部门ID
   * @param {Object} data - 包含用户ID数组的对象 {userIds: []}
   * @returns {Promise}
   */
  assignUsersToDepartment(id, data) {
    return http.post(`${API_PATHS.ASSIGN_USERS}${id}/users/assign`, data)
  },
  
  /**
   * 从部门移除用户
   * @param {number|string} id - 部门ID
   * @param {Object} data - 包含用户ID数组的对象 {userIds: []}
   * @returns {Promise}
   */
  removeUsersFromDepartment(id, data) {
    return http.post(`${API_PATHS.ASSIGN_USERS}${id}/users/remove`, data)
  }
}
