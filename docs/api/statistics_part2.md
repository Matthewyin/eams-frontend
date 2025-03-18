# 统计数据API（续）

## 5. 获取单个建筑统计

获取指定建筑的详细统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/buildings/:id`
- **权限**: 需要`statistics:read`权限

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
    "id": "bld-yizhuang-north",
    "name": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "rooms": {
      "total": 5,
      "active": 4,
      "maintenance": 1,
      "list": [
        {
          "id": "room-north-1f-a",
          "name": "北楼1层A区",
          "cabinetCount": 15,
          "usageRate": 0.9
        },
        {
          "id": "room-north-1f-b",
          "name": "北楼1层B区",
          "cabinetCount": 15,
          "usageRate": 0.85
        },
        {
          "id": "room-north-2f-a",
          "name": "北楼2层A区",
          "cabinetCount": 30,
          "usageRate": 0.95
        },
        {
          "id": "room-north-2f-b",
          "name": "北楼2层B区",
          "cabinetCount": 30,
          "usageRate": 0.9
        },
        {
          "id": "room-north-3f-a",
          "name": "北楼3层A区",
          "cabinetCount": 30,
          "usageRate": 0.8
        }
      ],
      "byStatus": {
        "normal": 4,
        "maintenance": 1,
        "construction": 0
      }
    },
    "cabinets": {
      "total": 120,
      "used": 106,
      "usageRate": 0.883,
      "byType": {
        "server": 80,
        "network": 25,
        "storage": 10,
        "other": 5
      },
      "byStatus": {
        "normal": 110,
        "maintenance": 5,
        "reserved": 3,
        "fault": 2
      }
    },
    "devices": {
      "total": 480,
      "byType": {
        "server": 320,
        "network": 80,
        "storage": 50,
        "security": 20,
        "other": 10
      },
      "byStatus": {
        "online": 450,
        "offline": 5,
        "maintenance": 15,
        "fault": 5,
        "standby": 5
      }
    },
    "capacity": {
      "totalU": 5040,
      "usedU": 3800,
      "uUsageRate": 0.754,
      "totalPower": "1200kW",
      "usedPower": "864kW",
      "powerUsageRate": 0.72,
      "totalCooling": "1300kW",
      "usedCooling": "910kW",
      "coolingUsageRate": 0.7
    },
    "alerts": {
      "total": 8,
      "critical": 1,
      "warning": 4,
      "info": 3
    },
    "trends": {
      "powerUsage": [
        {
          "date": "2025-03-12",
          "value": "840kW"
        },
        {
          "date": "2025-03-13",
          "value": "845kW"
        },
        {
          "date": "2025-03-14",
          "value": "850kW"
        },
        {
          "date": "2025-03-15",
          "value": "855kW"
        },
        {
          "date": "2025-03-16",
          "value": "858kW"
        },
        {
          "date": "2025-03-17",
          "value": "860kW"
        },
        {
          "date": "2025-03-18",
          "value": "864kW"
        }
      ],
      "cabinetUsage": [
        {
          "date": "2025-03-12",
          "value": 0.87
        },
        {
          "date": "2025-03-13",
          "value": 0.875
        },
        {
          "date": "2025-03-14",
          "value": 0.88
        },
        {
          "date": "2025-03-15",
          "value": 0.88
        },
        {
          "date": "2025-03-16",
          "value": 0.88
        },
        {
          "date": "2025-03-17",
          "value": 0.88
        },
        {
          "date": "2025-03-18",
          "value": 0.883
        }
      ]
    }
  }
}
```

## 6. 获取机房统计

获取所有机房的统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/rooms`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| status | string | 否 | 按状态筛选 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": "room-north-1f-a",
      "name": "北楼1层A区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "cabinetCount": 15,
      "deviceCount": 60,
      "usageRate": 0.9,
      "powerUsageRate": 0.75,
      "coolingUsageRate": 0.72
    },
    {
      "id": "room-north-1f-b",
      "name": "北楼1层B区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "cabinetCount": 15,
      "deviceCount": 55,
      "usageRate": 0.85,
      "powerUsageRate": 0.7,
      "coolingUsageRate": 0.68
    },
    {
      "id": "room-north-2f-a",
      "name": "北楼2层A区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "cabinetCount": 30,
      "deviceCount": 120,
      "usageRate": 0.95,
      "powerUsageRate": 0.8,
      "coolingUsageRate": 0.78
    }
  ]
}
```

## 7. 获取机柜统计

