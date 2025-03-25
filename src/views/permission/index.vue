<template>
  <div class="permission-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>权限管理</h3>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="用户权限编码" name="permissionCodes">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="用户ID">
                <el-input v-model="userId" placeholder="请输入用户ID" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="fetchUserPermissionCodes" :loading="loadingCodes">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div v-if="permissionCodes.length > 0" class="permission-codes-container">
            <h4>用户权限编码列表</h4>
            <el-table :data="permissionCodes" border style="width: 100%">
              <el-table-column prop="index" label="#" width="60">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="权限编码" />
            </el-table>
          </div>
          <el-empty v-else-if="!loadingCodes && userIdQueried" description="暂无权限编码数据" />
        </el-tab-pane>
        
        <el-tab-pane label="用户菜单" name="userMenus">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="用户ID">
                <el-input v-model="userId" placeholder="请输入用户ID" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="fetchUserMenus" :loading="loadingMenus">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div v-if="userMenus.length > 0" class="user-menus-container">
            <h4>用户菜单列表</h4>
            <el-tree
              :data="userMenus"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-tag v-if="data.path" size="small">{{ data.path }}</el-tag>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
          <el-empty v-else-if="!loadingMenus && userIdQueried" description="暂无菜单数据" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { permissionApi } from '@/api/permission'

// 当前激活的标签页
const activeTab = ref('permissionCodes')

// 用户ID
const userId = ref('')

// 是否已查询过用户ID
const userIdQueried = ref(false)

// 加载状态
const loadingCodes = ref(false)
const loadingMenus = ref(false)

// 权限编码列表
const permissionCodes = ref([])

// 用户菜单列表
const userMenus = ref([])

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 获取用户权限编码
const fetchUserPermissionCodes = async () => {
  if (!userId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  
  loadingCodes.value = true
  userIdQueried.value = true
  
  try {
    const response = await permissionApi.getUserPermissionCodes(userId.value)
    if (response.data && response.data.data) {
      // 将字符串数组转换为对象数组，以便表格显示
      permissionCodes.value = response.data.data.map(code => ({ code }))
      ElMessage.success(response.data.message || '获取用户权限编码成功')
    } else {
      permissionCodes.value = []
      ElMessage.warning('未获取到权限编码数据')
    }
  } catch (error) {
    console.error('获取用户权限编码失败:', error)
    ElMessage.error('获取用户权限编码失败')
    permissionCodes.value = []
  } finally {
    loadingCodes.value = false
  }
}

// 获取用户菜单
const fetchUserMenus = async () => {
  if (!userId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  
  loadingMenus.value = true
  userIdQueried.value = true
  
  try {
    const response = await permissionApi.getUserMenus(userId.value)
    if (response.data && response.data.data) {
      userMenus.value = response.data.data
      ElMessage.success(response.data.message || '获取用户菜单成功')
    } else {
      userMenus.value = []
      ElMessage.warning('未获取到菜单数据')
    }
  } catch (error) {
    console.error('获取用户菜单失败:', error)
    ElMessage.error('获取用户菜单失败')
    userMenus.value = []
  } finally {
    loadingMenus.value = false
  }
}
</script>

<style scoped>
.permission-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.permission-codes-container,
.user-menus-container {
  margin-top: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
