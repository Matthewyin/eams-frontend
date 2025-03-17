import { defineStore } from "pinia"
import { ref } from "vue"

export const useAppStore = defineStore("app", () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 主题设置
  const theme = ref(localStorage.getItem("theme") || "light")

  // 切换主题
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem("theme", newTheme)

    // 应用主题到文档
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // 表格密度
  const tableDensity = ref(localStorage.getItem("tableDensity") || "default")

  // 设置表格密度
  const setTableDensity = (density) => {
    tableDensity.value = density
    localStorage.setItem("tableDensity", density)
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    theme,
    setTheme,
    tableDensity,
    setTableDensity,
  }
})

