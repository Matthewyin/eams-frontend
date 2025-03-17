<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      <span v-if="index === breadcrumbs.length - 1">{{ item.title }}</span>
      <router-link v-else :to="item.path">{{ item.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])

// 生成面包屑
const generateBreadcrumbs = () => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  
  // 始终添加首页
  breadcrumbs.value = [{
    path: '/',
    title: '首页'
  }]
  
  // 添加匹配的路由
  matched.forEach(item => {
    breadcrumbs.value.push({
      path: item.path,
      title: item.meta.title
    })
  })
}

// 监听路由变化
watch(() => route.path, generateBreadcrumbs, { immediate: true })
</script>

