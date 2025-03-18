<template>
  <div class="top-control-bar">
    <!-- 左侧选择器 -->
    <div class="selectors-container">
      <div class="selector">
        <span class="label">数据中心:</span>
        <el-select :model-value="selectedDataCenterId" @update:model-value="handleDataCenterChange" size="large">
          <el-option 
            v-for="dc in dataCenters" 
            :key="dc.id" 
            :label="dc.name" 
            :value="dc.id"
          ></el-option>
        </el-select>
      </div>
      <div class="selector">
        <span class="label">楼宇:</span>
        <el-select :model-value="selectedBuildingId" @update:model-value="handleBuildingChange" size="large">
          <el-option 
            v-for="building in buildings" 
            :key="building.id" 
            :label="building.name" 
            :value="building.id"
          ></el-option>
        </el-select>
      </div>
      <div class="selector">
        <span class="label">机房:</span>
        <el-select :model-value="selectedRoomId" @update:model-value="handleRoomChange" size="large">
          <el-option 
            v-for="room in rooms" 
            :key="room.id" 
            :label="room.name" 
            :value="room.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    
    <!-- 右侧统计信息 -->
    <div class="stats-container">
      <div class="compact-stat">
        <el-icon class="stat-mini-icon"><Monitor /></el-icon>
        <span class="stat-mini-value">{{ totalCabinets }}</span>
        <span class="stat-mini-label">机柜总数</span>
      </div>
      <div class="compact-stat network">
        <el-icon class="stat-mini-icon"><Connection /></el-icon>
        <span class="stat-mini-value">{{ networkCabinets }}</span>
        <span class="stat-mini-label">网络机柜</span>
      </div>
      <div class="compact-stat server">
        <el-icon class="stat-mini-icon"><Calendar /></el-icon>
        <span class="stat-mini-value">{{ serverCabinets }}</span>
        <span class="stat-mini-label">服务器机柜</span>
      </div>
      <div class="compact-stat usage">
        <el-icon class="stat-mini-icon"><DataAnalysis /></el-icon>
        <span class="stat-mini-value">{{ occupancyRate }}%</span>
        <span class="stat-mini-label">利用率</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Monitor, Connection, Calendar, DataAnalysis } from '@element-plus/icons-vue';

const props = defineProps({
  dataCenters: {
    type: Array,
    default: () => []
  },
  buildings: {
    type: Array,
    default: () => []
  },
  rooms: {
    type: Array,
    default: () => []
  },
  selectedDataCenterId: {
    type: String,
    default: ''
  },
  selectedBuildingId: {
    type: String,
    default: ''
  },
  selectedRoomId: {
    type: String,
    default: ''
  },
  totalCabinets: {
    type: Number,
    default: 0
  },
  networkCabinets: {
    type: Number,
    default: 0
  },
  serverCabinets: {
    type: Number,
    default: 0
  },
  occupancyRate: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:selected-data-center-id', 'update:selected-building-id', 'update:selected-room-id', 'data-center-change', 'building-change', 'room-change']);

const handleDataCenterChange = (dcId) => {
  emit('update:selected-data-center-id', dcId); // 使用kebab-case以匹配父组件v-model:selected-data-center-id
  emit('data-center-change', dcId);
};

const handleBuildingChange = (buildingId) => {
  emit('update:selected-building-id', buildingId); // 使用kebab-case以匹配父组件v-model:selected-building-id
  emit('building-change', buildingId);
};

const handleRoomChange = (roomId) => {
  emit('update:selected-room-id', roomId); // 使用kebab-case以匹配父组件v-model:selected-room-id
  emit('room-change', roomId);
};
</script>

<style scoped>
.top-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: rgba(16, 24, 40, 0.5);
  border-radius: 8px;
}

.selectors-container {
  display: flex;
  gap: 20px;
}

.stats-container {
  display: flex;
  gap: 15px;
}

.selector {
  display: flex;
  align-items: center;
  min-width: 280px;
}

.selector .label {
  margin-right: 10px;
  font-size: 16px;
  color: #a0aec0;
  white-space: nowrap;
}

/* 确保下拉选择框有足够宽度 */
:deep(.el-select) {
  width: 200px;
}

/* 确保下拉选项文本完整显示 */
:deep(.el-select-dropdown__item) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
  padding: 8px 12px;
}

/* 紧凑统计卡片样式 */
.compact-stat {
  background-color: rgba(30, 41, 59, 0.7);
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.stat-mini-icon {
  font-size: 18px;
  color: #f59e0b;
}

.compact-stat.network .stat-mini-icon {
  color: #67c23a;
}

.compact-stat.server .stat-mini-icon {
  color: #409eff;
}

.compact-stat.usage .stat-mini-icon {
  color: #f56c6c;
}

.stat-mini-value {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.stat-mini-label {
  font-size: 12px;
  color: #a0aec0;
  margin-left: auto;
}
</style>
