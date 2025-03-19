/**
 * 认证和用户管理功能测试脚本
 * 这个脚本用于测试认证流程和用户管理功能
 * 可以在浏览器控制台中运行
 */
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

/**
 * 测试认证流程
 */
export async function testAuthFlow() {
  console.group('测试认证流程')
  
  try {
    const userStore = useUserStore()
    
    // 1. 测试登录
    console.log('1. 测试登录...')
    try {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      }
      const loginResponse = await authApi.login(loginData)
      console.log('登录响应:', loginResponse)
      
      if (loginResponse.data && loginResponse.data.token) {
        console.log('✅ 登录成功')
      } else {
        console.error('❌ 登录失败：响应中没有token')
      }
    } catch (error) {
      console.error('❌ 登录失败:', error)
    }
    
    // 2. 测试获取用户信息
    console.log('\n2. 测试获取用户信息...')
    try {
      const userInfoResponse = await authApi.getUserInfo()
      console.log('用户信息响应:', userInfoResponse)
      
      if (userInfoResponse.data) {
        console.log('✅ 获取用户信息成功')
      } else {
        console.error('❌ 获取用户信息失败：响应中没有用户数据')
      }
    } catch (error) {
      console.error('❌ 获取用户信息失败:', error)
    }
    
    // 3. 测试用户存储
    console.log('\n3. 测试用户存储...')
    console.log('Token:', userStore.token)
    console.log('用户信息:', userStore.userInfo)
    console.log('是否已登录:', userStore.isLoggedIn)
    
    if (userStore.isLoggedIn) {
      console.log('✅ 用户存储正常')
    } else {
      console.error('❌ 用户存储异常：用户未登录')
    }
    
    // 3.1 测试权限检查
    console.log('\n3.1 测试权限检查...')
    // 测试常见权限
    const permissionsToTest = [
      'user:create',
      'user:edit',
      'user:delete',
      'user:reset-password',
      'user:view'
    ]
    
    for (const permission of permissionsToTest) {
      const hasPermission = userStore.hasPermission(permission)
      console.log(`权限 ${permission}: ${hasPermission ? '✅ 有权限' : '❌ 无权限'}`)
    }
    
    // 测试权限提示
    console.log('\n测试权限提示功能...')
    // 暂时禁用实际提示，避免弹出多个提示框
    const originalError = ElMessage.error
    ElMessage.error = (msg) => console.log('模拟错误提示:', msg)
    
    userStore.checkAndNotifyPermission('user:create', '创建用户')
    userStore.checkAndNotifyPermission('user:delete', '删除用户')
    
    // 恢复原始提示功能
    ElMessage.error = originalError
    
    // 4. 测试登出
    console.log('\n4. 测试登出...')
    try {
      await userStore.logout()
      console.log('登出后Token:', userStore.token)
      console.log('登出后用户信息:', userStore.userInfo)
      console.log('登出后是否已登录:', userStore.isLoggedIn)
      
      if (!userStore.isLoggedIn) {
        console.log('✅ 登出成功')
      } else {
        console.error('❌ 登出失败：用户仍然处于登录状态')
      }
    } catch (error) {
      console.error('❌ 登出失败:', error)
    }
    
    console.log('\n认证流程测试完成')
  } catch (error) {
    console.error('测试认证流程时发生错误:', error)
  }
  
  console.groupEnd()
}

/**
 * 测试用户管理功能
 */
