<template>
  <div class="building-selector">
    <el-tabs v-model="selectedBuildingId" @tab-change="handleBuildingChange" type="card">
      <el-tab-pane 
        v-for="building in buildings" 
        :key="building.id" 
        :label="building.name" 
        :name="building.id"
      >
        <!-- 标签页内容将由父组件通过默认插槽填充 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useDataCenterStore } from '@/store/modules/datacenter'
import { storeToRefs } from 'pinia'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 获取数据中心store
const dataCenterStore = useDataCenterStore()
const { buildingsInCurrentDataCenter, selectedBuilding } = storeToRefs(dataCenterStore)

// 本地状态
const selectedBuildingId = ref(props.modelValue)

// 计算属性：当前数据中心下的所有楼宇
const buildings = computed(() => {
  return buildingsInCurrentDataCenter.value
})

// 监听父组件传入的值变化
watch(() => props.modelValue, (newVal) => {
  selectedBuildingId.value = newVal
})

// 监听本地选择变化，同步到父组件
watch(selectedBuildingId, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听store中选中的楼宇变化
watch(selectedBuilding, (newVal) => {
  if (newVal && newVal.id !== selectedBuildingId.value) {
    selectedBuildingId.value = newVal.id
  }
})

// 处理楼宇选择变更
const handleBuildingChange = (buildingId) => {
  const selectedBldg = buildings.value.find(b => b.id === buildingId)
  if (selectedBldg) {
    dataCenterStore.setCurrentBuilding(selectedBldg)
    emit('change', selectedBldg)
  }
}

// 组件挂载时，如果没有传入初始值，自动选择第一个楼宇
onMounted(() => {
  if (!selectedBuildingId.value && buildings.value.length > 0) {
    selectedBuildingId.value = buildings.value[0].id
    handleBuildingChange(selectedBuildingId.value)
  }
})
</script>

<style scoped>
.building-selector {
  margin-bottom: 20px;
}
</style>
