<template>
  <el-card class="chart-card" :body-style="{ padding: '0' }">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div class="chart-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="chart-content" :style="{ height: height }">
      <div ref="chartRef" class="chart-container"></div>
      <div v-if="loading" class="chart-loading">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps, defineExpose } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  }
}

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(props.options, true)
  }
}

// 调整图表大小
const resizeChart = () => {
  chartInstance?.resize()
}

// 监听窗口大小变化
window.addEventListener('resize', resizeChart)

// 监听options变化
watch(() => props.options, updateChart, { deep: true })

// 组件挂载后初始化图表
onMounted(() => {
  initChart()
})

// 组件卸载前销毁图表
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

// 暴露方法
defineExpose({
  chartInstance,
  updateChart,
  resizeChart
})
</script>

<style scoped>
.chart-card {
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
}

.chart-content {
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-icon {
  font-size: 24px;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

