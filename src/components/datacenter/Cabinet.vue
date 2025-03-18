<template>
  <div 
    class="cabinet" 
    :class="{ 
      'network-cabinet': cabinet.type === 'network', 
      'server-cabinet': cabinet.type === 'server',
      'selected': selected 
    }"
    @click="$emit('click')"
  >
    <div class="cabinet-header">
      <span class="cabinet-name">{{ cabinet.name }}</span>
      <el-tag size="small" :type="cabinet.status === 'normal' ? 'success' : 'danger'">
        {{ cabinet.status === 'normal' ? '正常' : '异常' }}
      </el-tag>
    </div>
    <div class="cabinet-body">
      <div class="rack-units">
        <div 
          v-for="unit in reversedUnits" 
          :key="unit.id" 
          class="rack-unit"
          :class="{ 'occupied': unit.occupied }"
          :title="unit.occupied ? `${unit.position}U: ${unit.deviceName} (${unit.deviceType})` : `${unit.position}U: 空闲`"
        >
          <span class="unit-number">{{ unit.position }}</span>
          <span v-if="unit.occupied" class="unit-info">{{ unit.deviceType }}</span>
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
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// 计算属性：反转机柜单元顺序，使1U在底部，42U在顶部
const reversedUnits = computed(() => {
  return [...props.cabinet.units].sort((a, b) => b.position - a.position)
})
</script>

<style scoped>
.cabinet {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 10px;
  flex-shrink: 0;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  background-color: #f5f7fa;
}

.cabinet:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.cabinet.selected {
  border: 2px solid #409eff;
  box-shadow: 0 0 10px #409eff;
}

.network-cabinet {
  width: 120px; /* 网络机柜宽度较宽 */
}

.server-cabinet {
  width: 80px; /* 服务器机柜宽度较窄 */
}

.cabinet-header {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f0f2f5;
}

.cabinet-name {
  font-weight: bold;
  font-size: 0.9em;
}

.cabinet-body {
  height: 420px; /* 42U * 10px 高度 */
  overflow-y: auto;
  position: relative;
}

.rack-units {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rack-unit {
  height: 10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  font-size: 8px;
  padding: 0 4px;
  position: relative;
}

.rack-unit.occupied {
  background-color: #ecf5ff;
  height: 10px;
}

.rack-unit:nth-child(5n) {
  border-bottom: 1px solid #c0c4cc;
}

.unit-number {
  position: absolute;
  left: 2px;
  font-size: 6px;
  color: #909399;
}

.unit-info {
  font-size: 6px;
  color: #409eff;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  padding-left: 12px; /* 为单元编号预留空间 */
}

/* 定义滚动条样式 */
.cabinet-body::-webkit-scrollbar {
  width: 4px;
}

.cabinet-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cabinet-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.cabinet-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
