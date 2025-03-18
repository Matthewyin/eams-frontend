# EAMS 数据中心管理系统前端

企业资产与设备管理系统（EAMS）前端模块，专注于数据中心机房设备可视化与管理。

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **图表展示**: ECharts

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 核心功能

### 数据中心大屏

- **机柜布局可视化**：直观展示机房内所有机柜的空间位置布局
- **机柜详情查看**：点击任意机柜查看其详细信息，包括内部设备列表
- **机柜状态指标**：展示机柜类型和剩余U数，方便资源评估
- **数据中心层级导航**：从数据中心、建筑到机房的层级化数据浏览

### 资产管理

- **设备登记与跟踪**：记录设备详情、位置和状态信息
- **空间规划**：机柜U位级别的空间分配与管理
- **统计分析**：资源利用率和容量规划图表

## 项目结构

```
src/
.
├── App.vue
├── api
│   ├── asset.js
│   ├── auth.js
│   ├── config.js
│   ├── dashboard.js
│   ├── datacenter.js
│   ├── file.js
│   └── http.js
├── assets
│   ├── logo-small.png
│   ├── logo-w.png
│   └── logo.png
├── components
│   ├── common
│   │   ├── Breadcrumb.vue
│   │   ├── SearchForm.vue
│   │   └── TableToolbar.vue
│   ├── dashboard
│   │   ├── ChartCard.vue
│   │   └── StatCard.vue
│   └── datacenter
│       ├── BuildingSelector.vue
│       ├── Cabinet.vue
│       ├── CabinetDetail.vue
│       ├── CabinetRow.vue
│       ├── DataCenterSelector.vue
│       ├── RoomSelector.vue
│       └── screen
│           ├── CabinetDetailsComponent.vue
│           ├── CabinetLayoutComponent.vue
│           ├── ControlBarComponent.vue
│           └── HeaderComponent.vue
├── composables
│   └── useDatacenterScreen.js
├── layouts
│   └── MainLayout.vue
├── main.js
├── router
│   └── index.js
├── store
│   ├── index.js
│   └── modules
│       ├── app.js
│       ├── asset.js
│       ├── datacenter.js
│       └── user.js
├── styles
│   ├── datacenter
│   │   └── screen.css
│   └── index.css
└── views
    ├── asset
    │   ├── detail.vue
    │   └── index.vue
    ├── big-screen
    │   └── index.vue
    ├── category
    │   └── index.vue
    ├── dashboard
    │   └── index.vue
    ├── datacenter
    │   ├── index.vue
    │   └── screen.vue
    ├── error
    │   └── 404.vue
    ├── import
    │   └── index.vue
    ├── login
    │   └── index.vue
    └── setting
        └── index.vue
```

## 开发指南

### 组件命名规范

- **页面组件**: 存放在`views/`目录，按照业务域组织
- **可复用组件**: 存放在`components/`目录，按照功能域组织
- **全局组件**: 组件名使用驼峰式，如`HeaderComponent.vue`

### 状态管理

使用Pinia进行状态管理，按照业务域划分store模块:

```javascript
// 示例: store/datacenter.js
import { defineStore } from 'pinia'

export const useDatacenterStore = defineStore('datacenter', {
  state: () => ({
    dataCenters: [],
    selectedDataCenter: null
  }),
  actions: {
    async fetchDataCenters() {
      // ...
    }
  }
})
```

### API调用规范

API请求统一通过`api`目录下的服务模块进行，避免在组件中直接使用axios:

```javascript
// 示例: api/datacenter.js
import request from './request'

export function getDataCenters() {
  return request({
    url: '/datacenters',
    method: 'get'
  })
}
```

## 贡献指南

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT](LICENSE)
