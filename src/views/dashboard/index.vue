<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in stats" :key="index">
        <stat-card
          :title="stat.title"
          :value="stat.value"
          :footer="stat.footer"
          :trend="stat.trend"
          :icon="stat.icon"
          :icon-bg="stat.iconBg"
        />
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :md="16">
        <chart-card
          title="资产变动趋势"
          :options="trendOptions"
          :loading="trendLoading"
          height="350px"
        >
          <template #actions>
            <el-radio-group v-model="trendType" size="small" @change="fetchTrendData">
              <el-radio-button :value="'week'">本周</el-radio-button>
              <el-radio-button :value="'month'">本月</el-radio-button>
              <el-radio-button :value="'year'">全年</el-radio-button>
            </el-radio-group>
          </template>
        </chart-card>
      </el-col>
      
      <el-col :xs="24" :md="8">
        <chart-card
          title="资产分类占比"
          :options="pieOptions"
          :loading="pieLoading"
          height="350px"
        />
      </el-col>
    </el-row>
    
    <!-- 最近导入记录 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近导入记录</span>
              <el-button type="text" @click="navigateTo('/import')">查看更多</el-button>
            </div>
          </template>
          
          <el-table :data="recentImports" stripe style="width: 100%">
            <el-table-column prop="fileName" label="文件名" min-width="200" />
            <el-table-column prop="importTime" label="导入时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="记录数" width="100" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.status === 'SUCCESS'"
                  type="primary" 
                  link 
                  @click="downloadResult(scope.row.id)"
                >
                  下载结果
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '@/components/dashboard/StatCard.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'
import { dashboardApi } from '@/api/dashboard'
import { fileApi } from '@/api/file'

const router = useRouter()

// 统计数据
const stats = ref([
  { 
    title: '总资产数', 
    value: '0', 
    footer: '较上月增长 10%', 
    trend: 'up', 
    icon: 'Files', 
    iconBg: '#409EFF' 
  },
  { 
    title: '本月新增', 
    value: '0', 
    footer: '较上月增长 5%', 
    trend: 'up', 
    icon: 'Plus', 
    iconBg: '#67C23A' 
  },
  { 
    title: '待处理', 
    value: '0', 
    footer: '较上月减少 2%', 
    trend: 'down', 
    icon: 'Warning', 
    iconBg: '#E6A23C' 
  },
  { 
    title: '报废资产', 
    value: '0', 
    footer: '较上月增长 3%', 
    trend: 'up', 
    icon: 'Delete', 
    iconBg: '#F56C6C' 
  }
])

// 趋势图数据
const trendType = ref('month')
const trendLoading = ref(false)
const trendOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增资产', '报废资产']
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
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增资产',
      type: 'line',
      data: [],
      areaStyle: {
        opacity: 0.1
      },
      smooth: true,
      lineStyle: {
        width: 3
      }
    },
    {
      name: '报废资产',
      type: 'line',
      data: [],
      areaStyle: {
        opacity: 0.1
      },
      smooth: true,
      lineStyle: {
        width: 3
      }
    }
  ]
})

// 饼图数据
const pieLoading = ref(false)
const pieOptions = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    data: []
  },
  series: [
    {
      name: '资产分类',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
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
      data: []
    }
  ]
})

// 最近导入记录
const recentImports = ref([])

// 获取概览数据
const fetchOverviewData = async () => {
  try {
    const res = await dashboardApi.getOverview()
    
    // 更新统计卡片数据
    stats.value[0].value = res.totalAssets.toString()
    stats.value[1].value = res.newAssets.toString()
    stats.value[2].value = res.pendingAssets.toString()
    stats.value[3].value = res.discardedAssets.toString()
    
    // 更新最近导入记录
    recentImports.value = res.recentImports || []
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

// 获取趋势数据
const fetchTrendData = async () => {
  trendLoading.value = true
  try {
    const res = await dashboardApi.getTrend({ type: trendType.value })
    
    // 更新趋势图数据
    trendOptions.value.xAxis.data = res.dates
    trendOptions.value.series[0].data = res.newAssets
    trendOptions.value.series[1].data = res.discardedAssets
  } catch (error) {
    console.error('获取趋势数据失败:', error)
  } finally {
    trendLoading.value = false
  }
}

// 获取分布数据
const fetchDistributionData = async () => {
  pieLoading.value = true
  try {
    const res = await dashboardApi.getDistribution()
    
    // 更新饼图数据
    const legendData = res.map(item => item.name)
    const seriesData = res.map(item => ({
      name: item.name,
      value: item.value
    }))
    
    pieOptions.value.legend.data = legendData
    pieOptions.value.series[0].data = seriesData
  } catch (error) {
    console.error('获取分布数据失败:', error)
  } finally {
    pieLoading.value = false
  }
}

// 下载导入结果
const downloadResult = async (id) => {
  try {
    const res = await fileApi.getImportResult(id)
    
    // 创建下载链接
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `导入结果_${id}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('下载结果失败:', error)
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'SUCCESS': 'success',
    'PROCESSING': 'warning',
    'FAILED': 'danger'
  }
  return statusMap[status] || 'info'
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

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 初始化
onMounted(() => {
  fetchOverviewData()
  fetchTrendData()
  fetchDistributionData()
})
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}
</style>
