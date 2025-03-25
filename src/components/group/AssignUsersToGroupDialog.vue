<template>
  <el-dialog
    v-model="visible"
    :title="`分配用户到 ${group.name}`"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <div class="assign-users-container">
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、姓名或邮箱"
          clearable
          @clear="fetchAvailableUsers"
          @keyup.enter="fetchAvailableUsers"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="fetchAvailableUsers">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="departmentName" label="部门" width="140" />
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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignUsers" :loading="submitting" :disabled="selectedUsers.length === 0">
          确定分配
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { groupApi } from '@/api/group'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  group: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'success'])

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 用户列表
const userList = ref([])
const selectedUsers = ref([])
const searchQuery = ref('')

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取可分配的用户
const fetchAvailableUsers = async () => {
  if (!props.group || !props.group.id) {
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize,
      query: searchQuery.value
    }
    
    // 获取所有用户
    const res = await userApi.getUsers(params)
    if (res.data && res.data.success) {
      userList.value = res.data.data.content
      pagination.total = res.data.data.totalElements
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  fetchAvailableUsers()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchAvailableUsers()
}

// 处理分配用户
const handleAssignUsers = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要分配的用户')
    return
  }

  submitting.value = true
  try {
    const userIds = selectedUsers.value.map(user => user.id)
    
    // 调用API将用户分配到用户组
    const res = await groupApi.addUsersToGroup(props.group.id, { userIds })
    
    if (res.data && res.data.success) {
      ElMessage.success('用户分配成功')
      emit('success')
      emit('update:visible', false)
    }
  } catch (error) {
    console.error('分配用户失败:', error)
    ElMessage.error('分配用户失败')
  } finally {
    submitting.value = false
  }
}

// 监听对话框可见性变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.group && props.group.id) {
      // 打开对话框时加载用户
      fetchAvailableUsers()
      // 重置选择
      selectedUsers.value = []
    }
  },
  { immediate: true }
)

// 监听用户组变化
watch(
  () => props.group,
  (newVal) => {
    if (props.visible && newVal && newVal.id) {
      // 用户组变化时重新加载用户
      fetchAvailableUsers()
      // 重置选择
      selectedUsers.value = []
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
.assign-users-container {
  min-height: 300px;
}

.search-area {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
