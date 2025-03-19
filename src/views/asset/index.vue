<template>
  <div class="asset-page">
    <!-- 搜索表单 -->
    <search-form :model="queryParams" @search="handleSearch" @reset="handleReset">
      <el-form-item label="关键词">
        <el-input v-model="queryParams.keyword" placeholder="资产名称/编号/序列号" clearable/>
      </el-form-item>

      <el-form-item label="资产分类">
        <el-select v-model="queryParams.categoryId" placeholder="请选择" clearable>
          <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属部门">
        <el-select v-model="queryParams.departmentId" placeholder="请选择" clearable>
          <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option label="在用" value="IN_USE"/>
          <el-option label="闲置" value="IDLE"/>
          <el-option label="维修" value="REPAIRING"/>
          <el-option label="报废" value="DISCARDED"/>
        </el-select>
      </el-form-item>
    </search-form>

    <!-- 表格工具栏 -->
    <table-toolbar :columns="columns" @refresh="handleSearch" @size-change="handleSizeChange"
                   @column-change="handleColumnChange">
      <template #left>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus/></el-icon>
          <span>新增</span>
        </el-button>

        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <el-icon><Delete/></el-icon>
          <span>批量删除</span>
        </el-button>

        <el-button @click="handleExport">
          <el-icon><Download/></el-icon>
          <span>导出</span>
        </el-button>
        
        <!-- 文件导入按钮 -->
        <el-dropdown @command="handleImportCommand">
          <el-button>
            <el-icon><Upload/></el-icon>
            <span>导入</span>
            <el-icon class="el-icon--right"><ArrowDown/></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="import">导入资产</el-dropdown-item>
              <el-dropdown-item command="template">下载模板</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </table-toolbar>

    <!-- 资产表格 -->
    <el-table
        v-loading="loading"
        :data="assetList"
        :size="tableDensity"
        border
        stripe
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55"/>

      <el-table-column v-for="col in visibleColumns" :key="col.prop"
                       :prop="col.prop"
                       :label="col.label"
                       :width="col.width"
                       :sortable="col.sortable"
                       :show-overflow-tooltip="true"
      >
        <template #default="scope" v-if="col.slot">
          <template v-if="col.prop === 'status'">
            <el-tag :type="statusMap[scope.row.status].type">
              {{ statusMap[scope.row.status].text }}
            </el-tag>
          </template>

          <template v-else-if="col.prop === 'actions'">
            <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 使用资产表单对话框组件 -->
    <asset-form-dialog
      v-model="dialogVisible"
      :type="dialogType"
      :initial-data="form"
      :categories="categories"
      :departments="departments"
      @success="handleFormSuccess"
    />

    <!-- 使用导入对话框组件 -->
    <import-dialog
      v-model="importDialogVisible"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fileApi } from '@/api/file'
