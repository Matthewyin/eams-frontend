<template>
  <div class="big-screen">
    <div class="header">
      <div class="title">EAMS 资产管理系统大屏</div>
      <div class="time">{{ currentTime }}</div>
    </div>
    
    <div class="content">
      <el-row :gutter="20">
        <!-- 左侧面板 -->
        <el-col :span="6">
          <div class="panel">
            <div class="panel-header">资产总览</div>
            <div class="panel-content">
              <div class="data-item" v-for="(item, index) in overviewData" :key="index">
                <div class="data-label">{{ item.label }}</div>
                <div class="data-value">{{ item.value }}</div>
                <div class="data-chart">
                  <div ref="miniChartRefs" class="mini-chart"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="panel">
            <div class="panel-header">资产状态分布</div>
            <div class="panel-content">
              <div ref="statusChartRef" class="chart-container"></div>
            </div>
          </div>
        </el-col>
        
        <!-- 中间面板 -->
        <el-col :span="12">
          <div class="panel">
            <div class="panel-header">资产地理分布</div>
            <div class="panel-content">
              <div ref="mapChartRef" class="map-container"></div>
            </div>
          </div>
          
          <div class="panel">
            <div class="panel-header">资产变动趋势</div>
            <div class="panel-content">
              <div ref="trendChartRef" class="chart-container"></div>
            </div>
          </div>
        </el-col>
        
        <!-- 右侧面板 -->
        <el-col :span="6">
          <div class="panel">
            <div class="panel-header">资产分类占比</div>
            <div class="panel-content">
              <div ref="categoryChartRef" class="chart-container"></div>
            </div>
          </div>
          
          <div class="panel">
            <div class="panel-header">最近导入记录</div>
            <div class="panel-content">
              <div class="import-list">
                <div class="import-item" v-for="(item, index) in recentImports" :key="index">
                  <div class="import-info">
                    <div class="import-name">{{ item.fileName }}</div>
                    <div class="import-time">{{ item.importTime }}</div>
                  </div>
                  <div class="import-status" :class="getStatusClass(item.status)">
                    {{ getStatusText(item.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { dashboardApi } from '@/api/dashboard'

// 当前时间
const currentTime = ref(new Date().toLocaleString())
const timeInterval = ref(null)

// 图表引用
const miniChartRefs = ref([])
const statusChartRef = ref(null)
const mapChartRef = ref(null)
const trendChartRef = ref(null)
const categoryChartRef = ref(null)

// 图表实例
const miniCharts = ref([])
const statusChart = ref(null)
const mapChart = ref(null)
const trendChart = ref(null)
const categoryChart = ref(null)

// 数据
const overviewData = ref([
  { label: '总资产数', value: '1,234', trend: [30, 40, 35, 50, 49, 60, 70, 91, 125] },
  { label: '本月新增', value: '89', trend: [10, 20, 15, 25, 22, 30, 35, 40, 45] },
  { label: '待处理', value: '12', trend: [5, 4, 6, 3, 8, 5, 7, 4, 3] },
  { label: '报废资产', value: '45', trend: [15, 10, 12, 8, 9, 11, 13, 9, 7] }
])

const recentImports = ref([
  { fileName: 'assets_2023.xlsx', importTime: '2023-11-20 10:30:45', status: 'SUCCESS' },
  { fileName: 'new_assets.xlsx', importTime: '2023-11-19 15:20:10', status: 'FAILED' },
  { fileName: 'department_assets.xlsx', importTime: '2023-11-18 09:15:30', status: 'SUCCESS' },
  { fileName: 'it_equipment.xlsx', importTime: '2023-11-17 14:45:22', status: 'SUCCESS' },
  { fileName: 'office_supplies.xlsx', importTime: '2023-11-16 11:10:05', status: 'PROCESSING' }
])

// 初始化迷你图表
const initMiniCharts = () => {
  miniChartRefs.value.forEach((el, index) => {
    if (!el) return
    
    const chart = echarts.init(el)
    miniCharts.value.push(chart)
    
    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: overviewData.value[index]?.trend || [],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0)' }
            ])
          }
        }
      ]
    }
    
    chart.setOption(option)
  })
}

// 初始化状态图表
const initStatusChart = () => {
  if (!statusChartRef.value) return
  
  statusChart.value = echarts.init(statusChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '资产状态',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 735, name: '在用' },
          { value: 310, name: '闲置' },
          { value: 134, name: '维修' },
          { value: 45, name: '报废' }
        ]
      }
    ]
  }
  
  statusChart.value.setOption(option)
}