export async function testUserManagement() {
  console.group('测试用户管理功能')
  
  try {
    // 1. 测试获取用户列表
    console.log('1. 测试获取用户列表...')
    try {
      const params = {
        page: 1,
        limit: 10
      }
      const usersResponse = await userApi.getUsers(params)
      console.log('用户列表响应:', usersResponse)
      
      if (usersResponse.data && Array.isArray(usersResponse.data.items)) {
        console.log('✅ 获取用户列表成功，共', usersResponse.data.total, '条记录')
      } else {
        console.error('❌ 获取用户列表失败：响应格式不正确')
      }
    } catch (error) {
      console.error('❌ 获取用户列表失败:', error)
    }
    
    // 2. 测试创建用户
    console.log('\n2. 测试创建用户...')
    let newUserId = null
    try {
      const newUser = {
        username: 'testuser_' + Date.now(),
        name: '测试用户',
        email: 'test@example.com',
        phone: '13800138000',
        roles: ['user'],
        status: 1,
        password: 'Test123456'
      }
      const createResponse = await userApi.createUser(newUser)
      console.log('创建用户响应:', createResponse)
      
      if (createResponse.data && createResponse.data.id) {
        newUserId = createResponse.data.id
        console.log('✅ 创建用户成功，ID:', newUserId)
      } else {
        console.error('❌ 创建用户失败：响应中没有用户ID')
      }
    } catch (error) {
      console.error('❌ 创建用户失败:', error)
    }
    
    // 如果创建用户成功，继续测试其他功能
    if (newUserId) {
      // 3. 测试获取用户详情
      console.log('\n3. 测试获取用户详情...')
      try {
        const userDetailResponse = await userApi.getUser(newUserId)
        console.log('用户详情响应:', userDetailResponse)
        
        if (userDetailResponse.data && userDetailResponse.data.id === newUserId) {
          console.log('✅ 获取用户详情成功')
        } else {
          console.error('❌ 获取用户详情失败：响应中没有正确的用户数据')
        }
      } catch (error) {
        console.error('❌ 获取用户详情失败:', error)
      }
      
      // 4. 测试更新用户
      console.log('\n4. 测试更新用户...')
      try {
        const updateData = {
          name: '已更新的测试用户',
          email: 'updated@example.com'
        }
        const updateResponse = await userApi.updateUser(newUserId, updateData)
        console.log('更新用户响应:', updateResponse)
        
        if (updateResponse.data) {
          console.log('✅ 更新用户成功')
        } else {
          console.error('❌ 更新用户失败：响应不正确')
        }
      } catch (error) {
        console.error('❌ 更新用户失败:', error)
      }
      
      // 5. 测试重置密码
      console.log('\n5. 测试重置密码...')
      try {
        const resetResponse = await userApi.resetPassword(newUserId)
        console.log('重置密码响应:', resetResponse)
        
        if (resetResponse.data) {
          console.log('✅ 重置密码成功')
        } else {
          console.error('❌ 重置密码失败：响应不正确')
        }
      } catch (error) {
        console.error('❌ 重置密码失败:', error)
      }
      
      // 6. 测试删除用户
      console.log('\n6. 测试删除用户...')
      try {
        const deleteResponse = await userApi.deleteUser(newUserId)
        console.log('删除用户响应:', deleteResponse)
        
        if (deleteResponse.data) {
          console.log('✅ 删除用户成功')
        } else {
          console.error('❌ 删除用户失败：响应不正确')
        }
      } catch (error) {
        console.error('❌ 删除用户失败:', error)
      }
    }
    
    // 7. 测试获取角色列表
    console.log('\n7. 测试获取角色列表...')
    try {
      const rolesResponse = await userApi.getRoles()
      console.log('角色列表响应:', rolesResponse)
      
      if (rolesResponse.data && Array.isArray(rolesResponse.data)) {
        console.log('✅ 获取角色列表成功，共', rolesResponse.data.length, '个角色')
      } else {
        console.error('❌ 获取角色列表失败：响应格式不正确')
      }
    } catch (error) {
      console.error('❌ 获取角色列表失败:', error)
    }
    
    console.log('\n用户管理功能测试完成')
  } catch (error) {
    console.error('测试用户管理功能时发生错误:', error)
  }
  
  console.groupEnd()
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('开始运行所有测试...\n')
  
  await testAuthFlow()
  console.log('\n')
  await testUserManagement()
  
  console.log('\n所有测试已完成')
}

/**
 * 测试权限控制
 */
export async function testPermissionControl() {
  console.group('测试权限控制')
  
  try {
    const userStore = useUserStore()
    
    // 1. 测试登录状态下的权限
    console.log('1. 测试登录状态下的权限...')
    
    // 先确保用户已登录
    if (!userStore.isLoggedIn) {
      console.log('用户未登录，尝试登录...')
      try {
        const loginData = {
          username: 'admin',
          password: 'admin123'
        }
        await authApi.login(loginData)
        await userStore.getUserInfo()
      } catch (error) {
        console.error('登录失败:', error)
        console.log('跳过权限测试')
        console.groupEnd()
        return
      }
    }
    
    // 测试各种权限
    const permissionsToTest = [
      { code: 'user:create', name: '创建用户' },
      { code: 'user:edit', name: '编辑用户' },
      { code: 'user:delete', name: '删除用户' },
      { code: 'user:reset-password', name: '重置密码' },
      { code: 'user:view', name: '查看用户' },
      { code: 'non-existent:permission', name: '不存在的权限' }
    ]
    
    for (const permission of permissionsToTest) {
      const hasPermission = userStore.hasPermission(permission.code)
      console.log(`权限 ${permission.code} (${permission.name}): ${hasPermission ? '✅ 有权限' : '❌ 无权限'}`)
    }
    
    // 2. 测试权限检查提示
    console.log('\n2. 测试权限检查提示...')
    
    // 暂时禁用实际提示，避免弹出多个提示框
    const originalError = ElMessage.error
    ElMessage.error = (msg) => console.log('模拟错误提示:', msg)
    
    for (const permission of permissionsToTest) {
      const result = userStore.checkAndNotifyPermission(permission.code, permission.name)
      console.log(`检查权限 ${permission.code} (${permission.name}): ${result ? '✅ 通过' : '❌ 未通过'}`)
    }
    
    // 恢复原始提示功能
    ElMessage.error = originalError
    
    // 3. 测试登出后的权限
    console.log('\n3. 测试登出后的权限...')
    
    // 登出
    await userStore.logout()
    console.log('用户已登出')
    
    // 再次测试权限
    for (const permission of permissionsToTest) {
      const hasPermission = userStore.hasPermission(permission.code)
      console.log(`权限 ${permission.code} (${permission.name}): ${hasPermission ? '✅ 有权限' : '❌ 无权限'}`)
    }
    
    console.log('\n权限控制测试完成')
  } catch (error) {
    console.error('测试权限控制时发生错误:', error)
  }
  
  console.groupEnd()
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('===== 开始运行所有测试 =====')
  await testAuthFlow()
  console.log('\n')
  await testUserManagement()
  console.log('\n')
  await testPermissionControl()
  console.log('===== 所有测试完成 =====')
}

// 导出测试函数
export default {
  testAuthFlow,
  testUserManagement,
  testPermissionControl,
  runAllTests
}
