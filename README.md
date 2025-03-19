# ITEams - IT资产管理系统前端

<div align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-41b883" alt="Vue 3">
  <img src="https://img.shields.io/badge/Vite-4.x-646cff" alt="Vite">
  <img src="https://img.shields.io/badge/Element%20Plus-2.x-409eff" alt="Element Plus">
  <img src="https://img.shields.io/badge/Pinia-latest-yellow" alt="Pinia">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="License">
</div>

## 📝 项目简介

ITEams的前端组件，专注于IT资产全生命周期管理的可视化展示与操作。提供直观的资产管理界面，包括资产列表、详情查看、数据中心机房可视化、以及用户认证的功能。

## 🧰 技术栈

- **前端框架**: Vue 3 - 渲染高效的响应式组件系统
- **构建工具**: Vite - 超快开发服务器与优化的构建器
- **UI组件库**: Element Plus - 基于Vue 3的企业级组件库
- **状态管理**: Pinia - 直观、类型安全的Vue状态管理库
- **路由管理**: Vue Router - 官方路由器，支持历史模式和HASH模式
- **HTTP客户端**: Axios - 基于PROMISE的HTTP客户端，使用拦截器处理请求和响应
- **图表可视化**: ECharts - 丰富的交互式图表组件
- **CSS预处理器**: SCSS - 提供嵌套、变量和混合等功能
- **代码格式化**: ESLint + Prettier - 确保代码质量和风格一致性

## 🔧 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Vue.js 3.x
- Vite 4.x

### 安装依赖

```bash
# 安装项目依赖
npm install

# 或使用yarn
yarn install
```

### 配置环境变量

1. 创建环境变量文件
```bash
cp .env.example .env.local
```

