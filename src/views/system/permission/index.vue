<template>
  <div class="permission-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>权限管理</span>
          <el-button v-if="hasPermission('permission:create')" type="primary" @click="handleAddPermission">
            <el-icon><Plus /></el-icon> 新增权限
          </el-button>
        </div>
      </template>
      
      <el-form :inline="true" class="search-form">
        <el-form-item label="权限筛选">
          <el-select v-model="queryParams.permissionType" placeholder="权限类型" clearable>
            <el-option label="菜单" value="menu" />
            <el-option label="按钮/权限" value="permission" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限搜索">
          <el-input v-model="queryParams.query" placeholder="权限名称/代码/路径" @keyup.enter="handleQuery" clearable />
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
      
      <el-table 
        v-loading="loading" 
        :data="permissionList" 
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="permissionName" label="权限名称" min-width="130" />
        <el-table-column prop="permissionCode" label="权限代码" min-width="150" />
        <el-table-column prop="permissionType" label="类型" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.permissionType === 'menu'" type="success">菜单</el-tag>
            <el-tag v-else type="primary">按钮/权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" min-width="150" />
        <el-table-column prop="component" label="组件" min-width="150" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <el-icon v-if="scope.row.icon">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button v-if="hasPermission('permission:create')" link type="primary" @click="handleAddChildPermission(scope.row)">
              <el-icon><Plus /></el-icon> 新增子权限
            </el-button>
            <el-button v-if="hasPermission('permission:update')" link type="primary" @click="handleEditPermission(scope.row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button v-if="hasPermission('permission:delete')" link type="danger" @click="handleDeletePermission(scope.row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="permissionDialog.visible"
      :title="permissionDialog.title"
      width="650px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionRules"
        label-width="120px"
      >
        <el-form-item label="权限类型" prop="permissionType">
          <el-radio-group v-model="permissionForm.permissionType">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="permission">按钮/权限</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="父级权限" prop="parentId">
          <el-tree-select
            v-model="permissionForm.parentId"
            :data="permissionTree"
            node-key="id"
            :props="{ label: 'permissionName', children: 'children' }"
            :disabled="permissionDialog.isEdit"
            default-expand-all
            clearable
            placeholder="请选择父级权限"
          />
        </el-form-item>
        
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="permissionForm.permissionName" placeholder="请输入权限名称" />
        </el-form-item>
        
        <el-form-item label="权限代码" prop="permissionCode">
          <el-input v-model="permissionForm.permissionCode" placeholder="请输入权限代码" />
        </el-form-item>
        
        <el-form-item v-if="permissionForm.permissionType === 'menu'" label="路由路径" prop="path">
          <el-input v-model="permissionForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        
        <el-form-item v-if="permissionForm.permissionType === 'menu'" label="组件路径" prop="component">
          <el-input v-model="permissionForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        
        <el-form-item v-if="permissionForm.permissionType === 'menu'" label="图标" prop="icon">
          <el-input v-model="permissionForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="permissionForm.sortOrder" :min="0" :max="999" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="permissionForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="permissionForm.permissionType === 'menu'" label="是否可见" prop="visible">
          <el-radio-group v-model="permissionForm.visible">
            <el-radio :label="1">可见</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitPermissionForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { permissionApi } from '@/api/permission'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 权限判断
const hasPermission = (permission) => {
  return userStore.hasPermission(permission)
}

// 数据列表
const loading = ref(false)
const permissionList = ref([])
const permissionTree = ref([])
const queryParams = reactive({
  query: '',
  permissionType: '',
  pageNum: 1,
  pageSize: 100
})

// 权限表单对话框
const permissionFormRef = ref(null)
const permissionDialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})
const permissionForm = reactive({
  id: undefined,
  parentId: null,
  permissionName: '',
  permissionCode: '',
  permissionType: 'menu',
  path: '',
  component: '',
  icon: '',
  sortOrder: 0,
  status: 1,
  visible: 1
})
const permissionRules = {
  permissionName: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  permissionCode: [
    { required: true, message: '请输入权限代码', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_:]+$/, message: '只能包含字母、数字、下划线和冒号', trigger: 'blur' }
  ],
  permissionType: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ]
}

