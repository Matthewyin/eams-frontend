<template>
  <div class="datacenter-screen">
    <!-- 顶部标题栏 -->
    <HeaderComponent 
      :is-full-screen="isFullScreen" 
      @toggle-fullscreen="toggleFullScreen"
    />

    <!-- 主体内容区 -->
    <div class="screen-content">
      <!-- 数据中心选择器和统计信息 -->
      <ControlBarComponent 
        :data-centers="dataCenters"
        :buildings="buildings"
        :rooms="rooms"
        v-model:selected-data-center-id="selectedDataCenterId"
        v-model:selected-building-id="selectedBuildingId"
        v-model:selected-room-id="selectedRoomId"
        :total-cabinets="totalCabinets"
        :network-cabinets="networkCabinets"
        :server-cabinets="serverCabinets"
        :occupancy-rate="occupancyRate"
        @data-center-change="handleDataCenterChange"
        @building-change="handleBuildingChange"
        @room-change="handleRoomChange"
      />

      <!-- 机柜图表和信息 -->
      <div class="visualization-section">
        <el-row :gutter="20" class="full-height-row">
          <!-- 机柜分布图 -->
          <el-col :span="16" class="layout-column">
            <CabinetLayoutComponent 
              :current-room="currentRoom"
              :selected-cabinet-id="selectedCabinetId"
              @cabinet-select="selectCabinet"
            />
          </el-col>

          <!-- 机柜详情和使用率 -->
          <el-col :span="8" class="details-column">
            <CabinetDetailsComponent 
              :selected-cabinet="selectedCabinet"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入组件
import HeaderComponent from '@/components/datacenter/screen/HeaderComponent.vue'
import ControlBarComponent from '@/components/datacenter/screen/ControlBarComponent.vue'
import CabinetLayoutComponent from '@/components/datacenter/screen/CabinetLayoutComponent.vue'
import CabinetDetailsComponent from '@/components/datacenter/screen/CabinetDetailsComponent.vue'

// 导入封装的composable
import { useDatacenterScreen } from '@/composables/useDatacenterScreen'

// 使用composable提供的状态和方法
const {
  // 状态
  selectedDataCenterId,
  selectedBuildingId,
  selectedRoomId,
  selectedCabinetId,
  isFullScreen,
  
  // 计算属性
  dataCenters,
  buildings,
  rooms,
  currentRoom,
  selectedCabinet,
  totalCabinets,
  networkCabinets,
  serverCabinets,
  occupancyRate,
  
  // 方法
  handleDataCenterChange,
  handleBuildingChange,
  handleRoomChange,
  selectCabinet,
  toggleFullScreen,
  formatDateTime
} = useDatacenterScreen()

</script>

<style>
@import '@/styles/datacenter/screen.css';

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

.screen-content {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px); /* 减去header高度 */
}

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

/* 添加visualization-section样式 */
.visualization-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 15px;
}

.full-height-row {
  height: 100%;
  flex: 1;
  display: flex;
}

.layout-column, .details-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-row) {
  height: 100%;
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

.stat-card {
  background-color: rgba(30, 41, 59, 0.8);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 120px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f59e0b;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #a0aec0;
}

.visualization-card {
  background-color: rgba(30, 41, 59, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 15px 20px;
  background-color: rgba(16, 24, 40, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #e2e8f0;
}

.card-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.cabinet-layout {
  height: 100%;
}

.room-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cabinet-row {
  display: flex;
  align-items: center;
}

.row-label {
  width: 60px;
  font-weight: bold;
  color: #e2e8f0;
}

.cabinets {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  flex: 1;
}

.cabinet-block {
  position: relative;
  height: 200px;
  border-radius: 8px;
  background-color: rgba(45, 55, 72, 0.6);
  display: flex;
  flex-direction: column;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cabinet-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(66, 185, 131, 0.5);
}

.cabinet-block.selected {
  border: 2px solid #42b983;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

.network-cabinet {
  width: 100px;
  background-color: rgba(66, 185, 131, 0.2);
}

.server-cabinet {
  width: 80px;
  background-color: rgba(100, 181, 246, 0.2);
}

.cabinet-name {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.cabinet-usage {
  position: relative;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.usage-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.5s;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail-label {
  width: 80px;
  color: #a0aec0;
}

.detail-value {
  flex: 1;
}

.device-list {
  margin-top: 20px;
}

.device-list h3 {
  margin-bottom: 15px;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.no-selection {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 定义滚动条样式 */
.cabinets::-webkit-scrollbar,
.card-content::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.cabinets::-webkit-scrollbar-track,
.card-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.cabinets::-webkit-scrollbar-thumb,
.card-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.cabinets::-webkit-scrollbar-thumb:hover,
.card-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 黑暗主题下的表格样式调整 */
:deep(.el-table) {
  background-color: transparent;
  color: #e2e8f0;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table th) {
  background-color: rgba(16, 24, 40, 0.5);
  color: #a0aec0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(66, 185, 131, 0.1);
}

:deep(.el-table__empty-block) {
  background-color: transparent;
}
</style>
