<template>
  <el-dialog
    v-model="visible"
    :title="`${department.name} - 部门用户`"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <div class="department-users-container">
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
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
  }
})

// 定义事件
const emit = defineEmits(['update:visible'])

// 加载状态
const loading = ref(false)

// 用户列表
const userList = ref([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取部门用户
const fetchDepartmentUsers = async () => {
  if (!props.department || !props.department.id) {
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize
    }
    
    const res = await departmentApi.getDepartmentUsers(props.department.id, params)
    if (res.data && res.data.success) {
      userList.value = res.data.data.content
      pagination.total = res.data.data.totalElements
    }
  } catch (error) {
    console.error('获取部门用户失败:', error)
    ElMessage.error('获取部门用户失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  fetchDepartmentUsers()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchDepartmentUsers()
}

// 监听对话框可见性变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.department && props.department.id) {
      // 打开对话框时加载部门用户
      fetchDepartmentUsers()
    }
  },
  { immediate: true }
)

// 监听部门变化
watch(
  () => props.department,
  (newVal) => {
    if (props.visible && newVal && newVal.id) {
      // 部门变化时重新加载用户
      fetchDepartmentUsers()
    }
  },
  { deep: true }
)

// 同步visible属性
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
</script>

<style scoped>
.department-users-container {
  min-height: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
