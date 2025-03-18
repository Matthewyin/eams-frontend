# 机房管理API

## 1. 获取所有机房

获取系统中所有机房的基本信息列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/rooms`
- **权限**: 需要`room:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| status | string | 否 | 按状态筛选，可选值：`normal`, `maintenance`, `construction` |
| floor | integer | 否 | 按楼层筛选 |
| page | integer | 否 | 页码，默认1 |
| pageSize | integer | 否 | 每页大小，默认20 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 8,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [
      {
        "id": "room-north-1f-a",
        "name": "北楼1层A区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "floor": 1,
        "status": "normal",
        "rackCount": 15,
        "usageRate": 0.8,
        "createdAt": "2023-01-25T10:30:00Z",
        "updatedAt": "2025-02-25T13:45:00Z"
      },
      {
        "id": "room-north-1f-b",
        "name": "北楼1层B区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "floor": 1,
        "status": "normal",
        "rackCount": 15,
        "usageRate": 0.75,
        "createdAt": "2023-01-25T11:15:00Z",
        "updatedAt": "2025-01-20T09:30:00Z"
      }
    ]
  }
}
```

## 2. 获取机房详情

获取指定机房的详细信息，包括机柜列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/rooms/:id`
- **权限**: 需要`room:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机房ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| includeCabinetRows | boolean | 否 | 是否包含机柜行信息，默认true |
| includeStats | boolean | 否 | 是否包含统计信息，默认true |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "room-north-1f-a",
    "name": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "floor": 1,
    "status": "normal",
    "description": "北楼1层A区机房，主要部署网络设备",
    "area": 300,
    "raisedFloor": true,
    "powerCapacity": "200kW",
    "coolingCapacity": "220kW",
    "createdAt": "2023-01-25T10:30:00Z",
    "updatedAt": "2025-02-25T13:45:00Z",
    "cabinetRows": [
      {
        "id": "row-north-1f-a-1",
        "name": "A1列",
        "type": "network",
        "cabinetCount": 8,
        "usageRate": 0.85
      },
      {
        "id": "row-north-1f-a-2",
        "name": "A2列",
        "type": "server",
        "cabinetCount": 7,
        "usageRate": 0.75
      }
    ],
    "statistics": {
      "totalCabinetRows": 2,
      "totalCabinets": 15,
      "usedCabinets": 12,
      "cabinetUsageRate": 0.8,
      "totalU": 630,
      "usedU": 410,
      "uUsageRate": 0.65,
      "totalPower": "200kW",
      "usedPower": "130kW",
      "powerUsageRate": 0.65
    }
  }
}
```

## 3. 获取机房平面图

获取指定机房的平面布局图。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/rooms/:id/layout`
- **权限**: 需要`room:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机房ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "room-north-1f-a",
    "name": "北楼1层A区",
    "dimensions": {
      "width": 2000,
      "height": 1500,
      "unit": "cm"
    },
    "gridSize": {
      "columns": 20,
      "rows": 15
    },
    "entrances": [
      {
        "id": "entrance-1",
        "name": "主入口",
        "position": {
          "x": 1000,
          "y": 0
        },
        "width": 120
      },
      {
        "id": "entrance-2",
        "name": "紧急出口",
        "position": {
          "x": 1800,
          "y": 1500
        },
        "width": 100
      }
    ],
    "walls": [
      {
        "id": "wall-1",
        "points": [
          {"x": 0, "y": 0},
          {"x": 2000, "y": 0},
          {"x": 2000, "y": 1500},
          {"x": 0, "y": 1500},
          {"x": 0, "y": 0}
        ]
      }
    ],
    "cabinetRows": [
      {
        "id": "row-north-1f-a-1",
        "name": "A1列",
        "position": {
          "x": 200,
          "y": 300
        },
        "orientation": "horizontal",
        "width": 1600,
        "depth": 100,
        "cabinets": [
          {
            "id": "cabinet-a1-1",
            "name": "A1-1",
            "position": {
              "x": 200,
              "y": 300
            },
            "width": 60,
            "depth": 100,
            "type": "network",
            "usageRate": 0.9
          },
          {
            "id": "cabinet-a1-2",
            "name": "A1-2",
            "position": {
              "x": 260,
              "y": 300
            },
            "width": 60,
            "depth": 100,
            "type": "network",
            "usageRate": 0.85
          }
        ]
      },
      {
        "id": "row-north-1f-a-2",
        "name": "A2列",
        "position": {
          "x": 200,
          "y": 500
        },
        "orientation": "horizontal",
        "width": 1600,
        "depth": 100,
        "cabinets": [
          {
            "id": "cabinet-a2-1",
            "name": "A2-1",
            "position": {
              "x": 200,
              "y": 500
            },
            "width": 60,
            "depth": 100,
            "type": "server",
            "usageRate": 0.8
          },
          {
            "id": "cabinet-a2-2",
            "name": "A2-2",
            "position": {
              "x": 260,
              "y": 500
            },
            "width": 60,
            "depth": 100,
            "type": "server",
            "usageRate": 0.75
          }
        ]
      }
    ],
    "coolingUnits": [
      {
        "id": "cooling-1",
        "name": "空调1",
        "position": {
          "x": 100,
          "y": 100
        },
        "width": 80,
        "depth": 80,
        "capacity": "50kW",
        "status": "normal"
      },
      {
        "id": "cooling-2",
        "name": "空调2",
        "position": {
          "x": 1800,
          "y": 100
        },
        "width": 80,
        "depth": 80,
        "capacity": "50kW",
        "status": "normal"
      }
    ],
    "powerDistributionUnits": [
      {
        "id": "pdu-1",
        "name": "配电柜1",
        "position": {
          "x": 100,
          "y": 1400
        },
        "width": 100,
        "depth": 50,
        "capacity": "100kW",
        "status": "normal"
      }
    ]
  }
}
```

## 4. 创建机房

创建新的机房。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/rooms`
- **权限**: 需要`room:create`权限
- **内容类型**: `application/json`

