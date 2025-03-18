<template>
  <!-- 设备详情对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="设备详情"
    width="400px"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    center
    destroy-on-close
    class="device-detail-dialog material-dialog"
  >
    <div class="device-content">
      <!-- 设备类型标签 -->
      <div class="device-type-container">
        <el-tag size="large" type="warning" class="device-type-tag" effect="plain">
          {{ getDeviceTypeName(device.type) }}
        </el-tag>
      </div>
      
      <!-- 设备名称 -->
      <h2 class="device-name">{{ device.name }}</h2>
      
      <!-- 设备详情列表 -->
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
        
        <!-- 设备ID -->
        <div class="detail-row">
          <div class="detail-label">索引号：</div>
          <div class="detail-value">{{ device.id }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  device: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

// 控制对话框显示状态
const dialogVisible = ref(props.visible);

// 监听传入的visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

// 监听对话框状态变化，通知父组件
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
  if (!newVal) emit('close');
});

// 获取设备类型对应的颜色
const getDeviceTypeColor = (type) => {
  switch (type) {
    case 'server': return 'primary';
    case 'network': return 'success';
    case 'storage': return 'warning';
    case 'power': return 'danger';
    default: return 'info';
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

// 格式化设备U位范围显示
const formatUPosition = (device) => {
  if (!device) return '';
  return `${device.position}U ~ ${device.position + device.size - 1}U`;
};
</script>

<style scoped>
/* Material Design 风格对话框 */
.material-dialog {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

:deep(.el-dialog) {
  background-color: #ffffff !important;
  border: none !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

:deep(.el-dialog__header) {
  background-color: #ffffff !important;
  color: #333333 !important;
  padding: 16px 24px !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.el-dialog__title) {
  color: #333333 !important;
  font-weight: 500 !important;
  font-size: 18px !important;
  letter-spacing: 0.25px !important;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #616161 !important;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
  color: #333333 !important;
  background-color: #ffffff !important;
}

/* 内容区域样式 */
.device-content {
  padding: 24px;
}

/* 设备类型容器 */
.device-type-container {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

/* 设备类型标签 */
.device-type-tag {
  display: inline-block;
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 16px;
  color: #b88230;
  background-color: #fdf6ec;
  border-color: transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 设备名称 */
.device-name {
  margin: 0 0 28px 0;
  font-size: 20px;
  line-height: 1.4;
  color: #333333;
  font-weight: 500;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 16px;
  letter-spacing: 0.15px;
}

/* 详情列表 */
.device-details-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 详情行 */
.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* 标签样式 */
.detail-label {
  color: #a0c3de;
  font-size: 14px;
  min-width: 80px;
  flex-shrink: 0;
  font-weight: 400;
}

/* 数值样式 */
.detail-value {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
}

/* 位置值高亮 */
.position-value {
  display: inline-block;
  font-weight: 500;
  color: #2196f3;
  background-color: #e3f2fd;
  padding: 6px 12px;
  border-radius: 4px;
  text-align: center;
}

/* 状态标记 */
.status-badge {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.running {
  background-color: #e8f5e9;
  color: #2e7d32;
}
</style>
