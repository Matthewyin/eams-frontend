# 建筑管理API

## 1. 获取所有建筑

获取系统中所有建筑的基本信息列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/buildings`
- **权限**: 需要`building:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| status | string | 否 | 按状态筛选，可选值：`normal`, `maintenance`, `construction` |
| page | integer | 否 | 页码，默认1 |
| pageSize | integer | 否 | 每页大小，默认20 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 4,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [
      {
        "id": "bld-yizhuang-north",
        "name": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "status": "normal",
        "roomCount": 4,
        "rackCount": 60,
        "usageRate": 0.78,
        "createdAt": "2023-01-20T08:30:00Z",
        "updatedAt": "2025-02-22T11:15:00Z"
      },
      {
        "id": "bld-yizhuang-south",
        "name": "亦庄南楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "status": "normal",
        "roomCount": 4,
        "rackCount": 60,
        "usageRate": 0.72,
        "createdAt": "2023-02-05T09:45:00Z",
        "updatedAt": "2025-01-18T16:30:00Z"
      }
    ]
  }
}
```

## 2. 获取建筑详情

获取指定建筑的详细信息，包括机房列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/buildings/:id`
- **权限**: 需要`building:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 建筑ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| includeRooms | boolean | 否 | 是否包含机房信息，默认true |
| includeStats | boolean | 否 | 是否包含统计信息，默认true |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "bld-yizhuang-north",
    "name": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "status": "normal",
    "description": "亦庄数据中心北区主楼",
    "address": "北京亦庄经济开发区科创十一街18号",
    "floors": 3,
    "totalArea": 2500,
    "powerCapacity": "1MW",
    "coolingCapacity": "1.1MW",
    "createdAt": "2023-01-20T08:30:00Z",
    "updatedAt": "2025-02-22T11:15:00Z",
    "rooms": [
      {
        "id": "room-north-1f-a",
        "name": "北楼1层A区",
        "floor": 1,
        "status": "normal",
        "rackCount": 15
      },
      {
        "id": "room-north-1f-b",
        "name": "北楼1层B区",
        "floor": 1,
        "status": "normal",
        "rackCount": 15
      },
      {
        "id": "room-north-2f-a",
        "name": "北楼2层A区",
        "floor": 2,
        "status": "normal",
        "rackCount": 15
      },
      {
        "id": "room-north-2f-b",
        "name": "北楼2层B区",
        "floor": 2,
        "status": "normal",
        "rackCount": 15
      }
    ],
    "statistics": {
      "totalRooms": 4,
      "totalRacks": 60,
      "usedRacks": 47,
      "rackUsageRate": 0.78,
      "totalPower": "1MW",
      "usedPower": "650kW",
      "powerUsageRate": 0.65
    }
  }
}
```

## 3. 创建建筑

创建新的建筑。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/buildings`
- **权限**: 需要`building:create`权限
- **内容类型**: `application/json`

### 请求体

```json
{
  "name": "亦庄东楼",
  "dataCenterId": "dc-yizhuan",
  "description": "亦庄数据中心东区扩建楼",
  "address": "北京亦庄经济开发区科创十一街20号",
  "floors": 2,
  "totalArea": 1800,
  "powerCapacity": "800kW",
  "coolingCapacity": "900kW",
  "status": "construction"
}
```

### 响应

```json
{
  "code": 201,
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "bld-yizhuang-east",
    "name": "亦庄东楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "description": "亦庄数据中心东区扩建楼",
    "address": "北京亦庄经济开发区科创十一街20号",
    "floors": 2,
    "totalArea": 1800,
    "powerCapacity": "800kW",
    "coolingCapacity": "900kW",
    "status": "construction",
    "createdAt": "2025-03-18T14:30:00Z",
    "updatedAt": "2025-03-18T14:30:00Z"
  }
}
```

## 4. 更新建筑

更新指定建筑的信息。

### 请求

- **方法**: `PUT`
- **路径**: `/api/v1/buildings/:id`
- **权限**: 需要`building:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 建筑ID |

### 请求体

```json
{
  "name": "亦庄东楼",
  "description": "亦庄数据中心东区主楼",
  "powerCapacity": "850kW",
  "coolingCapacity": "950kW",
  "status": "normal"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "bld-yizhuang-east",
    "name": "亦庄东楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "description": "亦庄数据中心东区主楼",
    "address": "北京亦庄经济开发区科创十一街20号",
    "floors": 2,
    "totalArea": 1800,
    "powerCapacity": "850kW",
    "coolingCapacity": "950kW",
    "status": "normal",
    "createdAt": "2025-03-18T14:30:00Z",
    "updatedAt": "2025-03-18T15:45:00Z"
  }
}
```

## 5. 删除建筑

删除指定的建筑。

### 请求

- **方法**: `DELETE`
- **路径**: `/api/v1/buildings/:id`
- **权限**: 需要`building:delete`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 建筑ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 6. 获取建筑统计信息

获取指定建筑的统计信息。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/buildings/:id/statistics`
- **权限**: 需要`building:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 建筑ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "totalRooms": 4,
    "totalRacks": 60,
    "usedRacks": 47,
    "rackUsageRate": 0.78,
    "totalU": 2520,
    "usedU": 1638,
    "uUsageRate": 0.65,
    "totalPower": "1MW",
    "usedPower": "650kW",
    "powerUsageRate": 0.65,
    "deviceTypeDistribution": {
      "server": 120,
      "network": 42,
      "storage": 25,
      "security": 15,
      "other": 10
    },
    "monthlyPowerTrend": [
      {
        "month": "2025-01",
        "powerUsage": "600kW",
        "powerUsageRate": 0.6
      },
      {
        "month": "2025-02",
        "powerUsage": "630kW",
        "powerUsageRate": 0.63
      },
      {
        "month": "2025-03",
        "powerUsage": "650kW",
        "powerUsageRate": 0.65
      }
    ]
  }
}
```

## 建筑状态枚举值

| 状态值 | 描述 |
|---|---|
| normal | 正常 |
| maintenance | 维护中 |
| construction | 建设中 |
| renovation | 翻新中 |
| decommissioned | 已退役 |
