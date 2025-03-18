<template>
  <div class="cabinet-detail">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="机柜名称">{{ cabinet.name }}</el-descriptions-item>
      <el-descriptions-item label="机柜类型">
        {{ cabinet.type === 'network' ? '网络机柜' : '服务器机柜' }}
      </el-descriptions-item>
      <el-descriptions-item label="机柜宽度">{{ cabinet.width }}mm</el-descriptions-item>
      <el-descriptions-item label="机柜高度">{{ cabinet.height }}U</el-descriptions-item>
      <el-descriptions-item label="机柜状态">
        <el-tag :type="cabinet.status === 'normal' ? 'success' : 'danger'">
          {{ cabinet.status === 'normal' ? '正常' : '异常' }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <div class="cabinet-units">
      <h4>机柜设备列表</h4>
      <el-table :data="occupiedUnits" style="width: 100%" max-height="400">
        <el-table-column prop="position" label="位置" width="80">
          <template #default="scope">
            {{ scope.row.position }}U
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="100">
          <template #default="scope">
            <el-tag size="small" :type="getDeviceTypeTag(scope.row.deviceType)">
              {{ getDeviceTypeName(scope.row.deviceType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称">
        </el-table-column>
      </el-table>

      <div class="cabinet-stats">
        <h4>机柜使用率</h4>
        <el-progress 
          :percentage="usagePercentage" 
          :color="getUsageColor"
          :stroke-width="20"
          :format="percentageFormat"
        ></el-progress>
        <div class="stats-detail">
          <div class="stat-item">
            <span class="label">已用单元:</span>
            <span class="value">{{ occupiedUnits.length }}</span>
          </div>
          <div class="stat-item">
            <span class="label">空闲单元:</span>
            <span class="value">{{ cabinet.units.length - occupiedUnits.length }}</span>
          </div>
          <div class="stat-item">
            <span class="label">总单元数:</span>
            <span class="value">{{ cabinet.units.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cabinet: {
    type: Object,
    required: true
  }
})

// 计算属性：已占用的机柜单元
const occupiedUnits = computed(() => {
  return props.cabinet.units.filter(unit => unit.occupied)
})

// 计算属性：机柜使用率百分比
const usagePercentage = computed(() => {
  return Math.round((occupiedUnits.value.length / props.cabinet.units.length) * 100)
})

// 根据使用率返回不同颜色
const getUsageColor = computed(() => {
  const percentage = usagePercentage.value
  if (percentage < 70) return '#67c23a'
  if (percentage < 90) return '#e6a23c'
  return '#f56c6c'
})

// 格式化百分比显示
const percentageFormat = (percentage) => {
  return `${percentage}% 使用中`
}

// 获取设备类型标签颜色
const getDeviceTypeTag = (type) => {
  const typeMap = {
    'server': '',
    'switch': 'success',
    'router': 'warning',
    'storage': 'info',
    'firewall': 'danger',
    'other': 'info'
  }
  return typeMap[type] || ''
}

// 获取设备类型中文名称
const getDeviceTypeName = (type) => {
  const typeMap = {
    'server': '服务器',
    'switch': '交换机',
    'router': '路由器',
    'storage': '存储设备',
    'firewall': '防火墙',
    'other': '其他设备'
  }
  return typeMap[type] || '未知设备'
}
</script>

<style scoped>
.cabinet-detail {
  padding: 10px;
}

.cabinet-units {
  margin-top: 20px;
}

.cabinet-units h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.cabinet-stats {
  margin-top: 20px;
}

.stats-detail {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-item .label {
  font-size: 14px;
  color: #909399;
}

.stat-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  display: block;
  margin-top: 5px;
}
</style>
