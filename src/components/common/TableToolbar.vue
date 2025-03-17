<template>
  <div class="table-toolbar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
      
      <el-tooltip content="刷新" placement="top">
        <el-button :icon="Refresh" circle @click="$emit('refresh')" />
      </el-tooltip>
      
      <el-tooltip content="密度" placement="top">
        <el-dropdown trigger="click" @command="handleSizeChange">
          <el-button :icon="Grid" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="large">默认</el-dropdown-item>
              <el-dropdown-item command="default">中等</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
      
      <el-tooltip content="列设置" placement="top">
        <el-dropdown trigger="click">
          <el-button :icon="SetUp" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="col in columns" :key="col.prop">
                <el-checkbox v-model="col.visible" @change="handleColumnChange">
                  {{ col.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { Refresh, Grid, SetUp } from '@element-plus/icons-vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['refresh', 'size-change', 'column-change'])

// 处理表格密度变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 处理列变化
const handleColumnChange = () => {
  emit('column-change', props.columns)
}
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

