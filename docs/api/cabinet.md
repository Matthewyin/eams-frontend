# 机柜管理API

## 1. 获取所有机柜

获取系统中所有机柜的基本信息列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/cabinets`
- **权限**: 需要`cabinet:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| rowId | string | 否 | 按机柜行ID筛选 |
| type | string | 否 | 按类型筛选，可选值：`server`, `network`, `storage`, `other` |
| status | string | 否 | 按状态筛选，可选值：`normal`, `maintenance`, `reserved`, `fault` |
| usageRateMin | number | 否 | 最小使用率筛选，范围0-1 |
| usageRateMax | number | 否 | 最大使用率筛选，范围0-1 |
| query | string | 否 | 搜索关键词，匹配机柜名称或编号 |
| page | integer | 否 | 页码，默认1 |
| pageSize | integer | 否 | 每页大小，默认20 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 120,
    "page": 1,
    "pageSize": 20,
    "totalPages": 6,
    "items": [
      {
        "id": "cabinet-a1-1",
        "name": "A1-1",
        "type": "network",
        "status": "normal",
        "roomId": "room-north-1f-a",
        "roomName": "北楼1层A区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "rowId": "row-north-1f-a-1",
        "rowName": "A1列",
        "usageRate": 0.9,
        "height": 42,
        "deviceCount": 8,
        "createdAt": "2023-02-10T09:30:00Z",
        "updatedAt": "2025-03-01T14:15:00Z"
      },
      {
        "id": "cabinet-a1-2",
        "name": "A1-2",
        "type": "network",
        "status": "normal",
        "roomId": "room-north-1f-a",
        "roomName": "北楼1层A区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "rowId": "row-north-1f-a-1",
        "rowName": "A1列",
        "usageRate": 0.85,
        "height": 42,
        "deviceCount": 7,
        "createdAt": "2023-02-10T09:45:00Z",
        "updatedAt": "2025-02-15T11:30:00Z"
      }
    ]
  }
}
```

## 2. 获取机柜详情

获取指定机柜的详细信息，包括U位和设备信息。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/cabinets/:id`
- **权限**: 需要`cabinet:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| includeDevices | boolean | 否 | 是否包含设备信息，默认true |
| includeUnits | boolean | 否 | 是否包含U位信息，默认true |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "cabinet-a1-1",
    "name": "A1-1",
    "type": "network",
    "specification": "标准42U网络机柜",
    "model": "IBM 9360-42U",
    "manufacturer": "IBM",
    "serialNumber": "IBM-9360-001",
    "assetNumber": "CAB-001",
    "width": 600,
    "height": 42,
    "depth": 1000,
    "maxWeight": 1000,
    "status": "normal",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "rowId": "row-north-1f-a-1",
    "rowName": "A1列",
    "position": {
      "x": 200,
      "y": 300
    },
    "usageRate": 0.9,
    "usedUnits": 38,
    "totalUnits": 42,
    "powerCapacity": "6kW",
    "usedPower": "4.2kW",
    "powerUsageRate": 0.7,
    "purchaseDate": "2023-01-10",
    "warrantyExpiration": "2028-01-10",
    "notes": "核心网络机柜，托管关键网络设备",
    "createdAt": "2023-02-10T09:30:00Z",
    "updatedAt": "2025-03-01T14:15:00Z",
    "devices": [
      {
        "id": "device-001",
        "name": "核心交换机-01",
        "type": "network",
        "model": "Cisco Nexus 9000",
        "serialNumber": "NXOS-9K-001",
        "position": 38,
        "size": 4,
        "status": "online"
      },
      {
        "id": "device-002",
        "name": "核心路由器-01",
        "type": "network",
        "model": "Cisco ASR 9000",
        "serialNumber": "ASR-9K-001",
        "position": 34,
        "size": 4,
        "status": "online"
      },
      {
        "id": "device-003",
        "name": "防火墙-01",
        "type": "security",
        "model": "Palo Alto PA-7000",
        "serialNumber": "PA-7K-001",
        "position": 30,
        "size": 4,
        "status": "online"
      }
    ],
    "units": [
      {
        "position": 1,
        "occupied": false,
        "deviceId": null
      },
      {
        "position": 30,
        "occupied": true,
        "deviceId": "device-003"
      },
      {
        "position": 31,
        "occupied": true,
        "deviceId": "device-003"
      },
      {
        "position": 32,
        "occupied": true,
        "deviceId": "device-003"
      },
      {
        "position": 33,
        "occupied": true,
        "deviceId": "device-003"
      },
      {
        "position": 34,
        "occupied": true,
        "deviceId": "device-002"
      },
      {
        "position": 35,
        "occupied": true,
        "deviceId": "device-002"
      },
      {
        "position": 36,
        "occupied": true,
        "deviceId": "device-002"
      },
      {
        "position": 37,
        "occupied": true,
        "deviceId": "device-002"
      },
      {
        "position": 38,
        "occupied": true,
        "deviceId": "device-001"
      },
      {
        "position": 39,
        "occupied": true,
        "deviceId": "device-001"
      },
      {
        "position": 40,
        "occupied": true,
        "deviceId": "device-001"
      },
      {
        "position": 41,
        "occupied": true,
        "deviceId": "device-001"
      },
      {
        "position": 42,
        "occupied": true,
        "deviceId": "device-001"
      }
    ]
  }
}
```

