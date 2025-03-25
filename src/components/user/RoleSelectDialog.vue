<template>
  <el-dialog
    v-model="visible"
    title="批量分配角色"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @closed="handleClosed"
  >
    <div class="role-select-container">
      <p class="dialog-description">请选择要分配给选中用户的角色：</p>
      
      <el-transfer
        v-model="selectedRoles"
        :data="roleData"
        :titles="['可选角色', '已选角色']"
        :button-texts="['移除', '添加']"
        :props="{
          key: 'id',
          label: 'name'
        }"
      />
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  roles: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'confirm'])

// 角色数据
const roleData = computed(() => {
  return props.roles.map(role => ({
    id: role.id,
    name: role.name,
    code: role.code
  }))
})

// 已选择的角色
const selectedRoles = ref([])

// 监听对话框可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 对话框打开时，重置选择
    selectedRoles.value = []
  }
})

// 处理确认
const handleConfirm = () => {
  if (selectedRoles.value.length === 0) {
    // 如果没有选择角色，不执行操作
    return
  }
  
  // 触发确认事件，传递选中的角色ID
  emit('confirm', selectedRoles.value)
}

// 处理对话框关闭
const handleClosed = () => {
  // 重置选择
  selectedRoles.value = []
}

// 同步visible属性
watch(() => props.visible, (val) => {
  if (val !== visible.value) {
    emit('update:visible', val)
  }
})

// 本地visible状态
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
</script>

<style scoped>
.role-select-container {
  padding: 10px 0;
}

.dialog-description {
  margin-bottom: 20px;
  color: #606266;
}

.el-transfer {
  margin: 20px 0;
}
</style>
