<template>
  <div class="system-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onErrorCaptured, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  console.error('系统管理组件捕获到错误:', err)
  console.log('错误信息:', info)
  ElMessage.error('系统管理页面加载出错')
  return false // 阻止错误继续传播
})

// 监听路由变化
watch(() => route.path, (newPath) => {
  console.log('系统管理 - 路由路径变化:', newPath)
})

onMounted(() => {
  console.log('系统管理组件已挂载')
  console.log('当前路由路径:', route.path)
  console.log('完整的路由对象:', route)
})
</script>

<style scoped>
.system-container {
  height: 100%;
  width: 100%;
}
</style> 