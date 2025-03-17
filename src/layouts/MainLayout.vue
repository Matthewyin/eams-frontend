<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarCollapsed ? '64px' : '220px'" class="sidebar-container">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" v-if="!sidebarCollapsed" />
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
        >
          <template v-for="route in routes" :key="route.path">
            <!-- 隐藏的路由不显示 -->
            <template v-if="!route.meta?.hidden">
              <!-- 没有子路由 -->
              <el-menu-item :index="route.path" v-if="!route.children" @click="navigateTo(route.path)">
                <el-icon v-if="route.meta?.icon"><component :is="route.meta.icon" /></el-icon>
                <template #title>{{ route.meta?.title }}</template>
              </el-menu-item>
              
              <!-- 有子路由 -->
              <el-sub-menu :index="route.path" v-else>
                <template #title>
                  <el-icon v-if="route.meta?.icon"><component :is="route.meta.icon" /></el-icon>
                  <span>{{ route.meta?.title }}</span>
                </template>
                
                <el-menu-item 
                  v-for="child in route.children" 
                  :key="child.path" 
                  :index="route.path + '/' + child.path"
                  @click="navigateTo(route.path + '/' + child.path)"
                  v-if="!child.meta?.hidden"
                >
                  <el-icon v-if="child.meta?.icon"><component :is="child.meta.icon" /></el-icon>
                  <template #title>{{ child.meta?.title }}</template>
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
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
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

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// 侧边栏状态
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const toggleSidebar = () => appStore.toggleSidebar()

// 用户信息
const username = computed(() => userStore.username)
const avatar = computed(() => userStore.avatar)

// 路由信息
const routes = router.options.routes.find(r => r.path === '/').children
const activeMenu = computed(() => route.path)
const cachedViews = ref(['Dashboard', 'Asset', 'Category'])

// 导航方法
const navigateTo = (path) => {
  router.push(path)
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

// 初始化
onMounted(() => {
  // 如果有主题设置，应用主题
  if (appStore.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
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

