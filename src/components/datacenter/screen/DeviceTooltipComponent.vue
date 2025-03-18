<template>
  <!-- 设备悬停提示组件 -->
  <div
    v-if="device && visible"
    class="device-tooltip"
    :style="positionStyle"
  >
    <div class="tooltip-content">
      <div class="device-type-container">
        <div class="device-type-tag">
          {{ getDeviceTypeName(device.type) }}
        </div>
      </div>
      <div class="device-name">{{ device.name }}</div>
      
      <div class="device-details-list">
        <!-- 位置信息 -->
        <div class="detail-row">
          <div class="detail-label">位置：</div>
          <div class="detail-value position-value">{{ formatUPosition(device) }}</div>
        </div>
        
        <!-- 占用空间 -->
        <div class="detail-row">
          <div class="detail-label">占用空间：</div>
          <div class="detail-value">{{ device.size }}U</div>
        </div>
        
        <!-- 运行状态 -->
        <div class="detail-row">
          <div class="detail-label">状态：</div>
          <div class="detail-value">
            <div class="status-badge running">运行中</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  device: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
});

// 计算tooltip位置样式
const positionStyle = computed(() => {
  return {
    left: `${props.position.x + 10}px`,
    top: `${props.position.y + 10}px`
  };
});

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

// 格式化设备U位范围显示
const formatUPosition = (device) => {
  if (!device) return '';
  const position = device.position || 1;
  const size = device.size || 1;
  const endPosition = position + size - 1;
  return `${position}U ~ ${endPosition}U`;
};
</script>

<style scoped>
/* 设备悬停提示框 */
.device-tooltip {
  position: fixed;
  z-index: 2000;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 260px;
  max-width: 320px;
  pointer-events: none;
  border: none;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  overflow: hidden;
}

/* 提示内容区 */
.tooltip-content {
  padding: 16px;
}

/* 设备类型容器 */
.device-type-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

/* 设备类型标签 */
.device-type-tag {
  display: inline-block;
  text-align: center;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  color: #b88230;
  background-color: #fdf6ec;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 设备名称 */
.device-name {
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 1.4;
  color: #333333;
  font-weight: 500;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 12px;
  letter-spacing: 0.15px;
}

/* 详情列表 */
.device-details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 详情行 */
.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 标签样式 */
.detail-label {
  color: #a0c3de;
  font-size: 12px;
  min-width: 70px;
  flex-shrink: 0;
  font-weight: 400;
}

/* 数值样式 */
.detail-value {
  color: #333333;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

/* 位置值高亮 */
.position-value {
  display: inline-block;
  font-weight: 500;
  color: #2196f3;
  background-color: #e3f2fd;
  padding: 4px 10px;
  border-radius: 4px;
  text-align: center;
}

/* 状态标记 */
.status-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.status-badge.running {
  background-color: #e8f5e9;
  color: #2e7d32;
}
</style>
