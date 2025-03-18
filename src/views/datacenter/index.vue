<template>
  <div class="datacenter-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>机房机柜管理</h2>
          <el-button type="primary" icon="Monitor" @click="goToDataCenterScreen">大屏展示</el-button>
        </div>
      </template>
      
      <!-- 数据中心选择器 -->
      <data-center-selector v-model="selectedDataCenterId" @change="handleDataCenterChange" />
      
      <div v-if="dataCenterStore.loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
      
      <div v-else-if="dataCenterStore.error" class="error-container">
        <el-empty description="数据加载失败">
          <template #description>
            <p>{{ dataCenterStore.error }}</p>
          </template>
          <el-button type="primary" @click="refreshData">重新加载</el-button>
        </el-empty>
      </div>
      
      <div v-else>
        <!-- 楼宇选择器 -->
        <building-selector v-model="selectedBuildingId" @change="handleBuildingChange">
          <template #default>
            <!-- 机房选择器 -->
            <room-selector v-model="selectedRoomId" @change="handleRoomChange">
              <template #default>
                <!-- 调试信息 -->
                <div class="debug-info" style="margin-bottom: 15px; padding: 10px; background-color: #f5f7fa; border-radius: 4px;">
                  <p><strong>当前选中机房 ID:</strong> {{ selectedRoomId }}</p>
                  <p><strong>当前机房状态:</strong> {{ currentRoom ? '已加载' : '未加载' }}</p>
                  <p v-if="currentRoom"><strong>机柜列数量:</strong> {{ currentRoom.cabinetRows ? currentRoom.cabinetRows.length : 0 }}</p>
                </div>

                <!-- 机房详情和机柜视图 -->
                <div v-if="currentRoom" class="room-detail">
                  <div class="section-header">
                    <h3>机柜布局</h3>
                    <el-button type="primary" size="small" @click="showBigScreen">查看大屏展示</el-button>
                  </div>
                  
                  <!-- 机柜列表 -->
                  <div class="cabinet-rows">
                    <cabinet-row 
                      v-for="row in currentRoom.cabinetRows" 
                      :key="row.id" 
                      :row="row"
                      @select-cabinet="handleCabinetSelect"
                    />
                  </div>
                </div>
                
                <!-- 机柜信息侧边抽屉 -->
                <el-drawer
                  v-model="drawerVisible"
                  title="机柜详情"
                  size="30%"
                  :with-header="true"
                  direction="rtl"
                  :before-close="handleDrawerClose"
                >
                  <cabinet-detail v-if="selectedCabinet" :cabinet="selectedCabinet" />
                </el-drawer>
              </template>
            </room-selector>
          </template>
        </building-selector>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDataCenterStore } from '@/store/modules/datacenter'
import { storeToRefs } from 'pinia'
import DataCenterSelector from '@/components/datacenter/DataCenterSelector.vue'
import BuildingSelector from '@/components/datacenter/BuildingSelector.vue'
import RoomSelector from '@/components/datacenter/RoomSelector.vue'
import CabinetRow from '@/components/datacenter/CabinetRow.vue'
import CabinetDetail from '@/components/datacenter/CabinetDetail.vue'

const router = useRouter()
const dataCenterStore = useDataCenterStore()
const { selectedDataCenter, selectedBuilding, selectedRoom, selectedCabinet } = storeToRefs(dataCenterStore)

// 本地状态
const selectedDataCenterId = ref('')
const selectedBuildingId = ref('')
const selectedRoomId = ref('')
const drawerVisible = ref(false)

// 计算属性
const currentRoom = computed(() => selectedRoom.value)

// 加载数据
const refreshData = async () => {
  await dataCenterStore.fetchDataCenters()
}

// 处理数据中心变更
const handleDataCenterChange = (dataCenter) => {
  selectedDataCenterId.value = dataCenter.id
}

// 处理楼宇变更
const handleBuildingChange = (building) => {
  selectedBuildingId.value = building.id
}

// 处理机房变更
const handleRoomChange = (room) => {
  selectedRoomId.value = room.id
}

// 处理机柜选择
const handleCabinetSelect = (cabinet) => {
  drawerVisible.value = true
}

// 处理抽屉关闭
const handleDrawerClose = () => {
  drawerVisible.value = false
}

// 前往大屏展示页面
const showBigScreen = () => {
  router.push({
    name: 'DataCenterScreen',
    query: {
      dc: selectedDataCenterId.value,
      building: selectedBuildingId.value,
      room: selectedRoomId.value
    }
  })
}

// 直接前往大屏展示页面 (从顶部按钮)
const goToDataCenterScreen = () => {
  router.push('/datacenter-screen')
}

// 监听机柜选择变化
watch(selectedCabinet, (newVal) => {
  if (newVal) {
    drawerVisible.value = true
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.datacenter-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
}

.loading-container,
.error-container {
  padding: 40px 0;
  text-align: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
}

.cabinet-rows {
  margin-top: 20px;
}

.room-detail {
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}
</style>
