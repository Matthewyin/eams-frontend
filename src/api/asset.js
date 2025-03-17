import http from './http'
import { API_PATHS } from './config'

export const assetApi = {
    // 获取资产列表
    getAssets(params) {
        return http.get(API_PATHS.ASSET.LIST, { params })
    },

    // 获取资产详情
    getAssetById(id) {
        return http.get(`${API_PATHS.ASSET.DETAIL}${id}`)
    },

    // 创建资产
    createAsset(data) {
        return http.post(API_PATHS.ASSET.LIST, data)
    },

    // 更新资产
    updateAsset(id, data) {
        return http.put(`${API_PATHS.ASSET.DETAIL}${id}`, data)
    },

    // 删除资产
    deleteAsset(id) {
        return http.delete(`${API_PATHS.ASSET.DETAIL}${id}`)
    },

    // 批量删除资产
    batchDeleteAssets(ids) {
        return http.delete(API_PATHS.ASSET.LIST, { data: { ids } })
    },

    // 获取资产分类
    getCategories() {
        return http.get(API_PATHS.ASSET.CATEGORIES)
    },

    // 获取部门列表
    getDepartments() {
        return http.get(API_PATHS.ASSET.DEPARTMENTS)
    }
}