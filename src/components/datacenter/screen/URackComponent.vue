<template>
  <!-- 机柜U位图 -->
  <div class="u-position-view">
    <h3 class="section-title">机柜U位图</h3>
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
            { 'device-selected': selectedDeviceId === device.id },
            { 'device-hovered': hoveredDeviceId === device.id }
          ]"
          :style="getDeviceBlockStyle(device)"
          @click="selectDevice(device)"
          @mouseover="hoverDevice(device)"
          @mouseleave="hoverDevice(null)"
        >
          <div class="device-block-inner">
            <div class="device-name">{{ device.name }}</div>
            <div class="device-type">{{ getDeviceTypeName(device.type) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cabinet: {
    type: Object,
    required: true
  },
  selectedDeviceId: {
    type: [String, Number, null],
    default: null
  },
  hoveredDeviceId: {
    type: [String, Number, null],
    default: null
  }
});

const emit = defineEmits(['select-device', 'hover-device']);

// 总U位数量，增加到43U
const totalUs = ref(43);

// 计算出当前机柜中的所有设备
const devices = computed(() => {
  if (!props.cabinet || !props.cabinet.devices) return [];
  return props.cabinet.devices;
});

// 选择设备
const selectDevice = (device) => {
  emit('select-device', device);
};

// 鼠标悬停在设备上
const hoverDevice = (device) => {
  emit('hover-device', device);
};

// 获取设备块样式
const getDeviceBlockStyle = (device) => {
  if (!device) return {};
  
  // 使用动态计算的方式，设备块高度为RU背景格子高度的70%
  const position = device.position || 1;
  const size = device.size || 1;
  const totalRUs = totalUs.value || 42;
  
  // 计算尺寸和位置
  const uBackgroundHeight = document.querySelector('.u-position-bg')?.clientHeight || 33;
  const deviceHeight = uBackgroundHeight * 0.7; // 设备块高度为RU高度的70%
  
  // 计算设备在U位图中的位置
  const topPosition = totalRUs - position - size + 1;
  
  return {
    position: 'absolute',
    top: `${topPosition * uBackgroundHeight + (uBackgroundHeight - deviceHeight) / 2}px`,
    height: `${size * deviceHeight}px`,
    left: '40px', // 从U数字标记后开始，增加了空间
    right: '2px',
    backgroundColor: getDeviceBackgroundColor(device.type),
    borderLeft: `4px solid ${getDeviceBorderColor(device.type)}`
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
.u-position-view {
  flex: 1;
  min-width: 280px;
  width: 100%;
  max-width: 100%;
  background-color: rgba(20, 29, 47, 0.8);
  border-radius: 8px;
  padding: 16px;
  margin-right: 0;
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  font-size: 15px;
  color: #e2e8f0;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* U位图样式 */
.u-rack-container {
  position: relative;
  height: calc(100% - 40px);
  width: 100%;
  min-height: 700px;
  background-color: rgba(30, 39, 57, 0.5);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
}

.u-rack-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

.u-position-bg {
  height: calc(100% / 42); /* 动态计算RU高度以适应容器 */
  min-height: 33px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  box-sizing: border-box;
}

.u-number {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px; /* 增加字体大小 */
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
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.device-block:hover {
  filter: brightness(1.2);
  transform: translateX(2px);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
}

.device-block.device-selected {
  transform: translateX(3px);
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.25);
  filter: brightness(1.3);
  z-index: 15;
}

.device-block-inner {
  padding: 2px 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.device-name {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 设备类型样式 */
.device-type-server {
  background-color: rgba(64, 158, 255, 0.2);
  border-left: 4px solid #409EFF;
}

.device-type-network {
  background-color: rgba(103, 194, 58, 0.2);
  border-left: 4px solid #67C23A;
}

.device-type-storage {
  background-color: rgba(230, 162, 60, 0.2);
  border-left: 4px solid #E6A23C;
}

.device-type-power {
  background-color: rgba(245, 108, 108, 0.2);
  border-left: 4px solid #F56C6C;
}
</style>
