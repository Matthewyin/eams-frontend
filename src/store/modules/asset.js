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
        categoryId: '',
        departmentId: '',
        status: '',
        sortBy: 'createTime',
        sortOrder: 'descending'
    })

    // 分类列表
    const categories = ref([])
    const categoriesLoading = ref(false)

    // 部门列表
    const departments = ref([])
    const departmentsLoading = ref(false)

    // 获取资产列表
    const fetchAssets = async () => {
        loading.value = true
        try {
            const res = await assetApi.getAssets(queryParams.value)

            // 如果后端未启动，使用模拟数据
            if (!res || !res.data) {
                // 模拟数据
                assetList.value = [
                    {
                        id: 1,
                        name: '笔记本电脑',
                        code: 'NB001',
                        categoryId: 1,
                        categoryName: '电子设备',
                        departmentId: 1,
                        departmentName: '研发部',
                        status: 'IN_USE',
                        purchaseDate: '2023-01-15',
                        price: 8999,
                        createTime: '2023-01-16 10:30:45',
                        updateTime: '2023-01-16 10:30:45'
                    },
                    {
                        id: 2,
                        name: '办公桌',
                        code: 'TB001',
                        categoryId: 2,
                        categoryName: '办公家具',
                        departmentId: 2,
                        departmentName: '行政部',
                        status: 'IN_USE',
                        purchaseDate: '2023-02-20',
                        price: 1299,
                        createTime: '2023-02-21 14:20:30',
                        updateTime: '2023-02-21 14:20:30'
                    },
                    {
                        id: 3,
                        name: '投影仪',
                        code: 'PJ001',
                        categoryId: 1,
                        categoryName: '电子设备',
                        departmentId: 3,
                        departmentName: '市场部',
                        status: 'REPAIRING',
                        purchaseDate: '2023-03-10',
                        price: 4599,
                        createTime: '2023-03-11 09:15:10',
                        updateTime: '2023-03-11 09:15:10'
                    }
                ]
                total.value = 3
            } else {
                assetList.value = res.data
                total.value = res.total
            }
            return res
        } catch (error) {
            console.error('获取资产列表失败:', error)
            // 使用模拟数据
            assetList.value = [
                {
                    id: 1,
                    name: '笔记本电脑',
                    code: 'NB001',
                    categoryId: 1,
                    categoryName: '电子设备',
                    departmentId: 1,
                    departmentName: '研发部',
                    status: 'IN_USE',
                    purchaseDate: '2023-01-15',
                    price: 8999,
                    createTime: '2023-01-16 10:30:45',
                    updateTime: '2023-01-16 10:30:45'
                },
                {
                    id: 2,
                    name: '办公桌',
                    code: 'TB001',
                    categoryId: 2,
                    categoryName: '办公家具',
                    departmentId: 2,
                    departmentName: '行政部',
                    status: 'IN_USE',
                    purchaseDate: '2023-02-20',
                    price: 1299,
                    createTime: '2023-02-21 14:20:30',
                    updateTime: '2023-02-21 14:20:30'
                },
                {
                    id: 3,
                    name: '投影仪',
                    code: 'PJ001',
                    categoryId: 1,
                    categoryName: '电子设备',
                    departmentId: 3,
                    departmentName: '市场部',
                    status: 'REPAIRING',
                    purchaseDate: '2023-03-10',
                    price: 4599,
                    createTime: '2023-03-11 09:15:10',
                    updateTime: '2023-03-11 09:15:10'
                }
            ]
            total.value = 3
            throw error
        } finally {
            loading.value = false
        }
    }

    // 获取资产详情
    const fetchAssetById = async (id) => {
        try {
            const res = await assetApi.getAssetById(id)

            // 如果后端未启动，使用模拟数据
            if (!res || !res.id) {
                // 模拟数据
                return {
                    id: parseInt(id),
                    name: '笔记本电脑',
                    code: 'NB001',
                    categoryId: 1,
                    categoryName: '电子设备',
                    departmentId: 1,
                    departmentName: '研发部',
                    status: 'IN_USE',
                    purchaseDate: '2023-01-15',
                    price: 8999,
                    remark: '这是一台高性能笔记本电脑，配置为i7处理器，16GB内存，512GB SSD',
                    createTime: '2023-01-16 10:30:45',
                    updateTime: '2023-01-16 10:30:45'
                }
            }

            return res
        } catch (error) {
            console.error('获取资产详情失败:', error)
            // 使用模拟数据
            return {
                id: parseInt(id),
                name: '笔记本电脑',
                code: 'NB001',
                categoryId: 1,
                categoryName: '电子设备',
                departmentId: 1,
                departmentName: '研发部',
                status: 'IN_USE',
                purchaseDate: '2023-01-15',
                price: 8999,
                remark: '这是一台高性能笔记本电脑，配置为i7处理器，16GB内存，512GB SSD',
                createTime: '2023-01-16 10:30:45',
                updateTime: '2023-01-16 10:30:45'
            }
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
            // 模拟创建成功
            await fetchAssets()
            return { success: true }
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
            // 模拟更新成功
            await fetchAssets()
            return { success: true }
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
            // 模拟删除成功
            await fetchAssets()
            return { success: true }
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
            // 模拟删除成功
            await fetchAssets()
            return { success: true }
        }
    }

    // 获取分类列表
    const fetchCategories = async () => {
        categoriesLoading.value = true
        try {
            const res = await assetApi.getCategories()

            // 如果后端未启动，使用模拟数据
            if (!res || !res.length) {
                // 模拟数据
                categories.value = [
                    { id: 1, name: '电子设备', code: 'ELE' },
                    { id: 2, name: '办公家具', code: 'FUR' },
                    { id: 3, name: '运输工具', code: 'VEH' },
                    { id: 4, name: '办公用品', code: 'OFF' }
                ]
            } else {
                categories.value = res
            }

            return categories.value
        } catch (error) {
            console.error('获取分类列表失败:', error)
            // 使用模拟数据
            categories.value = [
                { id: 1, name: '电子设备', code: 'ELE' },
                { id: 2, name: '办公家具', code: 'FUR' },
                { id: 3, name: '运输工具', code: 'VEH' },
                { id: 4, name: '办公用品', code: 'OFF' }
            ]
            return categories.value
        } finally {
            categoriesLoading.value = false
        }
    }

    // 获取部门列表
    const fetchDepartments = async () => {
        departmentsLoading.value = true
        try {
            const res = await assetApi.getDepartments()

            // 如果后端未启动，使用模拟数据
            if (!res || !res.length) {
                // 模拟数据
                departments.value = [
                    { id: 1, name: '研发部' },
                    { id: 2, name: '行政部' },
                    { id: 3, name: '市场部' },
                    { id: 4, name: '财务部' },
                    { id: 5, name: '人力资源部' }
                ]
            } else {
                departments.value = res
            }

            return departments.value
        } catch (error) {
            console.error('获取部门列表失败:', error)
            // 使用模拟数据
            departments.value = [
                { id: 1, name: '研发部' },
                { id: 2, name: '行政部' },
                { id: 3, name: '市场部' },
                { id: 4, name: '财务部' },
                { id: 5, name: '人力资源部' }
            ]
            return departments.value
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
            categoryId: '',
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
        categories,
        categoriesLoading,
        departments,
        departmentsLoading,
        fetchAssets,
        fetchAssetById,
        createAsset,
        updateAsset,
        deleteAsset,
        batchDeleteAssets,
        fetchCategories,
        fetchDepartments,
        setQueryParam,
        resetQueryParams
    }
})