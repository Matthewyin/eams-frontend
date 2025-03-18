/**
 * 数据中心状态管理模块
 */
import { defineStore } from 'pinia'
import { getDataCenters, getDataCenterById } from '@/api/datacenter'

export const useDataCenterStore = defineStore('datacenter', {
  state: () => ({
    dataCenters: [],
    currentDataCenter: null,
    currentBuilding: null,
    currentRoom: null,
    currentCabinetRow: null,
    currentCabinet: null,
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有数据中心列表
    allDataCenters: (state) => state.dataCenters,
    
    // 获取当前选中的数据中心
    selectedDataCenter: (state) => state.currentDataCenter,
    
    // 获取当前选中的楼宇
    selectedBuilding: (state) => state.currentBuilding,
    
    // 获取当前选中的机房
    selectedRoom: (state) => state.currentRoom,
    
    // 获取当前选中的机柜列
    selectedCabinetRow: (state) => state.currentCabinetRow,
    
    // 获取当前选中的机柜
    selectedCabinet: (state) => state.currentCabinet,
    
    // 获取当前数据中心下的所有楼宇
    buildingsInCurrentDataCenter: (state) => {
      return state.currentDataCenter?.buildings || []
    },
    
    // 获取当前楼宇下的所有机房
    roomsInCurrentBuilding: (state) => {
      return state.currentBuilding?.rooms || []
    },
    
    // 获取当前机房下的所有机柜列
    cabinetRowsInCurrentRoom: (state) => {
      return state.currentRoom?.cabinetRows || []
    },
    
    // 获取当前机柜列下的所有机柜
    cabinetsInCurrentRow: (state) => {
      return state.currentCabinetRow?.cabinets || []
    }
  },

  actions: {
    // 加载所有数据中心数据
    async fetchDataCenters() {
      this.loading = true
      this.error = null
      try {
        const response = await getDataCenters()
        if (response.success) {
          this.dataCenters = response.data
          // 如果当前没有选中的数据中心，默认选中第一个
          if (!this.currentDataCenter && this.dataCenters.length > 0) {
            this.setCurrentDataCenter(this.dataCenters[0])
          }
        } else {
          this.error = response.message || '获取数据中心信息失败'
        }
      } catch (error) {
        console.error('获取数据中心信息异常:', error)
        this.error = '获取数据中心信息异常'
      } finally {
        this.loading = false
      }
    },
    
    // 获取单个数据中心详情
    async fetchDataCenterById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await getDataCenterById(id)
        if (response.success) {
          // 更新数据中心列表中对应的数据中心
          const index = this.dataCenters.findIndex(dc => dc.id === id)
          if (index !== -1) {
            this.dataCenters[index] = response.data
          }
          return response.data
        } else {
          this.error = response.message || '获取数据中心详情失败'
          return null
        }
      } catch (error) {
        console.error('获取数据中心详情异常:', error)
        this.error = '获取数据中心详情异常'
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 设置当前选中的数据中心
    setCurrentDataCenter(dataCenter) {
      this.currentDataCenter = dataCenter
      // 重置下级选择
      this.currentBuilding = dataCenter?.buildings?.[0] || null
      this.resetRoomSelection()
    },
    
    // 设置当前选中的楼宇
    setCurrentBuilding(building) {
      this.currentBuilding = building
      // 重置下级选择
      this.resetRoomSelection()
    },
    
    // 设置当前选中的机房
    setCurrentRoom(room) {
      this.currentRoom = room
      // 重置下级选择
      this.currentCabinetRow = room?.cabinetRows?.[0] || null
      this.currentCabinet = null
    },
    
    // 设置当前选中的机柜列
    setCurrentCabinetRow(cabinetRow) {
      this.currentCabinetRow = cabinetRow
      // 重置下级选择
      this.currentCabinet = cabinetRow?.cabinets?.[0] || null
    },
    
    // 设置当前选中的机柜
    setCurrentCabinet(cabinet) {
      this.currentCabinet = cabinet
    },
    
    // 重置机房及以下级别的选择
    resetRoomSelection() {
      this.currentRoom = this.currentBuilding?.rooms?.[0] || null
      this.currentCabinetRow = this.currentRoom?.cabinetRows?.[0] || null
      this.currentCabinet = this.currentCabinetRow?.cabinets?.[0] || null
    },
    
    // 重置所有选择
    resetSelection() {
      this.currentDataCenter = this.dataCenters[0] || null
      this.resetBuildingSelection()
    },
    
    // 重置楼宇及以下级别的选择
    resetBuildingSelection() {
      this.currentBuilding = this.currentDataCenter?.buildings?.[0] || null
      this.resetRoomSelection()
    }
  }
})
