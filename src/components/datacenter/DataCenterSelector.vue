<template>
  <div class="data-center-selector">
    <el-radio-group v-model="selectedDcId" @change="handleDataCenterChange" size="large">
      <el-radio-button v-for="dc in dataCenters" :key="dc.id" :label="dc.id">
        {{ dc.name }}
      </el-radio-button>
    </el-radio-group>
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
const { allDataCenters, selectedDataCenter } = storeToRefs(dataCenterStore)

// 本地状态
const selectedDcId = ref(props.modelValue)

// 计算属性：所有数据中心
const dataCenters = computed(() => {
  return allDataCenters.value
})

// 监听父组件传入的值变化
watch(() => props.modelValue, (newVal) => {
  selectedDcId.value = newVal
})

// 监听本地选择变化，同步到父组件
watch(selectedDcId, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听store中选中的数据中心变化
watch(selectedDataCenter, (newVal) => {
  if (newVal && newVal.id !== selectedDcId.value) {
    selectedDcId.value = newVal.id
  }
})

// 处理数据中心选择变更
const handleDataCenterChange = (dcId) => {
  const selectedDc = dataCenters.value.find(dc => dc.id === dcId)
  if (selectedDc) {
    dataCenterStore.setCurrentDataCenter(selectedDc)
    emit('change', selectedDc)
  }
}

// 组件挂载时，如果没有传入初始值，自动选择第一个数据中心
onMounted(() => {
  if (!selectedDcId.value && dataCenters.value.length > 0) {
    selectedDcId.value = dataCenters.value[0].id
    handleDataCenterChange(selectedDcId.value)
  }
})
</script>

<style scoped>
.data-center-selector {
  margin-bottom: 20px;
}
</style>
