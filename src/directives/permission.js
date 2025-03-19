/**
 * 权限控制指令
 * 用于基于用户权限控制UI元素的显示
 * 
 * 使用方法：
 * 1. 在main.js中注册指令
 * 2. 在模板中使用 v-permission="'user:create'" 或 v-permission="['user:create', 'user:edit']"
 */
import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el, binding) {
    const userStore = useUserStore()
    const { value } = binding
    
    // 检查权限
    const hasPermission = checkPermission(userStore, value)
    
    if (!hasPermission) {
      // 如果没有权限，则隐藏元素
      try {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        } else {
          // 如果没有父节点，则隐藏元素
          el.style.display = 'none'
        }
      } catch (e) {
        // 如果发生错误，使用display隐藏元素
        console.warn('Permission directive error:', e)
        el.style.display = 'none'
      }
    }
  },
  
  // 添加更新钩子，处理动态权限变化
  updated(el, binding) {
    const userStore = useUserStore()
    const { value } = binding
    
    // 检查权限
    const hasPermission = checkPermission(userStore, value)
    
    if (!hasPermission) {
      // 如果没有权限，则隐藏元素
      try {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        } else {
          // 如果没有父节点，则隐藏元素
          el.style.display = 'none'
        }
      } catch (e) {
        // 如果发生错误，使用display隐藏元素
        console.warn('Permission directive error:', e)
        el.style.display = 'none'
      }
    } else {
      // 如果有权限但元素被隐藏了，显示元素
      if (el.style.display === 'none') {
        el.style.display = ''
      }
    }
  }
}

/**
 * 检查用户是否有权限
 * @param {Object} userStore - 用户存储
 * @param {string|Array} permission - 权限或权限数组
 * @returns {boolean} 是否有权限
 */
function checkPermission(userStore, permission) {
  if (!permission) {
    return true
  }
  
  // 如果用户未登录，没有权限
  if (!userStore.isLoggedIn) {
    return false
  }
  
  // 如果用户是超级管理员，有所有权限
  if (userStore.userInfo.roles && userStore.userInfo.roles.includes('admin')) {
    return true
  }
  
  // 检查具体权限
  if (Array.isArray(permission)) {
    // 如果是权限数组，只要有一个权限符合即可
    return permission.some(p => userStore.hasPermission(p))
  } else {
    // 如果是单个权限
    return userStore.hasPermission(permission)
  }
}