获取所有机柜的统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/cabinets`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| type | string | 否 | 按类型筛选 |
| status | string | 否 | 按状态筛选 |
| usageRateMin | number | 否 | 最小使用率筛选，范围0-1 |
| usageRateMax | number | 否 | 最大使用率筛选，范围0-1 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": "cabinet-a1-1",
      "name": "A1-1",
      "type": "network",
      "roomId": "room-north-1f-a",
      "roomName": "北楼1层A区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "totalU": 42,
      "usedU": 38,
      "usageRate": 0.905,
      "deviceCount": 8,
      "powerUsage": "4.2kW",
      "powerCapacity": "6kW",
      "powerUsageRate": 0.7
    },
    {
      "id": "cabinet-a1-2",
      "name": "A1-2",
      "type": "network",
      "roomId": "room-north-1f-a",
      "roomName": "北楼1层A区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "totalU": 42,
      "usedU": 36,
      "usageRate": 0.857,
      "deviceCount": 7,
      "powerUsage": "3.8kW",
      "powerCapacity": "6kW",
      "powerUsageRate": 0.633
    },
    {
      "id": "cabinet-a2-1",
      "name": "A2-1",
      "type": "server",
      "roomId": "room-north-1f-a",
      "roomName": "北楼1层A区",
      "buildingId": "bld-yizhuang-north",
      "buildingName": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "status": "normal",
      "totalU": 42,
      "usedU": 34,
      "usageRate": 0.81,
      "deviceCount": 17,
      "powerUsage": "4.5kW",
      "powerCapacity": "6kW",
      "powerUsageRate": 0.75
    }
  ]
}
```

## 8. 获取设备统计

获取所有设备的统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/devices`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| cabinetId | string | 否 | 按机柜ID筛选 |
| type | string | 否 | 按类型筛选 |
| status | string | 否 | 按状态筛选 |
| manufacturer | string | 否 | 按制造商筛选 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 1250,
    "byType": {
      "server": 850,
      "network": 200,
      "storage": 120,
      "security": 50,
      "other": 30
    },
    "byStatus": {
      "online": 1150,
      "offline": 20,
      "maintenance": 50,
      "fault": 15,
      "standby": 15
    },
    "byManufacturer": {
      "Dell": 320,
      "HP": 280,
      "IBM": 150,
      "Cisco": 180,
      "Huawei": 120,
      "Lenovo": 90,
      "Other": 110
    },
    "topModels": [
      {
        "manufacturer": "Dell",
        "model": "PowerEdge R740",
        "count": 120
      },
      {
        "manufacturer": "HP",
        "model": "ProLiant DL380 Gen10",
        "count": 100
      },
      {
        "manufacturer": "Cisco",
        "model": "Nexus 9000",
        "count": 80
      },
      {
        "manufacturer": "Huawei",
        "model": "FusionServer 2288H V5",
        "count": 60
      },
      {
        "manufacturer": "IBM",
        "model": "Power System S922",
        "count": 50
      }
    ]
  }
}
```

## 9. 获取容量趋势

