<!-- src/views/asset/detail.vue -->
<template>
  <div class="asset-detail-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>资产详情</span>
          <div>
            <el-button @click="goBack">返回</el-button>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border v-loading="loading">
        <el-descriptions-item label="资产名称">{{ asset.name }}</el-descriptions-item>
        <el-descriptions-item label="资产编号">{{ asset.code }}</el-descriptions-item>
        <el-descriptions-item label="资产分类">{{ asset.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ asset.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(asset.status)">
            {{ getStatusText(asset.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="购入日期">{{ asset.purchaseDate }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ asset.price }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ asset.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ asset.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ asset.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 资产历史记录 -->
      <div class="history-section" v-if="assetHistory.length > 0">
        <h3>操作历史</h3>
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in assetHistory"
              :key="index"
              :timestamp="activity.time"
              :type="getTimelineItemType(activity.type)"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssetStore } from '@/store/modules/asset'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const assetStore = useAssetStore()

const assetId = route.params.id
const loading = ref(true)
const asset = ref({})
const assetHistory = ref([])

// 获取资产详情
const fetchAssetDetail = async () => {
  loading.value = true
  try {
    const res = await assetStore.fetchAssetById(assetId)
    asset.value = res

    // 模拟获取资产历史记录
    assetHistory.value = [
      {
        time: '2023-11-20 10:30:45',
        type: 'create',
        content: '创建资产'
      },
      {
        time: '2023-11-21 14:20:30',
        type: 'update',
        content: '更新资产信息：价格从 1200 修改为 1500'
      },
      {
        time: '2023-11-25 09:15:10',
        type: 'status',
        content: '状态变更：从 在用 变更为 维修'
      },
      {
        time: '2023-12-05 16:40:22',
        type: 'status',
        content: '状态变更：从 维修 变更为 在用'
      }
    ]
  } catch (error) {
    console.error('获取资产详情失败:', error)
    ElMessage.error('获取资产详情失败')
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 编辑资产
const handleEdit = () => {
  // 跳转到资产列表页并打开编辑对话框
  router.push({
    path: '/asset',
    query: { edit: assetId }
  })
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

// 获取时间线项目类型
const getTimelineItemType = (type) => {
  const typeMap = {
    'create': 'success',
    'update': 'primary',
    'status': 'warning',
    'delete': 'danger'
  }
  return typeMap[type] || 'info'
}

// 初始化
onMounted(() => {
  fetchAssetDetail()
})
</script>

<style scoped>
.asset-detail-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-section {
  margin-top: 30px;
}
</style>