### 请求体

```json
{
  "name": "北楼3层A区",
  "buildingId": "bld-yizhuang-north",
  "floor": 3,
  "description": "北楼3层A区机房，主要部署存储设备",
  "area": 250,
  "raisedFloor": true,
  "powerCapacity": "180kW",
  "coolingCapacity": "200kW",
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
    "id": "room-north-3f-a",
    "name": "北楼3层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "floor": 3,
    "description": "北楼3层A区机房，主要部署存储设备",
    "area": 250,
    "raisedFloor": true,
    "powerCapacity": "180kW",
    "coolingCapacity": "200kW",
    "status": "construction",
    "createdAt": "2025-03-18T16:30:00Z",
    "updatedAt": "2025-03-18T16:30:00Z"
  }
}
```

## 5. 更新机房

更新指定机房的信息。

### 请求

- **方法**: `PUT`
- **路径**: `/api/v1/rooms/:id`
- **权限**: 需要`room:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机房ID |

### 请求体

```json
{
  "name": "北楼3层A区",
  "description": "北楼3层A区机房，主要部署高性能存储设备",
  "powerCapacity": "200kW",
  "coolingCapacity": "220kW",
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
    "id": "room-north-3f-a",
    "name": "北楼3层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "floor": 3,
    "description": "北楼3层A区机房，主要部署高性能存储设备",
    "area": 250,
    "raisedFloor": true,
    "powerCapacity": "200kW",
    "coolingCapacity": "220kW",
    "status": "normal",
    "createdAt": "2025-03-18T16:30:00Z",
    "updatedAt": "2025-03-18T17:45:00Z"
  }
}
```

## 6. 删除机房

删除指定的机房。

### 请求

- **方法**: `DELETE`
- **路径**: `/api/v1/rooms/:id`
- **权限**: 需要`room:delete`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机房ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 7. 获取机房统计信息

获取指定机房的统计信息。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/rooms/:id/statistics`
- **权限**: 需要`room:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机房ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "totalCabinetRows": 2,
    "totalCabinets": 15,
    "usedCabinets": 12,
    "cabinetUsageRate": 0.8,
    "totalU": 630,
    "usedU": 410,
    "uUsageRate": 0.65,
    "totalPower": "200kW",
    "usedPower": "130kW",
    "powerUsageRate": 0.65,
    "deviceTypeDistribution": {
      "server": 35,
      "network": 20,
      "storage": 10,
      "security": 5,
      "other": 3
    },
    "monthlyPowerTrend": [
      {
        "month": "2025-01",
        "powerUsage": "120kW",
        "powerUsageRate": 0.6
      },
      {
        "month": "2025-02",
        "powerUsage": "125kW",
        "powerUsageRate": 0.625
      },
      {
        "month": "2025-03",
        "powerUsage": "130kW",
        "powerUsageRate": 0.65
      }
    ],
    "temperatureHumidity": {
      "current": {
        "temperature": 22.5,
        "humidity": 45
      },
      "average": {
        "temperature": 22.3,
        "humidity": 44
      },
      "max": {
        "temperature": 24.1,
        "humidity": 50
      },
      "min": {
        "temperature": 21.0,
        "humidity": 40
      }
    }
  }
}
```

## 机房状态枚举值

| 状态值 | 描述 |
|---|---|
| normal | 正常 |
| maintenance | 维护中 |
| construction | 建设中 |
| renovation | 翻新中 |
| decommissioned | 已退役 |