// 加载权限列表
const loadPermissionList = async () => {
  loading.value = true
  try {
    const res = await permissionApi.getPermissionTree()
    
    // 如果有查询条件，进行客户端过滤
    if (queryParams.query || queryParams.permissionType) {
      const filterPermissions = (permissions) => {
        return permissions.filter(permission => {
          const matchQuery = !queryParams.query || 
            permission.permissionName.includes(queryParams.query) || 
            permission.permissionCode.includes(queryParams.query) ||
            (permission.path && permission.path.includes(queryParams.query))
          
          const matchType = !queryParams.permissionType || 
            permission.permissionType === queryParams.permissionType
          
          const hasMatchingChildren = permission.children && permission.children.length > 0
            ? filterPermissions(permission.children).length > 0
            : false
          
          return (matchQuery && matchType) || hasMatchingChildren
        }).map(permission => {
          if (permission.children && permission.children.length > 0) {
            return {
              ...permission,
              children: filterPermissions(permission.children)
            }
          }
          return permission
        })
      }
      
      permissionList.value = filterPermissions(res)
    } else {
      permissionList.value = res
    }
  } catch (error) {
    console.error('Failed to load permissions:', error)
    ElMessage.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// 加载权限树(用于选择父权限)
const loadPermissionTreeForSelect = async () => {
  try {
    const res = await permissionApi.getPermissionTree()
    // 添加一个根节点表示顶级权限
    permissionTree.value = [
      {
        id: 0,
        permissionName: '顶级权限',
        permissionCode: 'root',
        children: res
      }
    ]
  } catch (error) {
    console.error('Failed to load permission tree:', error)
    ElMessage.error('获取权限树失败')
  }
}

// 查询操作
const handleQuery = () => {
  loadPermissionList()
}

// 重置查询
const resetQuery = () => {
  queryParams.query = ''
  queryParams.permissionType = ''
  loadPermissionList()
}

// 新增权限
const handleAddPermission = () => {
  permissionDialog.title = '新增权限'
  permissionDialog.isEdit = false
  resetPermissionForm()
  permissionDialog.visible = true
}

// 新增子权限
const handleAddChildPermission = (row) => {
  permissionDialog.title = '新增子权限'
  permissionDialog.isEdit = false
  resetPermissionForm()
  
  // 设置父ID
  permissionForm.parentId = row.id
  
  // 如果父级是菜单，子权限默认也是菜单
  if (row.permissionType === 'menu') {
    permissionForm.permissionType = 'menu'
  }
  
  permissionDialog.visible = true
}

// 编辑权限
const handleEditPermission = (row) => {
  permissionDialog.title = '编辑权限'
  permissionDialog.isEdit = true
  resetPermissionForm()
  
  // 填充表单数据
  Object.assign(permissionForm, row)
  
  permissionDialog.visible = true
}

// 删除权限
const handleDeletePermission = (row) => {
  // 检查是否有子权限
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该权限下有子权限，请先删除子权限')
    return
  }
  
  ElMessageBox.confirm(`确认删除权限"${row.permissionName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await permissionApi.deletePermission(row.id)
      ElMessage.success('删除成功')
      loadPermissionList()
    } catch (error) {
      console.error('Failed to delete permission:', error)
      ElMessage.error('删除失败：' + error.message)
    }
  }).catch(() => {})
}

// 重置权限表单
const resetPermissionForm = () => {
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  permissionForm.id = undefined
  permissionForm.parentId = null
  permissionForm.permissionName = ''
  permissionForm.permissionCode = ''
  permissionForm.permissionType = 'menu'
  permissionForm.path = ''
  permissionForm.component = ''
  permissionForm.icon = ''
  permissionForm.sortOrder = 0
  permissionForm.status = 1
  permissionForm.visible = 1
}

// 提交权限表单
const submitPermissionForm = async () => {
  permissionFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 如果是按钮权限，清空路由相关字段
        if (permissionForm.permissionType === 'permission') {
          permissionForm.path = ''
          permissionForm.component = ''
          permissionForm.icon = ''
          permissionForm.visible = 1
        }
        
        // 如果父级ID为0或null，则设置为顶级权限
        if (permissionForm.parentId === 0 || permissionForm.parentId === null) {
          permissionForm.parentId = null
        }
        
        if (permissionForm.id) {
          // 更新
          await permissionApi.updatePermission(permissionForm.id, permissionForm)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await permissionApi.createPermission(permissionForm)
          ElMessage.success('新增成功')
        }
        
        permissionDialog.visible = false
        loadPermissionList()
        loadPermissionTreeForSelect() // 重新加载权限树
      } catch (error) {
        console.error('Failed to save permission:', error)
        ElMessage.error('保存失败：' + error.message)
      }
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  loadPermissionList()
  loadPermissionTreeForSelect()
})
</script>

<style scoped>
.permission-management {
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
</style> 