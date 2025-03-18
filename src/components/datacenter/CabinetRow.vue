<template>
  <div class="cabinet-row">
    <div class="row-header">
      <h3>{{ row.name }} <el-tag v-if="row.type === 'network'" type="success">网络机柜</el-tag><el-tag v-else>服务器机柜</el-tag></h3>
    </div>
    <div class="cabinets-container">
      <cabinet 
        v-for="cabinet in row.cabinets" 
        :key="cabinet.id" 
        :cabinet="cabinet"
        :selected="selectedCabinet && selectedCabinet.id === cabinet.id"
        @click="selectCabinet(cabinet)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataCenterStore } from '@/store/modules/datacenter'
import { storeToRefs } from 'pinia'
import Cabinet from './Cabinet.vue'

const props = defineProps({
  row: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-cabinet'])

// 获取数据中心store
const dataCenterStore = useDataCenterStore()
const { selectedCabinet } = storeToRefs(dataCenterStore)

// 选择机柜
const selectCabinet = (cabinet) => {
  dataCenterStore.setCurrentCabinet(cabinet)
  emit('select-cabinet', cabinet)
}
</script>

<style scoped>
.cabinet-row {
  margin-bottom: 30px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.row-header {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.row-header h3 {
  margin: 0;
  margin-right: 10px;
}

.cabinets-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
}

/* 定义滚动条样式 */
.cabinets-container::-webkit-scrollbar {
  height: 8px;
}

.cabinets-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.cabinets-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.cabinets-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