## 3. 创建机柜

创建新的机柜。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/cabinets`
- **权限**: 需要`cabinet:create`权限
- **内容类型**: `application/json`

### 请求体

```json
{
  "name": "A1-3",
  "type": "network",
  "specification": "标准42U网络机柜",
  "model": "IBM 9360-42U",
  "manufacturer": "IBM",
  "serialNumber": "IBM-9360-003",
  "assetNumber": "CAB-003",
  "width": 600,
  "height": 42,
  "depth": 1000,
  "maxWeight": 1000,
  "status": "normal",
  "roomId": "room-north-1f-a",
  "rowId": "row-north-1f-a-1",
  "position": {
    "x": 320,
    "y": 300
  },
  "powerCapacity": "6kW",
  "purchaseDate": "2025-03-01",
  "warrantyExpiration": "2030-03-01",
  "notes": "新增网络机柜，用于扩展网络容量"
}
```

### 响应

```json
{
  "code": 201,
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "cabinet-a1-3",
    "name": "A1-3",
    "type": "network",
    "specification": "标准42U网络机柜",
    "model": "IBM 9360-42U",
    "manufacturer": "IBM",
    "serialNumber": "IBM-9360-003",
    "assetNumber": "CAB-003",
    "width": 600,
    "height": 42,
    "depth": 1000,
    "maxWeight": 1000,
    "status": "normal",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "rowId": "row-north-1f-a-1",
    "rowName": "A1列",
    "position": {
      "x": 320,
      "y": 300
    },
    "usageRate": 0,
    "usedUnits": 0,
    "totalUnits": 42,
    "powerCapacity": "6kW",
    "usedPower": "0kW",
    "powerUsageRate": 0,
    "purchaseDate": "2025-03-01",
    "warrantyExpiration": "2030-03-01",
    "notes": "新增网络机柜，用于扩展网络容量",
    "createdAt": "2025-03-18T18:30:00Z",
    "updatedAt": "2025-03-18T18:30:00Z"
  }
}
```

## 4. 更新机柜

更新指定机柜的信息。

### 请求

- **方法**: `PUT`
- **路径**: `/api/v1/cabinets/:id`
- **权限**: 需要`cabinet:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 请求体

```json
{
  "name": "A1-3",
  "specification": "高密度42U网络机柜",
  "powerCapacity": "8kW",
  "notes": "升级为高密度网络机柜，支持更高功率设备",
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
    "id": "cabinet-a1-3",
    "name": "A1-3",
    "type": "network",
    "specification": "高密度42U网络机柜",
    "model": "IBM 9360-42U",
    "manufacturer": "IBM",
    "serialNumber": "IBM-9360-003",
    "assetNumber": "CAB-003",
    "width": 600,
    "height": 42,
    "depth": 1000,
    "maxWeight": 1000,
    "status": "normal",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "rowId": "row-north-1f-a-1",
    "rowName": "A1列",
    "position": {
      "x": 320,
      "y": 300
    },
    "usageRate": 0,
    "usedUnits": 0,
    "totalUnits": 42,
    "powerCapacity": "8kW",
    "usedPower": "0kW",
    "powerUsageRate": 0,
    "purchaseDate": "2025-03-01",
    "warrantyExpiration": "2030-03-01",
    "notes": "升级为高密度网络机柜，支持更高功率设备",
    "createdAt": "2025-03-18T18:30:00Z",
    "updatedAt": "2025-03-18T19:45:00Z"
  }
}
```

## 5. 删除机柜

删除指定的机柜。

### 请求

- **方法**: `DELETE`
- **路径**: `/api/v1/cabinets/:id`
- **权限**: 需要`cabinet:delete`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 6. 获取机柜中的设备列表

