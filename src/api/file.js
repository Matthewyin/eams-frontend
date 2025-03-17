import http from './http'
import {API_PATHS} from './config'

export const fileApi = {
    // 上传Excel文件
    uploadExcel(file, options = {}) {
        const formData = new FormData()
        formData.append('file', file)

        return http.post(API_PATHS.IMPORT.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                if (options.onProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    options.onProgress(percentCompleted)
                }
            }
        })
    },

    // 获取导入进度
    getImportProgress(taskId) {
        return http.get(`${API_PATHS.IMPORT.PROGRESS}/${taskId}`)
    },

    // 获取导入结果
    getImportResult(batchId) {
        return http.get(`${API_PATHS.IMPORT.RESULT}/${batchId}`)
    },

    // 导出Excel
    exportExcel(params) {
        return http.get(API_PATHS.EXPORT.EXCEL, {
            params,
            responseType: 'blob'
        })
    },


    // 获取导入历史记录
    getImportHistory(params) {
        return http.get('/api/import/history', {params})
    },

    // 删除导入历史记录
    deleteImportHistory(id) {
        return http.delete(`/api/import/history/${id}`)
    },
}