获取系统容量使用趋势数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/trends/capacity`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| type | string | 否 | 趋势类型，可选值：`power`, `cooling`, `space`, `all`，默认`all` |
| period | string | 否 | 时间周期，可选值：`day`, `week`, `month`, `year`，默认`month` |
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "period": "month",
    "startDate": "2024-10-01",
    "endDate": "2025-03-31",
    "power": [
      {
        "date": "2024-10",
        "totalCapacity": "3000kW",
        "usage": "1800kW",
        "usageRate": 0.6
      },
      {
        "date": "2024-11",
        "totalCapacity": "3000kW",
        "usage": "1850kW",
        "usageRate": 0.617
      },
      {
        "date": "2024-12",
        "totalCapacity": "3000kW",
        "usage": "1900kW",
        "usageRate": 0.633
      },
      {
        "date": "2025-01",
        "totalCapacity": "3200kW",
        "usage": "2000kW",
        "usageRate": 0.625
      },
      {
        "date": "2025-02",
        "totalCapacity": "3200kW",
        "usage": "2050kW",
        "usageRate": 0.641
      },
      {
        "date": "2025-03",
        "totalCapacity": "3200kW",
        "usage": "2100kW",
        "usageRate": 0.656
      }
    ],
    "cooling": [
      {
        "date": "2024-10",
        "totalCapacity": "3300kW",
        "usage": "1950kW",
        "usageRate": 0.591
      },
      {
        "date": "2024-11",
        "totalCapacity": "3300kW",
        "usage": "2000kW",
        "usageRate": 0.606
      },
      {
        "date": "2024-12",
        "totalCapacity": "3300kW",
        "usage": "2050kW",
        "usageRate": 0.621
      },
      {
        "date": "2025-01",
        "totalCapacity": "3500kW",
        "usage": "2200kW",
        "usageRate": 0.629
      },
      {
        "date": "2025-02",
        "totalCapacity": "3500kW",
        "usage": "2250kW",
        "usageRate": 0.643
      },
      {
        "date": "2025-03",
        "totalCapacity": "3500kW",
        "usage": "2300kW",
        "usageRate": 0.657
      }
    ],
    "space": [
      {
        "date": "2024-10",
        "totalU": 12600,
        "usedU": 8800,
        "usageRate": 0.698
      },
      {
        "date": "2024-11",
        "totalU": 12600,
        "usedU": 8900,
        "usageRate": 0.706
      },
      {
        "date": "2024-12",
        "totalU": 12600,
        "usedU": 9000,
        "usageRate": 0.714
      },
      {
        "date": "2025-01",
        "totalU": 13440,
        "usedU": 9500,
        "usageRate": 0.707
      },
      {
        "date": "2025-02",
        "totalU": 13440,
        "usedU": 9650,
        "usageRate": 0.718
      },
      {
        "date": "2025-03",
        "totalU": 13440,
        "usedU": 9800,
        "usageRate": 0.729
      }
    ]
  }
}
```

## 10. 获取告警统计

获取系统告警统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/alerts`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| level | string | 否 | 按告警级别筛选，可选值：`critical`, `warning`, `info` |
| type | string | 否 | 按告警类型筛选，可选值：`power`, `cooling`, `security`, `network`, `device` |
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 28,
    "byLevel": {
      "critical": 3,
      "warning": 15,
      "info": 10
    },
    "byType": {
      "power": 8,
      "cooling": 6,
      "security": 4,
      "network": 5,
      "device": 5
    },
    "byLocation": {
      "dc-yizhuan": 12,
      "dc-shunyi": 10,
      "dc-haidian": 6
    },
    "trend": [
      {
        "date": "2025-03-12",
        "total": 25,
        "critical": 2,
        "warning": 13,
        "info": 10
      },
      {
        "date": "2025-03-13",
        "total": 26,
        "critical": 2,
        "warning": 14,
        "info": 10
      },
      {
        "date": "2025-03-14",
        "total": 24,
        "critical": 2,
        "warning": 12,
        "info": 10
      },
      {
        "date": "2025-03-15",
        "total": 25,
        "critical": 2,
        "warning": 13,
        "info": 10
      },
      {
        "date": "2025-03-16",
        "total": 26,
        "critical": 3,
        "warning": 13,
        "info": 10
      },
      {
        "date": "2025-03-17",
        "total": 27,
        "critical": 3,
        "warning": 14,
        "info": 10
      },
      {
        "date": "2025-03-18",
        "total": 28,
        "critical": 3,
        "warning": 15,
        "info": 10
      }
    ],
    "recent": [
      {
        "id": "alert-001",
        "level": "critical",
        "type": "power",
        "message": "UPS电池组1容量低于安全阈值",
        "location": "亦庄北楼 1层 配电室",
        "timestamp": "2025-03-18T10:15:00Z"
      },
      {
        "id": "alert-002",
        "level": "warning",
        "type": "temperature",
        "message": "机房温度超过26°C",
        "location": "亦庄北楼 2层 A区机房",
        "timestamp": "2025-03-18T12:30:00Z"
      },
      {
        "id": "alert-003",
        "level": "warning",
        "type": "device",
        "message": "服务器CPU使用率超过90%",
        "location": "亦庄北楼 2层 A区机房 A2-5 服务器-001",
        "timestamp": "2025-03-18T14:45:00Z"
      },
      {
        "id": "alert-004",
        "level": "info",
        "type": "security",
        "message": "机房门禁异常访问",
        "location": "亦庄北楼 1层 A区机房",
        "timestamp": "2025-03-18T15:20:00Z"
      },
      {
        "id": "alert-005",
        "level": "critical",
        "type": "network",
        "message": "核心交换机链路中断",
        "location": "顺义主楼 1层 网络机房 A1-1 核心交换机-01",
        "timestamp": "2025-03-18T16:10:00Z"
      }
    ]
  }
}
```