// 初始化地图图表
const initMapChart = () => {
  if (!mapChartRef.value) return
  
  mapChart.value = echarts.init(mapChartRef.value)
  
  // 这里使用中国地图数据，需要额外引入
  // 简化版本，使用散点图代替
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      inRange: {
        color: ['#50a3ba', '#eac736', '#d94e5d']
      },
      textStyle: {
        color: '#fff'
      }
    },
    geo: {
      map: 'china',
      roam: true,
      label: {
        show: false
      },
      itemStyle: {
        areaColor: '#0c2c5a',
        borderColor: '#1cccff'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#0c4c8a'
        },
        label: {
          show: false
        }
      }
    },
    series: [
      {
        name: '资产数量',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          { name: '北京', value: [116.46, 39.92, 180] },
          { name: '上海', value: [121.48, 31.22, 150] },
          { name: '广州', value: [113.23, 23.16, 120] },
          { name: '深圳', value: [114.07, 22.62, 130] },
          { name: '杭州', value: [120.19, 30.26, 90] },
          { name: '武汉', value: [114.31, 30.52, 80] },
          { name: '成都', value: [104.06, 30.67, 70] },
          { name: '西安', value: [108.95, 34.27, 60] }
        ],
        symbolSize: function (val) {
          return val[2] / 10;
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        itemStyle: {
          color: '#ddb926'
        },
        emphasis: {
          label: {
            show: true
          }
        }
      }
    ]
  }
  
  // 由于没有加载中国地图数据，这里使用简化版本
  const simpleOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '资产分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 180, name: '北京' },
          { value: 150, name: '上海' },
          { value: 120, name: '广州' },
          { value: 130, name: '深圳' },
          { value: 90, name: '杭州' },
          { value: 80, name: '武汉' },
          { value: 70, name: '成都' },
          { value: 60, name: '西安' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          color: '#fff'
        }
      }
    ]
  }
  
  mapChart.value.setOption(simpleOption)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart.value = echarts.init(trendChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增资产', '报废资产'],
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [
      {
        name: '新增资产',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        areaStyle: {
          opacity: 0.2
        },
        smooth: true,
        lineStyle: {
          width: 3
        }
      },
      {
        name: '报废资产',
        type: 'line',
        stack: 'Total',
        data: [45, 32, 65, 34, 45, 30, 40, 52, 41, 54, 30, 20],
        areaStyle: {
          opacity: 0.2
        },
        smooth: true,
        lineStyle: {
          width: 3
        }
      }
    ]
  }
  
  trendChart.value.setOption(option)
}

// 初始化分类图表
const initCategoryChart = () => {
  if (!categoryChartRef.value) return
  
  categoryChart.value = echarts.init(categoryChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '资产分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0f1c3c',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 335, name: '电子设备' },
          { value: 310, name: '办公家具' },
          { value: 234, name: '运输工具' },
          { value: 135, name: '办公用品' },
          { value: 154, name: '其他资产' }
        ]
      }
    ]
  }
  
  categoryChart.value.setOption(option)
}

// 获取状态样式
const getStatusClass = (status) => {
  const statusMap = {
    'SUCCESS': 'status-success',
    'PROCESSING': 'status-processing',
    'FAILED': 'status-failed'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'SUCCESS': '成功',
    'PROCESSING': '处理中',
    'FAILED': '失败'
  }
  return statusMap[status] || '未知'
}

// 调整图表大小
const resizeCharts = () => {
  miniCharts.value.forEach(chart => chart?.resize())
  statusChart.value?.resize()
  mapChart.value?.resize()
  trendChart.value?.resize()
  categoryChart.value?.resize()
}

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 组件挂载后初始化
onMounted(() => {
  // 更新时间
  updateTime()
  timeInterval.value = setInterval(updateTime, 1000)
  
  // 初始化图表
  setTimeout(() => {
    initMiniCharts()
    initStatusChart()
    initMapChart()
    initTrendChart()
    initCategoryChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCharts)
  }, 100)
})

// 组件卸载前清理
onUnmounted(() => {
  clearInterval(timeInterval.value)
  window.removeEventListener('resize', resizeCharts)
  
  // 销毁图表
  miniCharts.value.forEach(chart => chart?.dispose())
  statusChart.value?.dispose()
  mapChart.value?.dispose()
  trendChart.value?.dispose()
  categoryChart.value?.dispose()
})
</script>

<style scoped>
.big-screen {
  min-height: 100vh;
  background-color: #0f1c3c;
  color: #fff;
  padding: 20px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(to right, #1890ff, #52c41a);
  -webkit-background-clip: text;
  color: transparent;
}

.time {
  font-size: 18px;
}

.content {
  height: calc(100vh - 100px);
}

.panel {
  background-color: rgba(13, 34, 65, 0.7);
  border: 1px solid rgba(84, 110, 122, 0.3);
  border-radius: 4px;
  margin-bottom: 20px;
  height: calc(50% - 10px);
  overflow: hidden;
}

.panel-header {
  font-size: 16px;
  font-weight: bold;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(84, 110, 122, 0.3);
}

.panel-content {
  padding: 16px;
  height: calc(100% - 45px);
  overflow: hidden;
}

.data-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.data-label {
  width: 100%;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  width: 50%;
}

.data-chart {
  width: 50%;
}

.mini-chart {
  height: 40px;
  width: 100%;
}

.chart-container {
  height: 100%;
  width: 100%;
}

.map-container {
  height: 100%;
  width: 100%;
}

.import-list {
  height: 100%;
  overflow-y: auto;
}

.import-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(84, 110, 122, 0.3);
}

.import-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.import-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.import-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-success {
  background-color: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.status-processing {
  background-color: rgba(24, 144, 255, 0.2);
  color: #1890ff;
}

.status-failed {
  background-color: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}
</style>

