<template>
  <div class="role-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button v-if="hasPermission('role:create')" type="primary" @click="handleAddRole">
            <el-icon><Plus /></el-icon> 新增角色
          </el-button>
        </div>
      </template>
      
      <el-form :inline="true" class="search-form">
        <el-form-item label="角色搜索">
          <el-input v-model="queryParams.query" placeholder="角色名称/代码/描述" @keyup.enter="handleQuery" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="roleList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="roleCode" label="角色代码" width="120" />
        <el-table-column prop="roleName" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="userCount" label="用户数" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.createdTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button v-if="hasPermission('role:permission')" link type="primary" @click="handleRolePermission(scope.row)">
              <el-icon><Setting /></el-icon> 权限设置
            </el-button>
            <el-button v-if="hasPermission('role:update')" link type="primary" @click="handleEditRole(scope.row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button v-if="hasPermission('role:delete') && scope.row.canDelete === 1" link type="danger" @click="handleDeleteRole(scope.row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="roleDialog.visible"
      :title="roleDialog.title"
      width="600px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色代码" :disabled="roleForm.id !== undefined && roleForm.roleCode === 'superadmin'" />
        </el-form-item>
        <el-form-item label="角色排序" prop="sortOrder">
          <el-input-number v-model="roleForm.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 角色权限对话框 -->
    <el-dialog
      v-model="permissionDialog.visible"
      title="权限分配"
      width="600px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <span>{{ permissionDialog.roleName }}</span>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTree"
            :props="{ label: 'permissionName', children: 'children' }"
            show-checkbox
            node-key="id"
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitRolePermissions">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus, Search, Refresh, Edit, Delete, Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roleApi } from '@/api/role'
import { permissionApi } from '@/api/permission'
import { formatDateTime } from '@/utils/format'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()

// 权限判断
const hasPermission = (permission) => {
  return userStore.hasPermission(permission)
}

// 数据列表
const loading = ref(false)
const roleList = ref([])
const total = ref(0)
const queryParams = reactive({
  query: '',
  pageNum: 1,
  pageSize: 10
})

// 角色表单对话框
const roleFormRef = ref(null)
const roleDialog = reactive({
  visible: false,
  title: ''
})
const roleForm = reactive({
  id: undefined,
  roleName: '',
  roleCode: '',
  description: '',
  status: 1,
  sortOrder: 0
})
const roleRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ]
}

// 权限设置对话框
const permissionTreeRef = ref(null)
const permissionTree = ref([])
const permissionDialog = reactive({
  visible: false,
  roleId: undefined,
  roleName: ''
})

// 加载角色列表
const loadRoleList = async () => {
  loading.value = true
  try {
    const res = await roleApi.getRoles({
      query: queryParams.query,
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize
    })
    roleList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to load role list:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 加载权限树
const loadPermissionTree = async () => {
  try {
    const res = await permissionApi.getPermissionTree()
    permissionTree.value = res
  } catch (error) {
    console.error('Failed to load permission tree:', error)
    ElMessage.error('获取权限树失败')
  }
}

// 查询角色权限
const loadRolePermissions = async (roleId) => {
  try {
    const res = await permissionApi.getRolePermissions(roleId)
    nextTick(() => {
      // 设置选中的权限节点
      permissionTreeRef.value.setCheckedKeys(res)
    })
  } catch (error) {
    console.error('Failed to load role permissions:', error)
    ElMessage.error('获取角色权限失败')
  }
}

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1
  loadRoleList()
}

// 重置查询
const resetQuery = () => {
  queryParams.query = ''
  handleQuery()
}

// 页码改变
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  loadRoleList()
}

// 页数改变
const handleCurrentChange = (page) => {
  queryParams.pageNum = page
  loadRoleList()
}

// 新增角色
const handleAddRole = () => {
  roleDialog.title = '新增角色'
  resetRoleForm()
  roleDialog.visible = true
}

// 编辑角色
const handleEditRole = (row) => {
  roleDialog.title = '编辑角色'
  resetRoleForm()
  // 填充表单数据
  Object.assign(roleForm, row)
  roleDialog.visible = true
}

// 删除角色
const handleDeleteRole = (row) => {
  ElMessageBox.confirm(`确认删除角色"${row.roleName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await roleApi.deleteRole(row.id)
      ElMessage.success('删除成功')
      loadRoleList()
    } catch (error) {
      console.error('Failed to delete role:', error)
      ElMessage.error('删除失败：' + error.message)
    }
  }).catch(() => {})
}

// 权限设置
const handleRolePermission = (row) => {
  permissionDialog.roleId = row.id
  permissionDialog.roleName = row.roleName
  permissionDialog.visible = true
  // 加载该角色的权限
  loadRolePermissions(row.id)
}

// 重置角色表单
const resetRoleForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
  roleForm.id = undefined
  roleForm.roleName = ''
  roleForm.roleCode = ''
  roleForm.description = ''
  roleForm.status = 1
  roleForm.sortOrder = 0
}

// 提交角色表单
const submitRoleForm = async () => {
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (roleForm.id) {
          // 更新
          await roleApi.updateRole(roleForm.id, roleForm)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await roleApi.createRole(roleForm)
          ElMessage.success('新增成功')
        }
        roleDialog.visible = false
        loadRoleList()
      } catch (error) {
        console.error('Failed to save role:', error)
        ElMessage.error('保存失败：' + error.message)
      }
    }
  })
}

// 提交角色权限
const submitRolePermissions = async () => {
  try {
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allKeys = [...checkedKeys, ...halfCheckedKeys]
    
    await permissionApi.assignRolePermissions(permissionDialog.roleId, allKeys)
    ElMessage.success('权限分配成功')
    permissionDialog.visible = false
  } catch (error) {
    console.error('Failed to assign permissions:', error)
    ElMessage.error('分配权限失败：' + error.message)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadRoleList()
  loadPermissionTree()
})
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 