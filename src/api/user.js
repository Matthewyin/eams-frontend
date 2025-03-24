/**
 * 用户管理API
 */
import http from './http'

// API路径
const API_PATHS = {
  USERS: '/api/users',
  USER_DETAIL: '/api/users/',
  USER_PROFILE: '/api/users/profile',
  CHANGE_PASSWORD: '/api/users/change-password',
  USER_AVATAR: '/api/users/',
  CURRENT_USER_AVATAR: '/api/users/profile/avatar',
  CURRENT_USER_AVATAR_UPLOAD: '/api/users/profile/avatar/upload',
  USER_AVATAR_UPLOAD: '/api/users/',
  USER_UNLOCK: '/api/users/',
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
  },
  
  /**
   * 更新当前用户信息
   * @param {Object} data - 用户个人信息数据（realName, email, phone）
   * @returns {Promise}
   */
  updateProfile(data) {
    return http.put(API_PATHS.USER_PROFILE, data)
  },
  
  /**
   * 修改当前用户密码
   * @param {Object} data - 密码数据（oldPassword, newPassword, confirmPassword）
   * @returns {Promise}
   */
  changePassword(data) {
    return http.post(API_PATHS.CHANGE_PASSWORD, data)
  },
  
  /**
   * 更新用户头像
   * @param {number} userId - 用户ID
   * @param {string} avatarUrl - 头像地址
   * @returns {Promise}
   */
  updateUserAvatar(userId, avatarUrl) {
    return http.put(`${API_PATHS.USER_DETAIL}${userId}/avatar`, { avatarUrl })
  },
  
  /**
   * 更新当前用户头像
   * @param {string} avatarUrl - 头像地址
   * @returns {Promise}
   */
  updateCurrentUserAvatar(avatarUrl) {
    return http.put(API_PATHS.CURRENT_USER_AVATAR, { avatarUrl })
  },
  
  /**
   * 上传当前用户头像文件
   * @param {File} file - 头像文件
   * @returns {Promise}
   */
  uploadCurrentUserAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(API_PATHS.CURRENT_USER_AVATAR_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  /**
   * 上传用户头像文件
   * @param {number} userId - 用户ID
   * @param {File} file - 头像文件
   * @returns {Promise}
   */
  uploadUserAvatar(userId, file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(`${API_PATHS.USER_AVATAR_UPLOAD}${userId}/avatar/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  /**
   * 解锁用户账户
   * @param {number} userId - 用户ID
   * @returns {Promise}
   */
  unlockUserAccount(userId) {
    return http.post(`${API_PATHS.USER_UNLOCK}${userId}/unlock`)
  }
}
