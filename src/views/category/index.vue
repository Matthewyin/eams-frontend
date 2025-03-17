<!-- src/views/category/index.vue -->
<template>
  <div class="category-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新增分类</span>
          </el-button>
        </div>
      </template>

      <el-table :data="categories" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="code" label="分类编码" width="120" />
        <el-table-column prop="assetCount" label="资产数量" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类表单对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
        width="500px"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 分类列表
const categories = ref([
  {
    id: 1,
    name: '电子设备',
    code: 'ELE',
    assetCount: 120,
    createTime: '2023-10-15 10:30:45'
  },
  {
    id: 2,
    name: '办公家具',
    code: 'FUR',
    assetCount: 85,
    createTime: '2023-10-16 14:20:30'
  },
  {
    id: 3,
    name: '运输工具',
    code: 'VEH',
    assetCount: 12,
    createTime: '2023-10-17 09:15:10'
  },
  {
    id: 4,
    name: '办公用品',
    code: 'OFF',
    assetCount: 230,
    createTime: '2023-10-18 16:40:22'
  }
])

const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)
const form = ref({
  id: '',
  name: '',
  code: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[A-Z]{2,10}$/, message: '编码必须为2-10位大写字母', trigger: 'blur' }
  ]
}

// 新增分类
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    id: '',
    name: '',
    code: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description || ''
  }
  dialogVisible.value = true
}

// 删除分类
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该分类吗？删除后将无法恢复！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    categories.value = categories.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加操作
        const newCategory = {
          id: Date.now(),
          name: form.value.name,
          code: form.value.code,
          description: form.value.description,
          assetCount: 0,
          createTime: new Date().toLocaleString()
        }
        categories.value.push(newCategory)
        ElMessage.success('添加成功')
      } else {
        // 模拟编辑操作
        const index = categories.value.findIndex(item => item.id === form.value.id)
        if (index !== -1) {
          categories.value[index] = {
            ...categories.value[index],
            name: form.value.name,
            code: form.value.code,
            description: form.value.description
          }
          ElMessage.success('更新成功')
        }
      }
      dialogVisible.value = false
    } else {
      return false
    }
  })
}

// 初始化
onMounted(() => {
  // 模拟加载数据
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.category-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>