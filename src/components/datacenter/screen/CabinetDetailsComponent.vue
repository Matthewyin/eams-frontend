<template>
  <div class="visualization-card">
    <!-- 机柜信息头部 -->
    <div class="card-header" v-if="selectedCabinet">
      <div class="header-main">
        <h2>{{ selectedCabinet.name }} 详情</h2>
      </div>
    </div>
    <div class="card-header" v-else>
      <h2>选择机柜查看详情</h2>
    </div>

    <div class="card-content">
      <div v-if="selectedCabinet" class="cabinet-details">
        <!-- 使用新的设备对话框组件 -->
        <device-dialog-component 
          v-if="selectedDevice"
          v-model:visible="showDeviceDialog"
          :device="selectedDevice"
          @close="closeDeviceDialog"
        />
        
        <!-- 设备悬停提示组件 -->
        <device-tooltip-component
          :device="hoveredDevice"
          :visible="!!hoveredDevice"
          :position="mousePosition"
        />

        <!-- 机柜U位图 -->
        <div class="u-rack-container">
          <!-- 背景U位网格 -->
          <div class="u-rack-background">
            <div v-for="u in totalUs" :key="u" class="u-position-bg">
              <div class="u-number">{{ totalUs + 1 - u }}U</div>
            </div>
          </div>
          
          <!-- 设备块层 -->
          <div class="u-rack-devices">
            <!-- 空U位占位 -->
            <div class="empty-space" :style="{ height: '100%' }"></div>
            
            <!-- 设备块 -->
            <div 
              v-for="device in devices" 
              :key="device.id"
              class="device-block"
              :class="[
                `device-type-${device.type}`,
                { 'device-selected': selectedDevice?.id === device.id },
                { 'device-hovered': hoveredDevice?.id === device.id }
              ]"
              :style="getDeviceBlockStyle(device)"
              @click="selectDevice(device)"
              @mouseover="hoverDevice(device, $event)"
              @mouseleave="hoverDevice(null, $event)"
              @mousemove="hoverDevice(device, $event)"
            >
              <div class="device-block-inner">
                <div class="device-name">{{ device.name }}</div>
                <div class="device-type">{{ getDeviceTypeName(device.type) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-selection">
        <el-empty description="请选择一个机柜查看详情"></el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DeviceDialogComponent from './DeviceDialogComponent.vue';
import DeviceTooltipComponent from './DeviceTooltipComponent.vue';

const props = defineProps({
  selectedCabinet: {
    type: Object,
    default: null
  }
});

// 用于存储当前选中的设备
const selectedDevice = ref(null);

// 控制弹窗显示
const showDeviceDialog = ref(false);

// 用于高亮显示指向的设备
const hoveredDevice = ref(null);

// 鼠标位置
const mousePosition = ref({ x: 0, y: 0 });

// 设备相关函数

// 直接选择设备
const selectDevice = (device) => {
  selectedDevice.value = device;
  showDeviceDialog.value = true;
};

// 鼠标悬停在设备上
const hoverDevice = (device, event) => {
  hoveredDevice.value = device;
  if (event) {
    mousePosition.value = {
      x: event.clientX,
      y: event.clientY
    };
  }
};

// 关闭设备详情对话框
const closeDeviceDialog = () => {
  selectedDevice.value = null;
  showDeviceDialog.value = false;
};

// 获取机柜设备列表
const devices = computed(() => {
  return props.selectedCabinet?.devices || [];
});

// 获取机柜总U数
const totalUs = computed(() => {
  return props.selectedCabinet?.size || 42;
});

// 获取设备块样式
const getDeviceBlockStyle = (device) => {
  if (!device) return {};
  
  const position = device.position || 1;
  const size = device.size || 1;
  const totalRUs = totalUs.value || 42;
  
  // 固定每个RU的高度为33px
  const uHeight = 33;
  
  // 计算设备块的位置，从上到下排列
  const topPosition = (totalRUs - position - size + 1) * uHeight;
  
  return {
    position: 'absolute',
    top: `${topPosition}px`,
    height: `${size * uHeight}px`,
    left: '40px',
    right: '2px',
    backgroundColor: getDeviceBackgroundColor(device.type),
    borderLeft: `4px solid ${getDeviceBorderColor(device.type)}`,
    zIndex: 15
  };
};

// 获取设备类型对应的背景颜色
const getDeviceBackgroundColor = (type) => {
  switch (type) {
    case 'server': return 'rgba(64, 158, 255, 0.2)';
    case 'network': return 'rgba(103, 194, 58, 0.2)';
    case 'storage': return 'rgba(230, 162, 60, 0.2)';
    case 'power': return 'rgba(245, 108, 108, 0.2)';
    default: return 'rgba(144, 147, 153, 0.2)';
  }
};

// 获取设备类型对应的边框颜色
const getDeviceBorderColor = (type) => {
  switch (type) {
    case 'server': return '#409EFF';
    case 'network': return '#67C23A';
    case 'storage': return '#E6A23C';
    case 'power': return '#F56C6C';
    default: return '#909399';
  }
};

// 获取设备类型的中文名称
const getDeviceTypeName = (type) => {
  switch (type) {
    case 'server': return '服务器';
    case 'network': return '网络设备';
    case 'storage': return '存储设备';
    case 'power': return '电源设备';
    default: return '其他设备';
  }
};

</script>

<style scoped>
.visualization-card {
  background-color: rgba(30, 41, 59, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部区域样式增强 */
.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

/* 添加机柜元数据样式 */
.cabinet-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.size-label {
  color: #a0aec0;
  font-size: 14px;
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.cabinet-details {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* U位图样式 */
.u-rack-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  background-color: rgba(30, 39, 57, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0 auto;
}

.u-rack-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(33px * 42); /* 固定总高度为42个RU */
  z-index: 5;
}

.u-position-bg {
  height: 33px; /* 固定每个RU的高度 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.u-number {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  z-index: 6;
  font-weight: 500;
  background-color: rgba(30, 41, 59, 0.5);
  padding: 1px 4px;
  border-radius: 3px;
  width: 36px;
  text-align: center;
}

.u-rack-devices {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.device-block {
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  pointer-events: auto;
}

.device-block:hover {
  box-shadow: 0 0 0 2px #fff;
  z-index: 25;
}

.device-block.device-selected {
  box-shadow: 0 0 0 2px #409EFF, 0 0 10px rgba(64, 158, 255, 0.5);
  z-index: 30;
}

.device-block.device-hovered {
  box-shadow: 0 0 0 1px #fff;
  z-index: 25;
}

.device-block-inner {
  padding: 4px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.device-name {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 新的布局样式 */
.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 设备详情面板样式 */
.device-details-panel {
  width: 220px; /* 调整宽度为更窄的尺寸，使高宽比为2.5:1 */
  background-color: rgba(15, 23, 42, 0.7);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(51, 65, 85, 0.5);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-detail-row {
  display: flex;
  align-items: center;
}

.device-detail-label {
  width: 80px;
  color: #94a3b8;
  font-size: 14px;
}

.device-detail-value {
  color: #e2e8f0;
  font-size: 14px;
}

.device-detail-value.strong {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
}

/* U位图样式增强 */
.u-position-view {
  flex: 1;
  min-width: 240px;
  max-width: 320px;
  background-color: rgba(20, 29, 47, 0.8);
  border-radius: 8px;
  padding: 12px;
  margin-right: 0;
  overflow-y: auto;
  max-height: 550px;
}

.section-title {
  font-size: 15px;
  color: #e2e8f0;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 新的U位图样式 */
.u-rack-container {
  position: relative;
  height: 1386px; /* 42U * 33px */
  width: 100%;
  background-color: rgba(30, 39, 57, 0.5);
  border-radius: 6px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.u-rack-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1386px; /* 42U * 33px */
  z-index: 5;
}

.u-position-bg {
  height: 33px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.u-number {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  z-index: 6;
}

.u-rack-devices {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.device-block {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.device-block:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  z-index: 30 !important;
}

.selected-device {
  z-index: 20;
}

.device-name {
  font-size: 12px;
  color: #fff;
  padding: 5px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

/* 设备弹窗样式 */
.device-popover-content {
  padding: 5px;
}

.device-popover-content h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
  text-align: center;
}

.device-info-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.device-info-label {
  width: 50px;
  color: #909399;
  font-size: 13px;
}

/* 点击弹窗样式 */
.device-click-popover {
  z-index: 9000 !important;
}

.device-click-content {
  padding: 10px;
}

.device-click-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.device-click-header h4 {
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-button {
  padding: 0;
  font-size: 18px;
}

.device-click-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.u-number {
  width: 35px;
  min-width: 35px;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  color: #cbd5e1;
  padding-left: 5px;
  display: inline-block;
}

.u-device-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  padding: 0 8px;
  font-weight: 500;
  display: inline-block;
}

/* 设备列表样式增强 */
.device-list {
  margin-top: 20px;
}

.device-list :deep(.el-table) {
  background-color: transparent;
  color: #e2e8f0;
}

.device-list :deep(.el-table__header-wrapper th) {
  background-color: rgba(51, 65, 85, 0.5);
  color: #e2e8f0;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.device-list :deep(.el-table__row) {
  background-color: rgba(30, 41, 59, 0.3);
  cursor: pointer;
}

.device-list :deep(.el-table__row:hover > td) {
  background-color: rgba(51, 65, 85, 0.5);
}

.device-list :deep(.el-table__row td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表格样式覆盖 */
:deep(.el-table) {
  background-color: transparent;
  color: #fff;
}

:deep(.el-table th) {
  background-color: rgba(0, 0, 0, 0.3);
  color: #a0aec0;
  font-weight: normal;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-table__empty-text) {
  color: #a0aec0;
}
</style>
