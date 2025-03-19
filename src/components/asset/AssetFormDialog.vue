<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增资产' : '编辑资产'"
    width="600px"
    destroy-on-close
    @closed="handleClosed"
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

      <!-- 分类管理功能已移除，待后续开发 -->

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
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAssetStore } from '@/store/modules/asset'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'add'
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  // categories prop removed - to be implemented later
  departments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const assetStore = useAssetStore()
const visible = ref(props.modelValue)
const formRef = ref(null)
const loading = ref(false)

// 表单数据
const form = ref({
  id: '',
  name: '',
  code: '',
  // categoryId: '', // removed - to be implemented later
  departmentId: '',
  purchaseDate: new Date(),
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
  // categoryId validation removed - to be implemented later
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

// 监听对话框可见性
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听对话框内部可见性变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 监听初始数据变化
watch(() => props.initialData, (val) => {
  if (Object.keys(val).length > 0) {
    form.value = { ...val }
  } else {
    // 重置表单
    form.value = {
      id: '',
      name: '',
      code: '',
      // categoryId: '', // removed - to be implemented later
      departmentId: '',
      purchaseDate: new Date(),
      price: 0,
      status: 'IN_USE',
      remark: ''
    }
  }
}, { immediate: true, deep: true })

// 提交表单
const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (props.type === 'add') {
          await assetStore.createAsset(form.value)
          ElMessage.success('新增成功')
        } else {
          await assetStore.updateAsset(form.value.id, form.value)
          ElMessage.success('更新成功')
        }
        visible.value = false
        emit('success')
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 对话框关闭时重置表单
const handleClosed = () => {
  formRef.value?.resetFields()
}
</script>
