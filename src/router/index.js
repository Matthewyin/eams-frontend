import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

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
                path: 'datacenter',
                name: 'DataCenter',
                component: () => import('@/views/datacenter/index.vue'),
                meta: { title: '机房机柜管理', icon: 'OfficeBuilding' }
            },
            {
                path: 'asset/:id',
                name: 'AssetDetail',
                component: () => import('@/views/asset/detail.vue'),
                meta: { title: '资产详情', hidden: true }
            },
            // 分类管理功能已移除，待后续开发
            // 导入管理功能已集成到资产管理页面
            {
                path: 'log',
                name: 'Log',
                component: () => import('@/views/log/index.vue'),
                meta: { title: '操作日志', icon: 'List' }
            },
            // 用户管理功能已整合到系统管理模块
            {
                path: 'system',
                component: () => import('@/views/system/index.vue'),
                name: 'System',
                meta: { title: '系统管理', icon: 'Setting' },
                children: [
                    {
                        path: 'user',
                        name: 'UserManagement',
                        component: () => import('@/views/system/user/index.vue'),
                        meta: { title: '用户管理', icon: 'User', permission: 'user:view' }
                    },
                    {
                        path: 'role',
                        name: 'RoleManagement',
                        component: () => import('@/views/system/role/index.vue'),
                        meta: { title: '角色管理', icon: 'UserFilled' }
                    },
                    {
                        path: 'permission',
                        name: 'PermissionManagement',
                        component: () => import('@/views/system/permission/index.vue'),
                        meta: { title: '权限管理', icon: 'Lock' }
                    },
                    {
                        path: 'setting',
                        name: 'SystemSetting',
                        component: () => import('@/views/system/setting/index.vue'),
                        meta: { title: '系统设置', icon: 'Setting' }
                    }
                ]
            },
            // 重定向原用户管理路径到系统管理中的用户管理
            {
                path: 'user',
                redirect: '/system/user'
            },
        ]
    },
    {
        path: '/big-screen',
        name: 'BigScreen',
        component: () => import('@/views/big-screen/index.vue'),
        meta: { requiresAuth: true, title: '大屏展示' }
    },
    {
        path: '/datacenter-screen',
        name: 'DataCenterScreen',
        component: () => import('@/views/datacenter/screen.vue'),
        meta: { requiresAuth: true, title: '机房机柜大屏展示' }
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
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    console.log('路由守卫开始 - 目标路由:', to.path)
    console.log('当前登录状态:', userStore.isLoggedIn)
    console.log('当前token:', localStorage.getItem('token'))
    console.log('当前用户信息:', userStore.userInfo)

    // 如果是登录页面
    if (to.path === '/login') {
        if (userStore.isLoggedIn) {
            console.log('已登录用户访问登录页，重定向到仪表盘')
            next('/dashboard')
            return
        }
        next()
        return
    }

    // 检查是否需要认证
    if (to.matched.some(record => record.meta.requiresAuth !== false)) {
        if (!userStore.isLoggedIn) {
            console.log('用户未登录，重定向到登录页')
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
            return
        }

        try {
            // 如果没有用户信息，获取用户信息
            if (!userStore.userInfo || Object.keys(userStore.userInfo).length === 0) {
                console.log('获取用户信息...')
                await userStore.getUserInfo()
            }
            next()
        } catch (error) {
            console.error('获取用户信息失败:', error)
            ElMessage.error('获取用户信息失败，请重新登录')
            await userStore.logout()
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
        return
    }

    next()
})

// 全局路由错误处理
router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
})

export default router