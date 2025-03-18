# 数据中心管理API

## 1. 获取所有数据中心

获取系统中所有数据中心的基本信息列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/datacenters`
- **权限**: 需要`datacenter:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| status | string | 否 | 按状态筛选，可选值：`online`, `offline`, `maintenance` |
| location | string | 否 | 按位置筛选 |
| page | integer | 否 | 页码，默认1 |
| pageSize | integer | 否 | 每页大小，默认20 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [
      {
        "id": "dc-yizhuan",
        "name": "亦庄数据中心",
        "location": "北京亦庄经济开发区",
        "status": "online",
        "buildingCount": 2,
        "rackCount": 120,
        "usageRate": 0.75,
        "createdAt": "2023-01-15T08:00:00Z",
        "updatedAt": "2025-02-20T10:30:00Z"
      },
      {
        "id": "dc-xiwuhuan",
        "name": "西五环射击场数据中心",
        "location": "北京市海淀区西五环",
        "status": "online",
        "buildingCount": 2,
        "rackCount": 40,
        "usageRate": 0.65,
        "createdAt": "2023-03-10T09:15:00Z",
        "updatedAt": "2025-01-05T14:20:00Z"
      }
    ]
  }
}
```

## 2. 获取数据中心详情

获取指定数据中心的详细信息，包括建筑列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/datacenters/:id`
- **权限**: 需要`datacenter:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 数据中心ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| includeBuildings | boolean | 否 | 是否包含建筑信息，默认true |
| includeStats | boolean | 否 | 是否包含统计信息，默认true |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "dc-yizhuan",
    "name": "亦庄数据中心",
    "location": "北京亦庄经济开发区",
    "status": "online",
    "description": "主要托管公司核心业务系统",
    "contactPerson": "张三",
    "contactPhone": "13800138000",
    "totalArea": 5000,
    "powerCapacity": "2MW",
    "coolingCapacity": "2.2MW",
    "createdAt": "2023-01-15T08:00:00Z",
    "updatedAt": "2025-02-20T10:30:00Z",
    "buildings": [
      {
        "id": "bld-yizhuang-north",
        "name": "亦庄北楼",
        "roomCount": 4,
        "status": "normal"
      },
      {
        "id": "bld-yizhuang-south",
        "name": "亦庄南楼",
        "roomCount": 4,
        "status": "normal"
      }
    ],
    "statistics": {
      "totalRacks": 120,
      "usedRacks": 90,
      "rackUsageRate": 0.75,
      "totalPower": "2MW",
      "usedPower": "1.2MW",
      "powerUsageRate": 0.6
    }
  }
}
```

## 3. 创建数据中心

创建新的数据中心。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/datacenters`
- **权限**: 需要`datacenter:create`权限
- **内容类型**: `application/json`

### 请求体

```json
{
  "name": "上海浦东数据中心",
  "location": "上海市浦东新区张江高科技园区",
  "description": "托管上海地区业务系统",
  "contactPerson": "李四",
  "contactPhone": "13900139000",
  "totalArea": 3000,
  "powerCapacity": "1.5MW",
  "coolingCapacity": "1.7MW",
  "status": "online"
}
```

### 响应

```json
{
  "code": 201,
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "dc-pudong",
    "name": "上海浦东数据中心",
    "location": "上海市浦东新区张江高科技园区",
    "description": "托管上海地区业务系统",
    "contactPerson": "李四",
    "contactPhone": "13900139000",
    "totalArea": 3000,
    "powerCapacity": "1.5MW",
    "coolingCapacity": "1.7MW",
    "status": "online",
    "createdAt": "2025-03-18T13:30:00Z",
    "updatedAt": "2025-03-18T13:30:00Z"
  }
}
```

## 4. 更新数据中心

更新指定数据中心的信息。

### 请求

- **方法**: `PUT`
- **路径**: `/api/v1/datacenters/:id`
- **权限**: 需要`datacenter:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 数据中心ID |

### 请求体

```json
{
  "name": "上海浦东数据中心（升级版）",
  "description": "托管上海地区核心业务系统",
  "contactPerson": "王五",
  "contactPhone": "13700137000",
  "powerCapacity": "2MW",
  "coolingCapacity": "2.2MW",
  "status": "maintenance"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "dc-pudong",
    "name": "上海浦东数据中心（升级版）",
    "location": "上海市浦东新区张江高科技园区",
    "description": "托管上海地区核心业务系统",
    "contactPerson": "王五",
    "contactPhone": "13700137000",
    "totalArea": 3000,
    "powerCapacity": "2MW",
    "coolingCapacity": "2.2MW",
    "status": "maintenance",
    "createdAt": "2025-03-18T13:30:00Z",
    "updatedAt": "2025-03-18T14:45:00Z"
  }
}
```

## 5. 删除数据中心

删除指定的数据中心。

### 请求

- **方法**: `DELETE`
- **路径**: `/api/v1/datacenters/:id`
- **权限**: 需要`datacenter:delete`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 数据中心ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 6. 获取数据中心统计信息

获取指定数据中心的统计信息。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/datacenters/:id/statistics`
- **权限**: 需要`datacenter:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 数据中心ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "totalBuildings": 2,
    "totalRooms": 8,
    "totalRacks": 120,
    "usedRacks": 90,
    "rackUsageRate": 0.75,
    "totalU": 5040,
    "usedU": 3276,
    "uUsageRate": 0.65,
    "totalPower": "2MW",
    "usedPower": "1.2MW",
    "powerUsageRate": 0.6,
    "deviceTypeDistribution": {
      "server": 245,
      "network": 78,
      "storage": 42,
      "security": 25,
      "other": 18
    },
    "monthlyPowerTrend": [
      {
        "month": "2025-01",
        "powerUsage": "1.1MW",
        "powerUsageRate": 0.55
      },
      {
        "month": "2025-02",
        "powerUsage": "1.15MW",
        "powerUsageRate": 0.575
      },
      {
        "month": "2025-03",
        "powerUsage": "1.2MW",
        "powerUsageRate": 0.6
      }
    ]
  }
}
```

## 数据中心状态枚举值

| 状态值 | 描述 |
|---|---|
| online | 在线运行中 |
| offline | 离线 |
| maintenance | 维护中 |
| construction | 建设中 |
| decommissioned | 已退役 |
