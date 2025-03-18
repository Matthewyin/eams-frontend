<template>
  <div class="visualization-card">
    <div class="card-header">
      <h2>机柜布局图</h2>
    </div>
    <div class="card-content">
      <div class="cabinet-layout">
        <div v-if="currentRoom" class="room-grid">
          <div 
            v-for="row in currentRoom.cabinetRows" 
            :key="row.id" 
            class="cabinet-row"
          >
            <div class="row-label">{{ row.name }}</div>
            <div class="cabinets-container">
              <div class="cabinets">
                <div 
                  v-for="cabinet in row.cabinets" 
                  :key="cabinet.id" 
                  class="cabinet-block"
                  :class="{
                    'network-cabinet': cabinet.type === 'network',
                    'server-cabinet': cabinet.type === 'server',
                    'selected': selectedCabinetId === cabinet.id
                  }"
                  @click="handleCabinetClick(cabinet)"
                >
                  <div class="cabinet-name">{{ cabinet.name }}</div>
                  <div class="cabinet-info">
                    <div class="cabinet-type">
                      {{ cabinet.type === 'network' ? '网络机柜' : '服务器机柜' }}
                    </div>
                    <div class="cabinet-remaining">
                      剩余: {{ getCabinetRemainingUnits(cabinet) }}U
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-room-selected">
          <el-empty description="请选择一个机房"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps({
  currentRoom: {
    type: Object,
    default: null
  },
  selectedCabinetId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['cabinet-select']);

const handleCabinetClick = (cabinet) => {
  emit('cabinet-select', cabinet);
};

// 计算机柜剩余U数
const getCabinetRemainingUnits = (cabinet) => {
  if (!cabinet || !cabinet.units) return 0;
  const freeUnits = cabinet.units.filter(unit => !unit.occupied).length;
  return freeUnits;
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
  min-width: 0; /* 允许容器在必要时缩小 */
  width: 100%; /* 确保容器能占满可用空间 */
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.card-content {
  padding: 25px;
  flex-grow: 1;
  overflow: hidden; /* 改为hidden，内部元素自行处理滚动 */
}

.cabinet-layout {
  height: 100%;
  min-height: 400px;
  overflow: auto; /* 添加整体滚动能力 */
}

.room-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cabinet-row {
  display: flex;
  align-items: flex-start; /* 改为flex-start以便容纳较大数量的机柜时不会拉伸 */
  margin-bottom: 20px;
}

.row-label {
  width: 50px;
  text-align: center;
  font-size: 14px;
  color: #a0aec0;
  font-weight: bold;
}

.cabinets-container {
  flex-grow: 1;
  overflow-x: auto;
  margin-left: 10px;
  width: 100%;
}

.cabinets {
  display: inline-flex;
  gap: 18px;
  padding-bottom: 15px; /* 为滚动条留出空间 */
  min-width: min-content; /* 确保内容不会收缩小于实际大小 */
  flex-wrap: wrap; /* 允许在较窄屏幕上换行 */
}

.cabinet-block {
  min-width: 100px;
  height: 160px;
  background-color: rgba(50, 50, 50, 0.5);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止压缩 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px; /* 添加底部边距，防止在换行时贴得太近 */
}

.cabinet-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cabinet-block.selected {
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.network-cabinet {
  background-color: rgba(103, 194, 58, 0.3);
  min-width: 110px;
}

.server-cabinet {
  background-color: rgba(64, 158, 255, 0.3);
  min-width: 110px;
}

.cabinet-name {
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 500;
}

.cabinet-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.25);
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cabinet-type {
  font-size: 13px;
  color: #b5c6df;
  margin-bottom: 8px;
  text-align: center;
}

.cabinet-remaining {
  font-size: 14px;
  color: #67c23a;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 3px rgba(103, 194, 58, 0.3);
}


.no-room-selected {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