获取指定机柜中安装的所有设备。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/cabinets/:id/devices`
- **权限**: 需要`cabinet:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| type | string | 否 | 按设备类型筛选 |
| status | string | 否 | 按设备状态筛选 |
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
        "id": "device-001",
        "name": "核心交换机-01",
        "type": "network",
        "model": "Cisco Nexus 9000",
        "serialNumber": "NXOS-9K-001",
        "position": 38,
        "size": 4,
        "status": "online",
        "powerConsumption": "1200W"
      },
      {
        "id": "device-002",
        "name": "核心路由器-01",
        "type": "network",
        "model": "Cisco ASR 9000",
        "serialNumber": "ASR-9K-001",
        "position": 34,
        "size": 4,
        "status": "online",
        "powerConsumption": "1500W"
      },
      {
        "id": "device-003",
        "name": "防火墙-01",
        "type": "security",
        "model": "Palo Alto PA-7000",
        "serialNumber": "PA-7K-001",
        "position": 30,
        "size": 4,
        "status": "online",
        "powerConsumption": "1000W"
      }
    ]
  }
}
```

## 7. 获取机柜U位占用情况

获取指定机柜的U位占用情况。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/cabinets/:id/units`
- **权限**: 需要`cabinet:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "cabinetId": "cabinet-a1-1",
    "cabinetName": "A1-1",
    "totalUnits": 42,
    "usedUnits": 38,
    "usageRate": 0.9,
    "units": [
      {
        "position": 1,
        "occupied": false,
        "deviceId": null,
        "deviceName": null
      },
      {
        "position": 30,
        "occupied": true,
        "deviceId": "device-003",
        "deviceName": "防火墙-01"
      },
      {
        "position": 31,
        "occupied": true,
        "deviceId": "device-003",
        "deviceName": "防火墙-01"
      },
      {
        "position": 32,
        "occupied": true,
        "deviceId": "device-003",
        "deviceName": "防火墙-01"
      },
      {
        "position": 33,
        "occupied": true,
        "deviceId": "device-003",
        "deviceName": "防火墙-01"
      },
      {
        "position": 34,
        "occupied": true,
        "deviceId": "device-002",
        "deviceName": "核心路由器-01"
      },
      {
        "position": 35,
        "occupied": true,
        "deviceId": "device-002",
        "deviceName": "核心路由器-01"
      },
      {
        "position": 36,
        "occupied": true,
        "deviceId": "device-002",
        "deviceName": "核心路由器-01"
      },
      {
        "position": 37,
        "occupied": true,
        "deviceId": "device-002",
        "deviceName": "核心路由器-01"
      },
      {
        "position": 38,
        "occupied": true,
        "deviceId": "device-001",
        "deviceName": "核心交换机-01"
      },
      {
        "position": 39,
        "occupied": true,
        "deviceId": "device-001",
        "deviceName": "核心交换机-01"
      },
      {
        "position": 40,
        "occupied": true,
        "deviceId": "device-001",
        "deviceName": "核心交换机-01"
      },
      {
        "position": 41,
        "occupied": true,
        "deviceId": "device-001",
        "deviceName": "核心交换机-01"
      },
      {
        "position": 42,
        "occupied": true,
        "deviceId": "device-001",
        "deviceName": "核心交换机-01"
      }
    ]
  }
}
```

## 8. 预留机柜

预留指定的机柜，防止其被分配设备。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/cabinets/:id/reserve`
- **权限**: 需要`cabinet:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 请求体

```json
{
  "reason": "预留给新的网络设备部署",
  "reservedBy": "张三",
  "reservedUntil": "2025-05-01T00:00:00Z"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "预留成功",
  "data": {
    "id": "cabinet-a1-3",
    "name": "A1-3",
    "status": "reserved",
    "reservedBy": "张三",
    "reservedReason": "预留给新的网络设备部署",
    "reservedAt": "2025-03-18T20:30:00Z",
    "reservedUntil": "2025-05-01T00:00:00Z"
  }
}
```

## 9. 取消预留机柜

取消对指定机柜的预留。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/cabinets/:id/unreserve`
- **权限**: 需要`cabinet:update`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 机柜ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "取消预留成功",
  "data": {
    "id": "cabinet-a1-3",
    "name": "A1-3",
    "status": "normal"
  }
}
```

## 机柜类型枚举值

| 类型值 | 描述 |
|---|---|
| server | 服务器机柜 |
| network | 网络机柜 |
| storage | 存储机柜 |
| other | 其他类型 |

## 机柜状态枚举值

| 状态值 | 描述 |
|---|---|
| normal | 正常 |
| maintenance | 维护中 |
| reserved | 已预留 |
| fault | 故障 |
| decommissioned | 已退役 |
