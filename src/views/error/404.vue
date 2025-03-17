<!-- src/views/error/404.vue -->
<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.content {
  text-align: center;
}

h1 {
  font-size: 120px;
  margin: 0;
  color: #409EFF;
}

h2 {
  font-size: 30px;
  margin: 0;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}
</style>