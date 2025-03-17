<template>
  <el-form :model="formData" ref="formRef" :inline="true" class="search-form">
    <slot></slot>
    
    <el-form-item>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        <span>搜索</span>
      </el-button>
      <el-button @click="handleReset">
        <el-icon><RefreshRight /></el-icon>
        <span>重置</span>
      </el-button>
      <el-button v-if="showExpand" type="text" @click="toggleExpand">
        {{ expanded ? '收起' : '展开' }}
        <el-icon>
          <ArrowUp v-if="expanded" />
          <ArrowDown v-else />
        </el-icon>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue'

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  showExpand: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset'])

const formRef = ref(null)
const formData = reactive(props.model)
const expanded = ref(false)

// 搜索
const handleSearch = () => {
  emit('search', formData)
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

// 切换展开/收起
const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style>

