import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        redirect: '/dashboard',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '仪表盘', icon: 'DataLine' }
            },
            {
                path: 'asset',
                name: 'Asset',
                component: () => import('@/views/asset/index.vue'),
                meta: { title: '资产管理', icon: 'Files' }
            },
            {
                path: 'asset/:id',
                name: 'AssetDetail',
                component: () => import('@/views/asset/detail.vue'),
                meta: { title: '资产详情', hidden: true }
            },
            {
                path: 'category',
                name: 'Category',
                component: () => import('@/views/category/index.vue'),
                meta: { title: '分类管理', icon: 'FolderOpened' }
            },
            {
                path: 'import',
                name: 'Import',
                component: () => import('@/views/import/index.vue'),
                meta: { title: '导入管理', icon: 'Upload' }
            },
            {
                path: 'setting',
                name: 'Setting',
                component: () => import('@/views/setting/index.vue'),
                meta: { title: '系统设置', icon: 'Setting' }
            }
        ]
    },
    {
        path: '/big-screen',
        name: 'BigScreen',
        component: () => import('@/views/big-screen/index.vue'),
        meta: { requiresAuth: true, title: '大屏展示' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫 - 修改为不严格检查认证
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 检查路由是否需要认证
    if (to.meta.requiresAuth !== false) {
        // 如果需要认证，检查用户是否已登录
        if (!userStore.isLoggedIn) {
            // 未登录，重定向到登录页
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }
    }

    // 如果已登录且访问登录页，重定向到首页
    if (to.name === 'Login' && userStore.isLoggedIn) {
        next({ name: 'Dashboard' })
        return
    }

    next()
})

export default router