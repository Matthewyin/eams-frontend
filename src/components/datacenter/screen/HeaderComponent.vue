<template>
  <div class="screen-header">
    <div class="title">
      <h1>数据中心机房机柜大屏展示</h1>
      <span class="time">{{ currentTime }}</span>
    </div>
    <div class="actions">
      <el-button @click="backToManagement" type="primary" plain>返回管理页面</el-button>
      <el-button @click="toggleFullScreen" type="success" plain>{{ isFullScreen ? '退出全屏' : '全屏展示' }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isFullScreen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-fullscreen']);

const router = useRouter();
const currentTime = ref('');
let timer = null;

// 返回管理页面
const backToManagement = () => {
  router.push('/datacenter');
};

// 切换全屏模式
const toggleFullScreen = () => {
  emit('toggle-fullscreen');
};

// 格式化日期时间
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 更新时间
const updateTime = () => {
  currentTime.value = formatDateTime(new Date());
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgba(16, 24, 40, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  display: flex;
  align-items: center;
}

.title h1 {
  font-size: 24px;
  margin: 0;
  margin-right: 20px;
  background: linear-gradient(90deg, #42b983, #64b5f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.time {
  font-size: 16px;
  color: #a0aec0;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