2. 配置后端接口地址
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 或使用yarn
yarn dev
```

服务器默认运行在 http://localhost:3000

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 登录凭据

系统预置了以下用户账号：

- 管理员账号
  - 用户名：`admin`
  - 密码：`admin123`

- 普通用户账号
  - 用户名：`user`
  - 密码：`user123`

## 💻 核心功能

### 用户认证与权限管理

- **用户登录**：基于JWT的安全认证系统，支持用户名/密码登录
- **权限控制**：基于角色的访问控制系统，支持菜单和功能级别的细粒度权限
- **令牌管理**：自动处理令牌刷新与失效的机制
- **用户信息存储**：基于Pinia的用户状态管理

### 资产管理

- **资产列表与详情**：查看全部IT资产，包括详细信息和状态跟踪
- **资产分类管理**：基于多级分类的资产组织与管理
- **维保合同查看**：资产相关的维保信息和到期提醒
- **状态变更记录**：资产生命周期中的状态变化历史

### 数据中心可视化

- **机柜布局可视化**：直观展示机房内所有机柜的空间位置布局
- **机柜详情查看**：点击任意机柜查看其详细信息和内部设备
- **机柜状态指标**：展示机柜类型和剩余U数，方便资源评估
- **数据中心层级导航**：层级化的数据中心、建筑、机房浏览

### 系统日志与统计

- **操作日志查询**：查看用户操作日志，支持多条件筛选
- **统计分析图表**：资产分布、资源利用率等可视化展示
- **仪表盘概览**：直观展示资产总量、状态分布和维保到期提醒

## 📝 项目规范

### 代码风格

- 使用ESLint + Prettier进行代码格式化
- 遵循Vue 3的组合式 API规范
- 使用TypeScript类型注解提高代码可维护性

### 命名规范

- 文件名：使用kebab-case（例：`user-profile.vue`）
- 组件名：使用PascalCase（例：`UserProfile`）
- 变量名：使用camelCase（例：`userName`）
- 常量名：使用UPPER_SNAKE_CASE（例：`MAX_COUNT`）

### 目录结构规范

- 每个功能模块单独一个目录
- 公共组件放在`components/common`目录下
- 全局样式放在`styles`目录下
- 工具函数放在`utils`目录下

### Git提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）包括：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 其他修改

## 📓 目录结构

```
src/
├── App.vue                 # 应用程序入口组件
├── api/                    # API接口层
│   ├── auth.js           # 认证相关接口
│   ├── asset.js          # 资产管理接口
│   ├── config.js         # API配置与常量
│   ├── dashboard.js       # 仪表盘相关接口
│   ├── datacenter.js      # 数据中心相关接口
│   ├── file.js           # 文件上传下载接口
│   ├── http.js           # Axios实例与拦截器
│   ├── log.js            # 日志相关接口
│   └── user.js           # 用户管理接口
├── assets/                # 静态资源
│   ├── logo-small.png     # 小型标志
│   ├── logo-w.png         # 白色标志
│   └── logo.png          # 标准标志
├── components/            # 组件目录
│   ├── asset/             # 资产管理组件
│   │   ├── AssetFormDialog.vue  # 资产表单对话框
│   │   └── ImportDialog.vue    # 数据导入对话框
│   ├── common/            # 通用组件
│   │   ├── Breadcrumb.vue    # 面包屑导航
│   │   ├── SearchForm.vue    # 通用搜索表单
│   │   └── TableToolbar.vue  # 表格工具栏
│   ├── dashboard/          # 仪表盘组件
│   │   ├── ChartCard.vue     # 图表卡片
│   │   └── StatCard.vue      # 统计卡片
│   ├── datacenter/         # 数据中心组件
│   │   ├── BuildingSelector.vue  # 建筑选择器
│   │   ├── Cabinet.vue          # 机柜组件
│   │   ├── CabinetDetail.vue    # 机柜详情
│   │   ├── CabinetRow.vue       # 机柜行
│   │   ├── RoomSelector.vue     # 机房选择器
│   │   └── screen/             # 大屏展示组件
│   │       ├── CabinetLayout.vue   # 机柜布局
│   │       ├── ControlBar.vue      # 控制栏
│   │       └── DeviceDialog.vue    # 设备详情对话框
│   ├── log/               # 日志组件
│   │   └── LogDetailDialog.vue  # 日志详情对话框
│   └── user/              # 用户组件
│       └── UserFormDialog.vue  # 用户表单对话框
├── composables/           # 组合式函数
│   └── useDatacenterScreen.js  # 数据中心大屏逻辑
├── directives/            # 自定义指令
│   └── permission.js       # 权限控制指令
├── layouts/               # 布局组件
│   └── MainLayout.vue      # 主要布局组件
├── router/                # 路由配置
│   └── index.js           # 路由定义
├── store/                 # 状态管理/                 # 状态管理
│   ├── index.js           # Store配置
│   └── modules/           # 状态模块
│       ├── app.js          # 应用状态
│       ├── asset.js        # 资产状态
│       ├── datacenter.js   # 数据中心状态
│       └── user.js         # 用户状态
├── styles/                # 样式文件
│   ├── index.css          # 全局样式
│   └── datacenter/       # 数据中心样式
│       └── screen.css     # 大屏样式
├── utils/                 # 工具函数
│   ├── format.js          # 格式化工具
│   └── test-auth.js       # 认证测试工具
├── views/                 # 页面组件
│   ├── asset/             # 资产管理页面
│   │   ├── detail.vue      # 资产详情
│   │   └── index.vue       # 资产列表
│   ├── dashboard/         # 仪表盘页面
│   │   └── index.vue       # 仪表盘
│   ├── datacenter/        # 数据中心页面
│   │   ├── index.vue       # 数据中心管理
│   │   └── screen.vue      # 大屏展示
│   ├── error/            # 错误页面
│   │   └── 404.vue         # 404页面
│   ├── log/              # 日志页面
│   │   └── index.vue       # 日志列表
│   ├── login/            # 登录页面
│   │   └── index.vue       # 登录表单
│   ├── setting/          # 设置页面
│   │   └── index.vue       # 系统设置
│   └── user/             # 用户管理页面
│       └── index.vue       # 用户列表
├── main.js                # 应用入口
└── vite.config.js         # Vite配置文件
```

## 👨‍💻 贡献指南

### 如何贡献

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/your-feature-name`
3. 提交你的更改：`git commit -am 'feat: add some feature'`
4. 推送到远程分支：`git push origin feature/your-feature-name`
5. 提交Pull Request

### 开发流程

1. 选择或创建一个任务
2. 创建新分支进行开发
3. 遵循代码规范进行开发
4. 编写必要的测试用例
5. 提交Pull Request

### 报告问题

如果你发现了bug或者有新的功能建议，请在Issues中提交：

1. 检查是否已经存在相关的Issue
2. 使用清晰的标题和描述
3. 提供复现问题的步骤
4. 提供相关的日志和错误信息

## 📄 协议

本项目采用MIT协议。有关详细信息，请查看[LICENSE](LICENSE)文件。
