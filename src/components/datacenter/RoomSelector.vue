<template>
  <div class="room-selector">
    <el-tabs v-model="selectedRoomId" @tab-change="handleRoomChange" type="card">
      <el-tab-pane 
        v-for="room in rooms" 
        :key="room.id" 
        :label="room.name" 
        :name="room.id"
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
const { roomsInCurrentBuilding, selectedRoom } = storeToRefs(dataCenterStore)

// 本地状态
const selectedRoomId = ref(props.modelValue)

// 计算属性：当前楼宇下的所有机房
const rooms = computed(() => {
  return roomsInCurrentBuilding.value
})

// 监听父组件传入的值变化
watch(() => props.modelValue, (newVal) => {
  selectedRoomId.value = newVal
})

// 监听本地选择变化，同步到父组件
watch(selectedRoomId, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听store中选中的机房变化
watch(selectedRoom, (newVal) => {
  if (newVal && newVal.id !== selectedRoomId.value) {
    selectedRoomId.value = newVal.id
  }
})

// 处理机房选择变更
const handleRoomChange = (roomId) => {
  const selectedRm = rooms.value.find(r => r.id === roomId)
  if (selectedRm) {
    dataCenterStore.setCurrentRoom(selectedRm)
    emit('change', selectedRm)
  }
}

// 组件挂载时，如果没有传入初始值，自动选择第一个机房
onMounted(() => {
  if (!selectedRoomId.value && rooms.value.length > 0) {
    selectedRoomId.value = rooms.value[0].id
    handleRoomChange(selectedRoomId.value)
  }
})
</script>

<style scoped>
.room-selector {
  margin-bottom: 20px;
}
</style>
