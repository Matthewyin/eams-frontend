import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataCenterStore } from '@/store/modules/datacenter'
import { storeToRefs } from 'pinia'

export function useDatacenterScreen() {
  const route = useRoute()
  const router = useRouter()
  const dataCenterStore = useDataCenterStore()

  // 本地状态
  const selectedDataCenterId = ref('')
  const selectedBuildingId = ref('')
  const selectedRoomId = ref('')
  const selectedCabinetId = ref('')
  const isFullScreen = ref(false)

  // 从store获取状态
  const { allDataCenters, buildingsInCurrentDataCenter, roomsInCurrentBuilding, selectedRoom } = storeToRefs(dataCenterStore)

  // 计算属性
  const dataCenters = computed(() => allDataCenters.value)
  const buildings = computed(() => buildingsInCurrentDataCenter.value)
  const rooms = computed(() => roomsInCurrentBuilding.value)
  const currentRoom = computed(() => selectedRoom.value)

  // 计算选中的机柜
  const selectedCabinet = computed(() => {
    if (!currentRoom.value || !selectedCabinetId.value) return null
    
    for (const row of currentRoom.value.cabinetRows) {
      const cabinet = row.cabinets.find(c => c.id === selectedCabinetId.value)
      if (cabinet) return cabinet
    }
    return null
  })

  // 计算机房统计数据
  const totalCabinets = computed(() => {
    if (!currentRoom.value) return 0
    return currentRoom.value.cabinetRows.reduce((total, row) => total + row.cabinets.length, 0)
  })

  const networkCabinets = computed(() => {
    if (!currentRoom.value) return 0
    
    let count = 0
    for (const row of currentRoom.value.cabinetRows) {
      count += row.cabinets.filter(c => c.type === 'network').length
    }
    return count
  })

  const serverCabinets = computed(() => {
    if (!currentRoom.value) return 0
    
    let count = 0
    for (const row of currentRoom.value.cabinetRows) {
      count += row.cabinets.filter(c => c.type === 'server').length
    }
    return count
  })

  const occupancyRate = computed(() => {
    if (!currentRoom.value) return 0
    
    let totalUnits = 0
    let occupiedUnits = 0
    
    for (const row of currentRoom.value.cabinetRows) {
      for (const cabinet of row.cabinets) {
        totalUnits += cabinet.units.length
        occupiedUnits += cabinet.units.filter(u => u.occupied).length
      }
    }
    
    return totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100)
  })

  // 方法
  function handleDataCenterChange(dcId) {
    const dc = dataCenters.value.find(item => item.id === dcId)
    if (dc) {
      dataCenterStore.setCurrentDataCenter(dc)
      selectedBuildingId.value = buildings.value[0]?.id || ''
      handleBuildingChange(selectedBuildingId.value)
    }
  }

  function handleBuildingChange(buildingId) {
    const building = buildings.value.find(item => item.id === buildingId)
    if (building) {
      dataCenterStore.setCurrentBuilding(building)
      selectedRoomId.value = rooms.value[0]?.id || ''
      handleRoomChange(selectedRoomId.value)
    }
  }

  function handleRoomChange(roomId) {
    const room = rooms.value.find(item => item.id === roomId)
    if (room) {
      dataCenterStore.setCurrentRoom(room)
      selectedCabinetId.value = ''
    }
  }

  function selectCabinet(cabinet) {
    selectedCabinetId.value = cabinet.id
  }

  // 全屏相关功能
  function toggleFullScreen() {
    if (!isFullScreen.value) {
      const docEl = document.documentElement
      const requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen
      if (requestFullScreen) {
        requestFullScreen.call(docEl)
        isFullScreen.value = true
      }
    } else {
      const exitFullScreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
      if (exitFullScreen) {
        exitFullScreen.call(document)
        isFullScreen.value = false
      }
    }
  }

  // 日期时间格式化
  function formatDateTime(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 全屏状态变化处理函数
  function handleFullscreenChange() {
    isFullScreen.value = !!document.fullscreenElement || 
                        !!document.webkitFullscreenElement || 
                        !!document.mozFullScreenElement || 
                        !!document.msFullscreenElement
  }

  // 监听路由查询参数，初始化选择
  watch(() => route.query, (newQuery) => {
    if (newQuery.dc) {
      selectedDataCenterId.value = newQuery.dc
      handleDataCenterChange(selectedDataCenterId.value)
    }
    
    if (newQuery.building) {
      selectedBuildingId.value = newQuery.building
      handleBuildingChange(selectedBuildingId.value)
    }
    
    if (newQuery.room) {
      selectedRoomId.value = newQuery.room
      handleRoomChange(selectedRoomId.value)
    }
  }, { immediate: true })

  // 生命周期钩子
  onMounted(async () => {
    await dataCenterStore.fetchDataCenters()
    
    if (!selectedDataCenterId.value && dataCenters.value.length > 0) {
      selectedDataCenterId.value = dataCenters.value[0].id
      handleDataCenterChange(selectedDataCenterId.value)
    }
    
    // 监听全屏变化事件
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  })

  return {
    // 状态
    selectedDataCenterId,
    selectedBuildingId,
    selectedRoomId,
    selectedCabinetId,
    isFullScreen,
    
    // 计算属性
    dataCenters,
    buildings,
    rooms,
    currentRoom,
    selectedCabinet,
    totalCabinets,
    networkCabinets,
    serverCabinets,
    occupancyRate,
    
    // 方法
    handleDataCenterChange,
    handleBuildingChange,
    handleRoomChange,
    selectCabinet,
    toggleFullScreen,
    formatDateTime
  }
}
