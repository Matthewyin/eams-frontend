/**
 * API配置文件
 * 集中管理API的基础配置，包括基础URL等
 */

// API基础URL
// 当使用Vite代理时，基础URL应为空或相对路径
export const BASE_URL = ''

// API请求超时时间（毫秒）
export const TIMEOUT = 30000

// API路径
export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        USER_INFO: '/api/auth/user'
    },
    USER: {
        LIST: '/api/users',
        DETAIL: '/api/users/',
        RESET_PASSWORD: '/api/users/reset-password/',
        ROLES: '/api/users/roles'
    },
    ROLE: {
        LIST: '/api/roles',
        ALL: '/api/roles/all',
        DETAIL: '/api/roles/'
    },
    PERMISSION: {
        LIST: '/api/permissions',
        TREE: '/api/permissions/tree',
        DETAIL: '/api/permissions/',
        ROLE: '/api/permissions/role/',
        USER: '/api/permissions/user/'
    },
    ASSET: {
        LIST: '/api/assets',
        DETAIL: '/api/assets/',
        CATEGORIES: '/api/assets/categories',
        DEPARTMENTS: '/api/departments'
    },
    DASHBOARD: {
        OVERVIEW: '/api/dashboard/overview',
        TREND: '/api/dashboard/trend',
        DISTRIBUTION: '/api/dashboard/distribution'
    },
    IMPORT: {
        UPLOAD: '/api/import/excel',
        PROGRESS: '/api/import/progress',
        RESULT: '/api/import/result'
    },
    EXPORT: {
        EXCEL: '/api/export/excel'
    },
    LOG: {
        LIST: '/api/logs',
        DETAIL: '/api/logs/',
        EXPORT: '/api/logs/export',
        STATS: '/api/logs/stats'
    }
}

// 响应状态码
export const STATUS_CODES = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}

// 统一的错误消息
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接错误，请检查网络设置',
    SERVER_ERROR: '服务器错误，请稍后重试',
    TIMEOUT_ERROR: '请求超时，请重试',
    UNAUTHORIZED: '未授权或登录已过期',
    FORBIDDEN: '没有权限访问该资源',
    FILE_EMPTY: '文件不能为空',
    INVALID_FILE_TYPE: '只支持Excel文件格式(.xlsx, .xls)',
    TASK_NOT_FOUND: '任务不存在或已过期'
}