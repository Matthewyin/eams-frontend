<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑部门' : '新增部门'"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" />
      </el-form-item>
      
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入部门编码" />
      </el-form-item>
      
      <el-form-item label="上级部门" prop="parentId">
        <el-select
          v-model="form.parentId"
          placeholder="请选择上级部门"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in parentOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入部门描述"
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="enabled">
        <el-switch
          v-model="form.enabled"
          :active-value="true"
          :inactive-value="false"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { departmentApi } from '@/api/department'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  department: {
    type: Object,
    default: () => ({})
  },
  departments: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'success'])

// 表单引用
const formRef = ref(null)

// 加载状态
const loading = ref(false)

// 是否为编辑模式
const isEdit = computed(() => Boolean(props.department && props.department.id))

// 上级部门选项（排除自己及其子部门）
const parentOptions = computed(() => {
  if (!props.departments || !props.departments.length) {
    return []
  }
  
  // 如果是编辑模式，需要排除自己及其子部门
  if (isEdit.value) {
    const currentId = props.department.id
    // 简单实现：排除自己
    return props.departments.filter(item => item.id !== currentId)
  }
  
  return props.departments
})

// 表单数据
const form = reactive({
  name: '',
  code: '',
  description: '',
  enabled: true,
  parentId: null
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ]
}

// 监听部门数据变化，初始化表单
watch(
  () => props.department,
  (newVal) => {
    if (newVal) {
      Object.keys(form).forEach(key => {
        form[key] = newVal[key] !== undefined ? newVal[key] : form[key]
      })
    }
  },
  { immediate: true, deep: true }
)

// 监听对话框可见性变化
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      // 关闭对话框时重置表单
      resetForm()
    }
  }
)

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  
  form.name = ''
  form.code = ''
  form.description = ''
  form.enabled = true
  form.parentId = null
}

// 处理表单提交
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      let res
      
      if (isEdit.value) {
        // 编辑部门
        res = await departmentApi.updateDepartment(props.department.id, form)
      } else {
        // 创建部门
        res = await departmentApi.createDepartment(form)
      }
      
      if (res.data && res.data.success) {
        ElMessage.success(isEdit.value ? '更新部门成功' : '创建部门成功')
        emit('success')
        emit('update:visible', false)
      }
    } catch (error) {
      console.error(isEdit.value ? '更新部门失败:' : '创建部门失败:', error)
      ElMessage.error(error.response?.data?.message || (isEdit.value ? '更新部门失败' : '创建部门失败'))
    } finally {
      loading.value = false
    }
  })
}

// 同步visible属性
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
