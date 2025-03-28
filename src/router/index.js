import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

// 打印当前构建路由信息，方便调试
console.log('路由文件加载 - 构建时间:', new Date().toLocaleString())

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
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/user/index.vue'),
                meta: { 
                    title: '用户管理', 
                    icon: 'User', 
                    permissions: ['user:view'],
                    requiresAdmin: true
                }
            },
            {
                path: 'user/:id',
                name: 'UserDetail',
                component: () => import('@/views/user/detail.vue'),
                meta: { 
                    title: '用户详情', 
                    hidden: true, 
                    permissions: ['user:view'],
                    requiresAdmin: true
                }
            },
            {
                path: 'department',
                name: 'Department',
                component: () => import('@/views/department/index.vue'),
                meta: { 
                    title: '部门管理', 
                    icon: 'OfficeBuilding', 
                    permissions: ['department:view'],
                    requiresAdmin: true
                }
            },
            {
                path: 'group',
                name: 'Group',
                component: () => import('@/views/group/index.vue'),
                meta: { 
                    title: '用户组管理', 
                    icon: 'UserFilled', 
                    permissions: ['group:view'],
                    requiresAdmin: true
                }
            },
            {
                path: 'permission',
                name: 'Permission',
                component: () => import('@/views/permission/index.vue'),
                meta: { 
                    title: '权限管理', 
                    icon: 'Lock', 
                    permissions: ['permission:view'],
                    requiresAdmin: true
                }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/profile/index.vue'),
                meta: { 
                    title: '个人信息', 
                    icon: 'UserFilled',
                    hidden: false
                }
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
    console.log('当前用户信息:', userStore.userInfo)

    // 安全地检查路由是否需要认证
    const requiresAuth = to.meta ? to.meta.requiresAuth !== false : true
    console.log('路由是否需要认证:', requiresAuth)
    
    if (requiresAuth) {
        // 如果需要认证，检查用户是否已登录
        if (!userStore.isLoggedIn) {
            console.log('用户未登录，重定向到登录页')
            // 未登录，重定向到登录页
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }
        
        // 确保有用户信息
        try {
            // 如果用户信息为空，则获取用户信息
            if (userStore.isLoggedIn && Object.keys(userStore.userInfo).length === 0) {
                console.log('开始获取用户信息...')
                await userStore.getUserInfo()
                console.log('获取用户信息成功:', userStore.userInfo)
                console.log('重新加载当前路由:', to.path)
                // 重新加载当前路由以确保组件正确渲染
                next({ ...to, replace: true })
                return
            }
        } catch (error) {
            console.error('获取用户信息失败，详细错误:', error)
            // 如果获取用户信息失败，可能是token无效，退出登录并重定向到登录页
            console.log('准备退出登录并重定向...')
            await userStore.logout()
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }
    }

    // 如果已登录且访问登录页，重定向到首页
    if (to.name === 'Login' && userStore.isLoggedIn) {
        console.log('已登录用户访问登录页，重定向到仪表盘')
        next({ name: 'Dashboard' })
        return
    }

    // 检查是否需要管理员权限
    if (to.meta && to.meta.requiresAdmin) {
        const userRoles = userStore.userInfo.roles || []
        const isAdmin = userRoles.some(role => 
            ['admin', 'administrator', 'ADMIN', 'SUPER_ADMIN'].includes(role)
        )
        
        if (!isAdmin) {
            console.log('用户没有访问管理员页面的权限，用户角色:', userRoles)
            ElMessage.error('只有管理员和超级管理员可以访问此页面')
            next({ name: 'Dashboard' })
            return
        } else {
            console.log('用户拥有管理员权限，允许访问管理员页面')
        }
    }

    // 进行路由跳转
    console.log('路由守卫结束 - 允许导航到:', to.path)
    next()
})

// 全局路由错误处理
router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
})

export default router