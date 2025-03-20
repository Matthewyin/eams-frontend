<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      <span v-if="index === breadcrumbs.length - 1">{{ item.title }}</span>
      <router-link v-else :to="item.path">{{ item.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])

// 生成面包屑
const generateBreadcrumbs = () => {
  try {
    // 安全过滤有meta和title的路由
    const matched = route.matched.filter(item => item && item.meta && item.meta.title)
    
    // 始终添加首页
    breadcrumbs.value = [{
      path: '/',
      title: '首页'
    }]
    
    // 添加匹配的路由，增加安全检查
    matched.forEach(item => {
      breadcrumbs.value.push({
        path: item.path,
        title: item.meta.title || '未命名页面'
      })
    })
  } catch (error) {
    console.error('生成面包屑失败:', error)
    // 确保至少有首页
    breadcrumbs.value = [{
      path: '/',
      title: '首页'
    }]
  }
}

// 监听路由变化
watch(() => route.path, generateBreadcrumbs, { immediate: true })

// 初始化
onMounted(() => {
  console.log('Breadcrumb组件挂载')
  generateBreadcrumbs()
})
</script>

