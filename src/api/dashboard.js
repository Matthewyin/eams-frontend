import http from './http'
import { API_PATHS } from './config'

export const dashboardApi = {
    // 获取概览数据
    getOverview() {
        return http.get(API_PATHS.DASHBOARD.OVERVIEW)
    },

    // 获取趋势数据
    getTrend(params) {
        return http.get(API_PATHS.DASHBOARD.TREND, { params })
    },

    // 获取分布数据
    getDistribution(params) {
        return http.get(API_PATHS.DASHBOARD.DISTRIBUTION, { params })
    }
}