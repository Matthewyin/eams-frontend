<template>
  <el-card class="stat-card" :body-style="{ padding: '20px' }">
    <div class="stat-content">
      <div class="stat-info">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-footer" v-if="footer">
          {{ footer }}
          <el-icon v-if="trend === 'up'" class="trend-up"><ArrowUp /></el-icon>
          <el-icon v-if="trend === 'down'" class="trend-down"><ArrowDown /></el-icon>
        </div>
      </div>
      <div class="stat-icon" :style="{ backgroundColor: iconBg }">
        <el-icon><component :is="icon" /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  footer: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    default: '',
    validator: (value) => ['up', 'down', ''].includes(value)
  },
  icon: {
    type: String,
    required: true
  },
  iconBg: {
    type: String,
    default: '#409EFF'
  }
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-footer {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
}

.trend-up {
  color: #67C23A;
  margin-left: 5px;
}

.trend-down {
  color: #F56C6C;
  margin-left: 5px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}
</style>