import { useAssetStore } from '@/store/modules/asset'
import { useAppStore } from '@/store/modules/app'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchForm from '@/components/common/SearchForm.vue'
import TableToolbar from '@/components/common/TableToolbar.vue'
import AssetFormDialog from '@/components/asset/AssetFormDialog.vue'
import ImportDialog from '@/components/asset/ImportDialog.vue'
import {
  Plus,
  Delete,
  Download,
  Upload,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()
const assetStore = useAssetStore()
const appStore = useAppStore()

// 状态映射
const statusMap = {
  'IN_USE': { text: '在用', type: 'success' },
  'IDLE': { text: '闲置', type: 'info' },
  'REPAIRING': { text: '维修', type: 'warning' },
  'DISCARDED': { text: '报废', type: 'danger' }
}

// 表格列配置
const columns = ref([
  {prop: 'code', label: '资产编号', width: '120', sortable: true, visible: true},
  {prop: 'name', label: '资产名称', width: '', sortable: false, visible: true},
  {prop: 'categoryName', label: '资产分类', width: '120', sortable: false, visible: true},
  {prop: 'departmentName', label: '所属部门', width: '120', sortable: false, visible: true},
  {prop: 'status', label: '状态', width: '100', sortable: false, visible: true, slot: true},
  {prop: 'purchaseDate', label: '购入日期', width: '120', sortable: true, visible: true},
  {prop: 'price', label: '价格', width: '120', sortable: true, visible: true},
  {prop: 'createTime', label: '创建时间', width: '180', sortable: true, visible: true},
  {prop: 'actions', label: '操作', width: '180', sortable: false, visible: true, slot: true}
])

// 可见列
const visibleColumns = computed(() => columns.value.filter(col => col.visible))

// 表格密度
const tableDensity = computed(() => appStore.tableDensity)

// 从store获取数据
const assetList = computed(() => assetStore.assetList)
const total = computed(() => assetStore.total)
const loading = computed(() => assetStore.loading)
const queryParams = computed(() => assetStore.queryParams)
const categories = computed(() => assetStore.categories)
const departments = computed(() => assetStore.departments)

// 选中行
const selectedRows = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const form = ref({
  id: '',
  name: '',
  code: '',
  categoryId: '',
  departmentId: '',
  purchaseDate: '',
  price: 0,
  status: 'IN_USE',
  remark: ''
})

// 导入对话框
const importDialogVisible = ref(false)

// 搜索
const handleSearch = () => {
  assetStore.fetchAssets()
}

// 重置
const handleReset = () => {
  assetStore.resetQueryParams()
  assetStore.fetchAssets()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    id: '',
    name: '',
    code: '',
    categoryId: '',
    departmentId: '',
    purchaseDate: new Date(),
    price: 0,
    status: 'IN_USE',
    remark: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = {
    id: row.id,
    name: row.name,
    code: row.code,
    categoryId: row.categoryId,
    departmentId: row.departmentId,
    purchaseDate: row.purchaseDate,
    price: row.price,
    status: row.status,
    remark: row.remark
  }
  dialogVisible.value = true
}

// 表单提交成功
const handleFormSuccess = () => {
  assetStore.fetchAssets()
}

// 导入成功
const handleImportSuccess = () => {
  assetStore.fetchAssets()
}

// 查看
const handleView = (row) => {
  router.push(`/asset/${row.id}`)
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该资产吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await assetStore.deleteAsset(row.id)
      ElMessage.success('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的资产')
    return
  }

  const ids = selectedRows.value.map(row => row.id)

  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 项资产吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await assetStore.batchDeleteAssets(ids)
      ElMessage.success('批量删除成功')
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }).catch(() => {})
}

// 导出
const handleExport = async () => {
  try {
    await fileApi.exportExcel(queryParams.value)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 处理导入命令
const handleImportCommand = (command) => {
  if (command === 'import') {
    importDialogVisible.value = true
  } else if (command === 'template') {
    downloadTemplate('asset')
  }
}

// 下载模板
const downloadTemplate = async (templateType) => {
  try {
    ElMessage({
      type: 'info',
      message: '正在准备下载模板...',
      duration: 2000
    })
    
    const response = await fetch(`/api/templates/${templateType}`)
    if (!response.ok) {
      throw new Error('模板下载失败')
    }
    
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${templateType}_导入模板.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
    
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error(`模板下载失败: ${error.message || '未知错误'}`)
  }
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = ({prop, order}) => {
  if (prop && order) {
    assetStore.setQueryParam('sortBy', prop)
    assetStore.setQueryParam('sortOrder', order)
  } else {
    assetStore.setQueryParam('sortBy', 'createTime')
    assetStore.setQueryParam('sortOrder', 'descending')
  }
  assetStore.fetchAssets()
}

// 页码变化
const handleCurrentChange = (page) => {
  assetStore.setQueryParam('page', page)
  assetStore.fetchAssets()
}

// 每页条数变化
const handlePageSizeChange = (pageSize) => {
  assetStore.setQueryParam('pageSize', pageSize)
  assetStore.fetchAssets()
}

// 表格密度变化
const handleSizeChange = (size) => {
  appStore.setTableDensity(size)
}

// 列变化
const handleColumnChange = () => {
  localStorage.setItem('assetColumns', JSON.stringify(columns.value))
}

// 初始化
onMounted(async () => {
  // 加载本地保存的列配置
  const savedColumns = localStorage.getItem('assetColumns')
  if (savedColumns) {
    columns.value = JSON.parse(savedColumns)
  }

  // 获取分类和部门
  await assetStore.fetchCategories()
  await assetStore.fetchDepartments()

  // 获取资产列表
  await assetStore.fetchAssets()
})
</script>

<style scoped>
.asset-page {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>