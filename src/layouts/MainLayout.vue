<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarCollapsed ? '64px' : '220px'" class="sidebar-container">
      <div class="logo-container">
        <img src="@/assets/logo-w.png" alt="Logo" class="logo" v-if="!sidebarCollapsed" />
        <img src="@/assets/logo-small.png" alt="Logo" class="logo-small" v-else />
      </div>
      
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          :unique-opened="true"
          class="sidebar-menu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409EFF"
          @select="handleMenuSelect"
          @open="handleMenuOpen"
          @close="handleMenuClose"
        >
          <template v-for="route in routes" :key="route.path">
            <!-- 隐藏的路由不显示 -->
            <template v-if="route?.meta && !route.meta.hidden">
              <!-- 没有子路由 -->
              <el-menu-item :index="route.path" v-if="!route.children">
                <el-icon v-if="route?.meta?.icon"><component :is="route.meta.icon" /></el-icon>
                <template #title>{{ getRouteTitle(route) }}</template>
              </el-menu-item>
              
              <!-- 有子路由 -->
              <el-sub-menu :index="route.path" v-else>
                <template #title>
                  <el-icon v-if="route?.meta?.icon"><component :is="route.meta.icon" /></el-icon>
                  <span>{{ getRouteTitle(route) }}</span>
                </template>
                
                <el-menu-item 
                  v-for="child in route.children" 
                  :key="child.path" 
                  :index="route.path + '/' + child.path"
                  v-if="child?.meta && !child.meta.hidden"
                >
                  <el-icon v-if="child?.meta?.icon"><component :is="child.meta.icon" /></el-icon>
                  <template #title>{{ getRouteTitle(child) }}</template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header height="60px" class="header">
        <div class="header-left">
          <el-icon class="toggle-sidebar" @click="toggleSidebar">
            <Fold v-if="!sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <breadcrumb />
        </div>
        
        <div class="header-right">
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="header-icon" @click="toggleFullScreen">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          
          <el-tooltip content="大屏展示" placement="bottom">
            <el-icon class="header-icon" @click="navigateTo('/big-screen')">
              <Monitor />
            </el-icon>
          </el-tooltip>
          
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" :src="avatar">{{ username.charAt(0) }}</el-avatar>
              <span class="username">{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/setting')">
                  <el-icon><Setting /></el-icon>
                  <span>个人设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区 -->
      <el-main>
        <div v-if="routeLoadError" class="route-error">
          <el-result
            icon="error"
            title="加载失败"
            sub-title="页面加载时发生错误，请刷新页面或联系管理员"
          >
            <template #extra>
              <el-button type="primary" @click="refreshPage">刷新页面</el-button>
            </template>
          </el-result>
        </div>
        <router-view v-else v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <suspense>
                <template #default>
                  <component :is="Component" :key="$route.fullPath" />
                </template>
                <template #fallback>
                  <div class="loading-container">
                    <el-skeleton :rows="10" animated />
                  </div>
                </template>
              </suspense>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// 路由加载错误状态
const routeLoadError = ref(false)

// 监听路由变化
router.beforeEach((to, from, next) => {
    console.log('主布局 - 路由变化:', { from: from.path, to: to.path })
    routeLoadError.value = false
    next()
})

// 增加一个方法用于记录路由变化
router.afterEach((to, from) => {
  console.log(`路由完成: 从 ${from.path} 到 ${to.path}`)
  console.log('当前路由Meta:', to.meta)
  console.log('当前组件:', to.matched.map(record => record.components?.default?.name || '未命名组件'))
})

// 路由信息
const routes = ref([])

// 安全地获取路由
const initRoutes = () => {
  try {
    // 使用getRoutes方法代替直接访问router.options
    const allRoutes = router.getRoutes()
    console.log('所有路由:', allRoutes)
    
    // 查找根路由的子路由
    const rootRoute = allRoutes.find(r => r.path === '/')
    if (rootRoute && rootRoute.children) {
      routes.value = rootRoute.children
      console.log('成功获取子路由:', routes.value)
    } else {
      console.warn('未找到根路由或子路由为空')
      routes.value = []
    }
  } catch (error) {
    console.error('获取路由信息失败:', error)
    routes.value = []
  }
}

// 组件挂载时
onMounted(() => {
    console.log('主布局组件已挂载')
    console.log('当前用户信息:', userStore.userInfo)
    console.log('当前路由信息:', {
        path: route.path,
        name: route.name,
        meta: route.meta
    })
    
    // 诊断路由结构
    console.log('Router对象:', router)
    console.log('Routes数组:', router.options?.routes)
    console.log('根路由:', router.options?.routes?.find(r => r.path === '/'))
    console.log('子路由:', router.options?.routes?.find(r => r.path === '/')?.children)
    
    // 初始化路由
    initRoutes()
})

// 处理路由组件加载错误
const handleRouteError = (error) => {
    console.error('路由组件加载失败:', error)
    routeLoadError.value = true
}

// 刷新页面
const refreshPage = () => {
    console.log('手动刷新页面')
    window.location.reload()
}

// 侧边栏状态
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const toggleSidebar = () => {
    console.log('切换侧边栏状态:', !sidebarCollapsed.value)
    appStore.toggleSidebar()
}

// 用户信息
const username = computed(() => userStore.username)
const avatar = computed(() => userStore.avatar)

// 路由信息
const activeMenu = computed(() => route.path)
const cachedViews = ref(['Dashboard', 'Asset'])

// 增加路由meta的安全访问
const getRouteTitle = (route) => {
  return route?.meta?.title || ''
}

// 导航方法
const navigateTo = (path) => {
  try {
    console.log('Navigating to path:', path)
    
    // 处理相对路径
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    
    console.log('最终导航路径:', path)
    router.push(path).then(() => {
      console.log('导航成功')
    }).catch(err => {
      console.error('导航失败:', err)
      ElMessage.error('页面导航失败：' + err.message)
    })
  } catch (error) {
    console.error('Navigation error:', error)
    ElMessage.error('页面导航出错：' + error.message)
  }
}

// 全屏切换
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

// 处理菜单选择
const handleMenuSelect = (index) => {
  console.log('菜单选择:', index)
  navigateTo(index)
}

// 菜单的打开和关闭事件处理
const handleMenuOpen = (index) => {
  console.log('菜单打开:', index)
}

const handleMenuClose = (index) => {
  console.log('菜单关闭:', index)
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.sidebar-container {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #002140;
}

.logo {
  height: 32px;
  margin: 14px 0;
}

.logo-small {
  height: 32px;
  width: 32px;
}

.sidebar-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-sidebar {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

