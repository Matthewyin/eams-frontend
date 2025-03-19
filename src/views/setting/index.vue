<!-- src/views/setting/index.vue -->
<template>
  <div class="setting-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <div class="theme-setting">
        <h3>主题设置</h3>
        
        <div class="setting-item">
          <span class="setting-label">主题模式</span>
          <el-switch
              v-model="isDarkMode"
              active-text="暗色"
              inactive-text="亮色"
              @change="toggleTheme"
          />
        </div>

        <div class="setting-item">
          <span class="setting-label">表格密度</span>
          <el-radio-group v-model="tableDensity" @change="setTableDensity">
            <el-radio-button :value="'large'">默认</el-radio-button>
            <el-radio-button :value="'default'">中等</el-radio-button>
            <el-radio-button :value="'small'">紧凑</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()

// 主题设置
const isDarkMode = computed({
  get() {
    return appStore.theme === 'dark'
  },
  set(value) {
    appStore.theme = value ? 'dark' : 'light'
  }
})

// 切换主题
const toggleTheme = (value) => {
  appStore.setTheme(value ? 'dark' : 'light')
  ElMessage.success(`已切换为${value ? '暗色' : '亮色'}主题`)
}

// 表格密度
const tableDensity = computed({
  get() {
    return appStore.tableDensity
  },
  set(value) {
    appStore.tableDensity = value
  }
})

// 设置表格密度
const setTableDensity = (value) => {
  appStore.setTableDensity(value)
  ElMessage.success(`表格密度已设置为${value === 'large' ? '默认' : value === 'default' ? '中等' : '紧凑'}`)
}
</script>

<style scoped>
.setting-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-setting {
  padding: 20px 0;
}

.setting-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.setting-label {
  width: 100px;
  font-weight: bold;
}
</style>