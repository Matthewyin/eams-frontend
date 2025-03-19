import http from './http'
import { API_PATHS } from './config'

export const logApi = {
  /**
   * 获取操作日志列表
   * @param {Object} params 查询参数
   * @returns {Promise} 返回Promise对象
   */
  getLogs(params) {
    return http({
      url: API_PATHS.LOG.LIST,
      method: 'get',
      params
    })
  },

  /**
   * 获取操作日志详情
   * @param {String} id 日志ID
   * @returns {Promise} 返回Promise对象
   */
  getLogById(id) {
    return http({
      url: `${API_PATHS.LOG.DETAIL}${id}`,
      method: 'get'
    })
  },

  /**
   * 导出操作日志
   * @param {Object} params 查询参数
   * @returns {Promise} 返回Promise对象
   */
  exportLogs(params) {
    return http({
      url: API_PATHS.LOG.EXPORT,
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },

  /**
   * 获取操作日志统计数据
   * @param {Object} params 查询参数
   * @returns {Promise} 返回Promise对象
   */
  getLogStats(params) {
    return http({
      url: API_PATHS.LOG.STATS,
      method: 'get',
      params
    })
  }
}
