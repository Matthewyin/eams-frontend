<template>
  <el-dialog
    :title="user ? '编辑用户' : '新增用户'"
    v-model="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      :disabled="loading"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="!!user" />
      </el-form-item>
      
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      
      <el-form-item label="角色" prop="roles">
        <el-select
          v-model="form.roles"
          multiple
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="密码" prop="password" v-if="!user">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="留空则使用系统默认密码"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'success'])

// 对话框可见性
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 表单引用
const formRef = ref(null)

// 加载状态
const loading = ref(false)

// 表单数据
const form = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  roles: [],
  status: 1,
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  roles: [
    { required: true, message: '请选择角色', trigger: 'change' },
    { type: 'array', min: 1, message: '请至少选择一个角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  form.value = {
    username: '',
    name: '',
    email: '',
    phone: '',
    roles: [],
    status: 1,
    password: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 监听用户数据变化
watch(() => props.user, (newVal) => {
  if (newVal) {
    form.value = {
      username: newVal.username || '',
      name: newVal.name || '',
      email: newVal.email || '',
      phone: newVal.phone || '',
      roles: newVal.roles || [],
      status: newVal.status !== undefined ? newVal.status : 1,
      password: '' // 编辑时不需要密码
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      const formData = { ...form.value }
      
      // 如果密码为空，则不提交密码字段
      if (!formData.password) {
        delete formData.password
      }
      
      if (props.user) {
        // 更新用户
        await userApi.updateUser(props.user.id, formData)
        ElMessage.success('用户更新成功')
      } else {
        // 创建用户
        await userApi.createUser(formData)
        ElMessage.success('用户创建成功')
      }
      
      dialogVisible.value = false
      emit('success')
    } catch (error) {
      console.error('保存用户失败:', error)
      ElMessage.error('保存用户失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
