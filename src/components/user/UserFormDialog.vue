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
      <el-form-item label="用户名" prop="username" v-if="!user">
        <el-input v-model="form.username" />
      </el-form-item>
      
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      
      <el-form-item label="部门" prop="departmentId">
        <el-select v-model="form.departmentId" filterable placeholder="请选择部门" style="width: 100%">
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
          <!-- 只对管理员显示创建选项 -->
          <el-option v-if="isAdmin" label="+ 创建新部门" value="create_new" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="用户组" prop="groupIds">
        <el-select v-model="form.groupIds" multiple filterable placeholder="请选择用户组" style="width: 100%">
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
          <!-- 只对管理员显示创建选项 -->
          <el-option v-if="isAdmin" label="+ 创建新用户组" value="create_new" />
        </el-select>
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
        <div class="form-tip">留空则使用系统默认密码：12345678</div>
      </el-form-item>

      <el-form-item label="密码设置" v-if="!user">
        <el-checkbox v-model="form.requirePasswordChange">
          要求用户首次登录时必须修改密码
        </el-checkbox>
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
  
  <!-- 部门创建弹窗 -->
  <department-form-dialog
    v-model:visible="showDepartmentDialog"
    @success="handleDepartmentCreated"
  />
  
  <!-- 用户组创建弹窗 -->
  <group-form-dialog
    v-model:visible="showGroupDialog"
    @success="handleGroupCreated"
  />
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'
import { departmentApi } from '@/api/department'
import { groupApi } from '@/api/group'
import { useUserStore } from '@/store/modules/user'
import DepartmentFormDialog from '@/components/department/DepartmentFormDialog.vue'
import GroupFormDialog from '@/components/group/GroupFormDialog.vue'

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

// 获取用户存储
const userStore = useUserStore()

// 判断当前用户是否为管理员
const isAdmin = computed(() => {
  const userRoles = userStore.userInfo.roles || []
  return userRoles.some(role => 
    ['ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(role)
  )
})

// 部门和用户组数据
const departmentOptions = ref([])
const groupOptions = ref([])

// 弹窗控制
const showDepartmentDialog = ref(false)
const showGroupDialog = ref(false)

// 表单数据
const form = ref({
  username: '',
  realName: '',
  email: '',
  phone: '',
  departmentId: null,
  groupIds: [],
  roles: [],
  status: 1,
  password: '',
  requirePasswordChange: false
})

// 加载部门数据
const fetchDepartments = async () => {
  try {
    const response = await departmentApi.getAllDepartments()
    departmentOptions.value = response.data || []
  } catch (error) {
    console.error('加载部门列表失败:', error)
    ElMessage.error('加载部门列表失败')
  }
}

// 加载用户组数据
const fetchGroups = async () => {
  try {
    const response = await groupApi.getAllGroups()
    groupOptions.value = response.data || []
  } catch (error) {
    console.error('加载用户组列表失败:', error)
    ElMessage.error('加载用户组列表失败')
  }
}

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  groupIds: [
    { required: true, message: '请选择用户组', trigger: 'change' },
    { type: 'array', min: 1, message: '请至少选择一个用户组', trigger: 'change' }
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
    realName: '',
    email: '',
    phone: '',
    departmentId: null,
    groupIds: [],
    roles: [],
    status: 1,
    password: '',
    requirePasswordChange: false
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 处理部门创建成功
const handleDepartmentCreated = (newDepartment) => {
  // 关闭弹窗
  showDepartmentDialog.value = false
  // 刷新部门列表
  fetchDepartments()
  // 选中新创建的部门
  form.value.departmentId = newDepartment.id
}

// 处理用户组创建成功
const handleGroupCreated = (newGroup) => {
  // 关闭弹窗
  showGroupDialog.value = false
  // 刷新用户组列表
  fetchGroups()
  // 将新创建的用户组添加到已选中的用户组列表
  form.value.groupIds = [...(form.value.groupIds || []), newGroup.id]
}

// 监听对话框可见性变化
watch(() => dialogVisible.value, (newVal) => {
  if (newVal) {
    // 当对话框显示时，加载部门和用户组数据
    fetchDepartments()
    fetchGroups()
    
    // 重置表单验证
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }
})

// 组件挂载时加载数据
onMounted(() => {
  fetchDepartments()
  fetchGroups()
})

// 监听用户数据变化
watch(() => props.user, (newVal) => {
  if (newVal) {
    form.value = {
      username: newVal.username || '',
      realName: newVal.realName || '',
      email: newVal.email || '',
      phone: newVal.phone || '',
      departmentId: newVal.departmentId || null,
      groupIds: newVal.groupIds || [],
      roles: newVal.roles || [],
      status: newVal.status !== undefined ? newVal.status : 1,
      password: '', // 编辑时不需要密码
      requirePasswordChange: newVal.requirePasswordChange || false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 监听部门选择变化
watch(() => form.value.departmentId, (newVal) => {
  if (newVal === 'create_new') {
    // 重置选择，避免表单值为"create_new"
    form.value.departmentId = null
    // 显示创建部门弹窗
    showDepartmentDialog.value = true
  }
})

// 监听用户组选择变化
watch(() => form.value.groupIds, (newVal) => {
  if (newVal && newVal.includes('create_new')) {
    // 移除"create_new"值
    form.value.groupIds = form.value.groupIds.filter(id => id !== 'create_new')
    // 显示创建用户组弹窗
    showGroupDialog.value = true
  }
})

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
        // 更新用户时只提交允许的字段
        const updateData = {
          realName: formData.realName,
          email: formData.email,
          phone: formData.phone,
          departmentId: formData.departmentId,
          groupIds: formData.groupIds,
          roles: formData.roles,
          status: formData.status,
          requirePasswordChange: formData.requirePasswordChange
        }
        
        // 更新用户
        await userApi.updateUser(props.user.id, updateData)
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
      ElMessage.error(error.response?.data?.message || '保存用户失败')
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

.form-tip {
  font-size: 0.8em;
  color: #909399;
  margin-top: 5px;
}
</style>
