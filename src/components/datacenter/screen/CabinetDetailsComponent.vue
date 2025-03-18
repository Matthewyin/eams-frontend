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
        <div class="detail-layout">
          <!-- 设备详情面板 -->
          <div class="device-details-panel" v-if="selectedDevice">
            <div class="panel-header">
              <h3>
                <el-tag size="small" :type="getDeviceTypeColor(selectedDevice.type)">
                  {{ getDeviceTypeName(selectedDevice.type) }}
                </el-tag>
                {{ selectedDevice.name }}
              </h3>
              <el-button circle size="small" @click="selectedDevice = null">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <div class="panel-content">
              <div class="device-detail-row">
                <span class="device-detail-label">位置：</span>
                <span class="device-detail-value strong">{{ formatUPosition(selectedDevice) }}</span>
              </div>
              <div class="device-detail-row">
                <span class="device-detail-label">占用空间：</span>
                <span class="device-detail-value">{{ selectedDevice.size }}U</span>
              </div>
              <div class="device-detail-row">
                <span class="device-detail-label">状态：</span>
                <span class="device-detail-value">
                  <el-tag size="small" type="success">运行中</el-tag>
                </span>
              </div>
              <div class="device-detail-row">
                <span class="device-detail-label">索引号：</span>
                <span class="device-detail-value">{{ selectedDevice.id }}</span>
              </div>
            </div>
          </div>

          <!-- 机柜U位图 -->
          <div class="u-position-view">
            <h3 class="section-title">机柜U位图</h3>
            <!-- 使用table布局确保稳定的宽度 -->
            <table class="u-rack">
              <tbody>
                <tr v-for="u in 42" :key="u" 
                  @click="selectDeviceAtPosition(selectedCabinet, 43 - u)"
                  @mouseover="hoverDeviceAtPosition(selectedCabinet, 43 - u)"
                  @mouseleave="hoveredDevice = null"
                  class="u-position-row"
                >
                  <!-- 如果这个U位被设备占用 -->
                  <td v-if="isUPositionOccupied(selectedCabinet, 43 - u)" 
                    class="u-cell device-cell"
                    :style="getUPositionStyle(selectedCabinet, 43 - u)">
                    <div class="u-number">{{ 43 - u }}U</div>
                    <div class="u-device-info">{{ getUPositionDeviceName(selectedCabinet, 43 - u) }}</div>
                  </td>
                  <!-- 如果这个U位没有设备 -->
                  <td v-else class="u-cell empty-cell">
                    <div class="u-number">{{ 43 - u }}U</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 设备列表 -->
        <div class="device-list">
          <h3 class="section-title">设备列表</h3>
          <el-table 
            :data="getOccupiedDevices(selectedCabinet)" 
            max-height="200" 
            style="width: 100%;"
            @row-click="row => selectDevice(row)"
          >
            <el-table-column label="位置" prop="position" width="70">
              <template #default="scope">
                {{ formatUPosition(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="设备类型" prop="type" width="100">
              <template #default="scope">
                <el-tag size="small" :type="getDeviceTypeColor(scope.row.type)">
                  {{ getDeviceTypeName(scope.row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="设备名称" prop="name"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else class="no-selection">
        <el-empty description="请选择一个机柜查看详情"></el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectedCabinet: {
    type: Object,
    default: null
  }
});

// 用于存储当前选中的设备
const selectedDevice = ref(null);

// 用于高亮显示指向的设备
const hoveredDevice = ref(null);

// 机柜使用率相关函数已移除

// 检查指定U位是否被占用
const isUPositionOccupied = (cabinet, uPosition) => {
  if (!cabinet || !cabinet.devices) return false;
  return cabinet.devices.some(device => {
    const startU = device.position;
    const endU = device.position + device.size - 1;
    return uPosition >= startU && uPosition <= endU;
  });
};

// 获取U位的设备名称
const getUPositionDeviceName = (cabinet, uPosition) => {
  if (!cabinet || !cabinet.devices) return '';
  const device = cabinet.devices.find(device => {
    const startU = device.position;
    const endU = device.position + device.size - 1;
    return uPosition >= startU && uPosition <= endU;
  });
  return device ? device.name : '';
};

// 检查U位是否被高亮显示
const isUPositionHighlighted = (cabinet, uPosition) => {
  if (!selectedDevice.value || !cabinet) return false;
  const device = selectedDevice.value;
  const startU = device.position;
  const endU = device.position + device.size - 1;
  return uPosition >= startU && uPosition <= endU;
};

// 在U位上选择设备
const selectDeviceAtPosition = (cabinet, uPosition) => {
  if (!cabinet || !cabinet.devices) return;
  const device = cabinet.devices.find(device => {
    const startU = device.position;
    const endU = device.position + device.size - 1;
    return uPosition >= startU && uPosition <= endU;
  });
  
  if (device) {
    if (selectedDevice.value === device) {
      // 如果点击的是已经选中的设备，则取消选中
      selectedDevice.value = null;
    } else {
      // 否则选中该设备
      selectedDevice.value = device;
    }
  } else {
    // 如果点击的是空闲U位，则取消当前选中
    selectedDevice.value = null;
  }
};

// 直接选择设备
const selectDevice = (device) => {
  if (selectedDevice.value === device) {
    selectedDevice.value = null;
  } else {
    selectedDevice.value = device;
  }
};

// 鼠标悬停在U位上
const hoverDeviceAtPosition = (cabinet, uPosition) => {
  if (!cabinet || !cabinet.devices) return;
  const device = cabinet.devices.find(device => {
    const startU = device.position;
    const endU = device.position + device.size - 1;
    return uPosition >= startU && uPosition <= endU;
  });
  
  if (device) {
    hoveredDevice.value = device;
  }
};

// 获取U位样式
const getUPositionStyle = (cabinet, uPosition) => {
  if (!cabinet || !cabinet.devices) return {};
  const device = cabinet.devices.find(device => {
    const startU = device.position;
    const endU = device.position + device.size - 1;
    return uPosition >= startU && uPosition <= endU;
  });
  
  if (!device) return {};
  
  // 为不同类型的设备设置不同的背景色
  const colorMap = {
    'server': 'rgba(64, 158, 255, 0.8)',
    'network': 'rgba(103, 194, 58, 0.8)',
    'storage': 'rgba(230, 162, 60, 0.8)',
    'security': 'rgba(245, 108, 108, 0.8)',
    'other': 'rgba(144, 147, 153, 0.8)'
  };
  
  // 添加宽度100%的样式，确保设备背景填满整个机柜宽度
  const style = {
    backgroundColor: colorMap[device.type] || colorMap.other,
    width: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };
  
  // 为设备的第一个U位添加顶部边框
  if (uPosition === device.position) {
    style.borderTop = '2px solid rgba(255, 255, 255, 0.8)';
  }
  
  // 为设备的最后一个U位添加底部边框
  if (uPosition === device.position + device.size - 1) {
    style.borderBottom = '2px solid rgba(255, 255, 255, 0.8)';
  }
  
  // 为选中设备添加边框和阴影
  if (selectedDevice.value === device) {
    style.boxShadow = 'inset 0 0 0 3px #fff';
  }
  
  // 为指向设备添加效果
  if (hoveredDevice.value === device && selectedDevice.value !== device) {
    style.filter = 'brightness(1.2)';
    style.boxShadow = 'inset 0 0 0 2px rgba(255, 255, 255, 0.5)';
  }
  
  return style;
};

// 获取设备类型对应的颜色
const getDeviceTypeColor = (type) => {
  const typeMap = {
    'server': 'primary',
    'network': 'success',
    'storage': 'warning',
    'security': 'danger',
    'other': 'info'
  };
  
  return typeMap[type] || 'info';
};

// 获取设备类型的中文名称
const getDeviceTypeName = (type) => {
  const typeNameMap = {
    'server': '服务器',
    'network': '网络设备',
    'storage': '存储设备',
    'security': '安全设备',
    'other': '其他设备'
  };
  
  return typeNameMap[type] || '未知设备';
};

// 获取设备列表
const getOccupiedDevices = (cabinet) => {
  return cabinet && cabinet.devices ? cabinet.devices : [];
};

// 格式化设备U位范围显示
const formatUPosition = (device) => {
  if (!device || device.size <= 1) return `${device.position}U`;
  return `${device.position}-${device.position + device.size - 1}U`;
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
  flex-grow: 1;
  overflow: auto;
}

.cabinet-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 新的布局样式 */
.detail-layout {
  display: flex;
  gap: 20px;
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
  margin-top: 0;
}

.section-title {
  margin-bottom: 15px;
  margin-top: 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  color: #e2e8f0;
}

.u-rack {
  width: 100%;
  max-width: 260px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(15, 23, 42, 0.7);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow: hidden;
  border-collapse: collapse;
  table-layout: fixed;
}

.u-position-row {
  height: 24px; /* 增加高度以便更好显示设备 */
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}



.u-position:hover {
  filter: brightness(1.1);
}

.u-position.occupied {
  color: white;
  font-weight: bold;
}

.u-position.highlighted {
  z-index: 10;
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
