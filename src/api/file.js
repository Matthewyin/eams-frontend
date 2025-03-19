import http from './http'
import {API_PATHS} from './config'

// 重试配置
const RETRY_CONFIG = {
    MAX_RETRIES: 3,          // 最大重试次数
    RETRY_DELAY: 1000,       // 初始重试延迟 (ms)
    BACKOFF_FACTOR: 1.5,     // 退避因子
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504] // 需要重试的HTTP状态码
}

// 轮询配置
const POLL_CONFIG = {
    INTERVAL: 2000,          // 轮询间隔 (ms)
    MAX_ATTEMPTS: 30,        // 最大轮询次数
    TIMEOUT: 60000           // 轮询超时时间 (ms)
}

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

    /**
     * 带自动重试的文件上传
     * @param {File} file - 要上传的文件
     * @param {Object} options - 上传选项
     * @param {Function} options.onProgress - 进度回调
     * @param {Function} options.onRetry - 重试回调
     * @returns {Promise<Object>} 上传结果
     */
    async uploadWithRetry(file, options = {}) {
        let retries = 0;
        let delay = RETRY_CONFIG.RETRY_DELAY;

        while (true) {
            try {
                return await this.uploadExcel(file, options);
            } catch (error) {
                // 判断是否需要重试
                const shouldRetry = (
                    retries < RETRY_CONFIG.MAX_RETRIES && 
                    (error.isNetworkError || 
                     RETRY_CONFIG.RETRY_STATUS_CODES.includes(error.status) ||
                     error.message?.includes('timeout'))
                );

                if (!shouldRetry) {
                    throw error;
                }

                // 增加重试次数
                retries++;
                
                // 通知重试回调
                if (options.onRetry) {
                    options.onRetry({
                        retryCount: retries,
                        maxRetries: RETRY_CONFIG.MAX_RETRIES,
                        delay,
                        error
                    });
                }

                // 等待后重试
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // 增加延迟时间（指数退避）
                delay = Math.min(delay * RETRY_CONFIG.BACKOFF_FACTOR, 10000);
            }
        }
    },

    /**
     * 轮询导入任务进度
     * @param {string} taskId - 任务ID
     * @param {Object} options - 轮询选项
     * @param {Function} options.onProgress - 进度回调
     * @param {Function} options.onComplete - 完成回调
     * @param {Function} options.onError - 错误回调
     * @returns {Promise<Object>} 最终结果
     */
    pollImportProgress(taskId, options = {}) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let attempts = 0;
            let timer = null;

            // 清理函数
            const cleanup = () => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            };

            // 轮询函数
            const poll = async () => {
                // 检查是否超过最大尝试次数或超时
                if (attempts >= POLL_CONFIG.MAX_ATTEMPTS || 
                    (Date.now() - startTime) > POLL_CONFIG.TIMEOUT) {
                    cleanup();
                    const error = new Error('导入处理超时，请稍后查看结果');
                    if (options.onError) options.onError(error);
                    reject(error);
                    return;
                }

                attempts++;

                try {
                    const result = await this.getImportProgress(taskId);
                    
                    // 调用进度回调
                    if (options.onProgress) {
                        options.onProgress(result);
                    }

                    // 检查任务是否完成
                    if (result.status === 'SUCCESS' || result.status === 'COMPLETED') {
                        cleanup();
                        if (options.onComplete) options.onComplete(result);
                        resolve(result);
                        return;
                    } else if (result.status === 'FAILED' || result.status === 'ERROR') {
                        cleanup();
                        const error = new Error(result.message || '导入失败');
                        if (options.onError) options.onError(error, result);
                        reject(error);
                        return;
                    }

                    // 继续轮询
                    timer = setTimeout(poll, POLL_CONFIG.INTERVAL);
                } catch (error) {
                    // 网络错误时继续轮询
                    if (error.isNetworkError || error.message?.includes('网络')) {
                        console.warn(`轮询网络错误 (${attempts}/${POLL_CONFIG.MAX_ATTEMPTS}):`, error.message);
                        timer = setTimeout(poll, POLL_CONFIG.INTERVAL);
                    } else {
                        cleanup();
                        if (options.onError) options.onError(error);
                        reject(error);
                    }
                }
            };

            // 开始轮询
            poll();

            // 返回取消函数
            return cleanup;
        });
    }
}