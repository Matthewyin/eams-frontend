import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assetApi } from '@/api/asset'

export const useAssetStore = defineStore('asset', () => {
    // 资产列表
    const assetList = ref([])
    const total = ref(0)
    const loading = ref(false)

    // 查询参数
    const queryParams = ref({
        page: 1,
        pageSize: 10,
        keyword: '',
        // categoryId: '', // 分类管理功能已移除
        departmentId: '',
        status: '',
        sortBy: 'createTime',
        sortOrder: 'descending'
    })

    // 分类管理功能已移除，待后续开发
    // const categories = ref([])
    // const categoriesLoading = ref(false)

    // 部门列表
    const departments = ref([])
    const departmentsLoading = ref(false)

    // 获取资产列表
    const fetchAssets = async () => {
        loading.value = true
        try {
            const res = await assetApi.getAssets(queryParams.value)
            if (res && res.data) {
                assetList.value = res.data
                total.value = res.total
            } else {
                assetList.value = []
                total.value = 0
            }
            return res
        } catch (error) {
            console.error('获取资产列表失败:', error)
            assetList.value = []
            total.value = 0
            throw error
        } finally {
            loading.value = false
        }
    }

    // 获取资产详情
    const fetchAssetById = async (id) => {
        try {
            const res = await assetApi.getAssetById(id)
            return res
        } catch (error) {
            console.error('获取资产详情失败:', error)
            throw error
        }
    }

    // 创建资产
    const createAsset = async (data) => {
        try {
            const res = await assetApi.createAsset(data)
            // 刷新列表
            await fetchAssets()
            return res
        } catch (error) {
            console.error('创建资产失败:', error)
            throw error
        }
    }

    // 更新资产
    const updateAsset = async (id, data) => {
        try {
            const res = await assetApi.updateAsset(id, data)
            // 刷新列表
            await fetchAssets()
            return res
        } catch (error) {
            console.error('更新资产失败:', error)
            throw error
        }
    }

    // 删除资产
    const deleteAsset = async (id) => {
        try {
            const res = await assetApi.deleteAsset(id)
            // 刷新列表
            await fetchAssets()
            return res
        } catch (error) {
            console.error('删除资产失败:', error)
            throw error
        }
    }

    // 批量删除资产
    const batchDeleteAssets = async (ids) => {
        try {
            const res = await assetApi.batchDeleteAssets(ids)
            // 刷新列表
            await fetchAssets()
            return res
        } catch (error) {
            console.error('批量删除资产失败:', error)
            throw error
        }
    }

    // 分类管理功能已移除，待后续开发
    // const fetchCategories = async () => {
    //     // 分类获取功能已移除
    // }

    // 获取部门列表
    const fetchDepartments = async () => {
        departmentsLoading.value = true
        try {
            const res = await assetApi.getDepartments()
            if (res) {
                departments.value = res
            } else {
                departments.value = []
            }
            return departments.value
        } catch (error) {
            console.error('获取部门列表失败:', error)
            departments.value = []
            throw error
        } finally {
            departmentsLoading.value = false
        }
    }

    // 设置查询参数
    const setQueryParam = (key, value) => {
        queryParams.value[key] = value
        // 修改查询参数时重置页码
        if (key !== 'page') {
            queryParams.value.page = 1
        }
    }

    // 重置查询参数
    const resetQueryParams = () => {
        queryParams.value = {
            page: 1,
            pageSize: 10,
            keyword: '',
            // categoryId: '', // 分类管理功能已移除
            departmentId: '',
            status: '',
            sortBy: 'createTime',
            sortOrder: 'descending'
        }
    }

    return {
        assetList,
        total,
        loading,
        queryParams,
        // categories, // 分类管理功能已移除
        // categoriesLoading, // 分类管理功能已移除
        departments,
        departmentsLoading,
        fetchAssets,
        fetchAssetById,
        createAsset,
        updateAsset,
        deleteAsset,
        batchDeleteAssets,
        // fetchCategories, // 分类管理功能已移除
        fetchDepartments,
        setQueryParam,
        resetQueryParams
    }
})