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
    <table-toolbar :columns="columns" @refresh="fetchAssets" @size-change="handleSizeChange"
                   @column-change="handleColumnChange">
      <template #left>
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus/>
          </el-icon>
          <span>新增</span>
        </el-button>

        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <el-icon>
            <Delete/>
          </el-icon>
          <span>批量删除</span>
        </el-button>

        <el-button @click="handleExport">
          <el-icon>
            <Download/>
          </el-icon>
          <span>导出</span>
        </el-button>
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
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
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

    <!-- 资产表单对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增资产' : '编辑资产'"
        width="600px"
        destroy-on-close
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资产名称"/>
        </el-form-item>

        <el-form-item label="资产编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入资产编号"/>
        </el-form-item>

        <el-form-item label="资产分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择资产分类">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择所属部门">
            <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="购入日期" prop="purchaseDate">
          <el-date-picker
              v-model="form.purchaseDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number
              v-model="form.price"
              :precision="2"
              :step="0.01"
              :min="0"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="在用" value="IN_USE"/>
            <el-option label="闲置" value="IDLE"/>
            <el-option label="维修" value="REPAIRING"/>
            <el-option label="报废" value="DISCARDED"/>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAssetStore} from '@/store/modules/asset'
import {useAppStore} from '@/store/modules/app'
import {ElMessage, ElMessageBox} from 'element-plus'
import SearchForm from '@/components/common/SearchForm.vue'
import TableToolbar from '@/components/common/TableToolbar.vue'
import {fileApi} from '@/api/file'


const router = useRouter()
const assetStore = useAssetStore()
const appStore = useAppStore()

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
const visibleColumns = computed(() => {
  return columns.value.filter(col => col.visible)
})

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
const formRef = ref(null)
const submitLoading = ref(false)
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

// 表单验证规则
const rules = {
  name: [
    {required: true, message: '请输入资产名称', trigger: 'blur'},
    {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
  ],
  code: [
    {required: true, message: '请输入资产编号', trigger: 'blur'}
  ],
  categoryId: [
    {required: true, message: '请选择资产分类', trigger: 'change'}
  ],
  departmentId: [
    {required: true, message: '请选择所属部门', trigger: 'change'}
  ],
  purchaseDate: [
    {required: true, message: '请选择购入日期', trigger: 'change'}
  ],
  status: [
    {required: true, message: '请选择状态', trigger: 'change'}
  ]
}

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
  }).catch(() => {
  })
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
  }).catch(() => {
  })
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

// 提交表单
const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (dialogType.value === 'add') {
          await assetStore.createAsset(form.value)
          ElMessage.success('新增成功')
        } else {
          await assetStore.updateAsset(form.value.id, form.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    } else {
      return false
    }
  })
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
  // 保存列配置
  localStorage.setItem('assetColumns', JSON.stringify(columns.value))
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'IN_USE': 'success',
    'IDLE': 'info',
    'REPAIRING': 'warning',
    'DISCARDED': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'IN_USE': '在用',
    'IDLE': '闲置',
    'REPAIRING': '维修',
    'DISCARDED': '报废'
  }
  return statusMap[status] || '未知'
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

