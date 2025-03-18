# 统计数据API

## 1. 获取系统概览统计

获取整个系统的概览统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/overview`
- **权限**: 需要`statistics:read`权限

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "dataCenters": {
      "total": 3,
      "active": 3
    },
    "buildings": {
      "total": 6,
      "active": 6
    },
    "rooms": {
      "total": 15,
      "active": 14,
      "maintenance": 1
    },
    "cabinets": {
      "total": 320,
      "used": 280,
      "usageRate": 0.875,
      "byType": {
        "server": 200,
        "network": 80,
        "storage": 30,
        "other": 10
      },
      "byStatus": {
        "normal": 290,
        "maintenance": 15,
        "reserved": 10,
        "fault": 5
      }
    },
    "devices": {
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
      }
    },
    "capacity": {
      "totalU": 13440,
      "usedU": 9800,
      "uUsageRate": 0.73,
      "totalPower": "3200kW",
      "usedPower": "2100kW",
      "powerUsageRate": 0.656,
      "totalCooling": "3500kW",
      "usedCooling": "2300kW",
      "coolingUsageRate": 0.657
    },
    "alerts": {
      "total": 28,
      "critical": 3,
      "warning": 15,
      "info": 10
    }
  }
}
```

## 2. 获取数据中心统计

获取所有数据中心的统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/datacenters`
- **权限**: 需要`statistics:read`权限

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": "dc-yizhuan",
      "name": "亦庄数据中心",
      "buildingCount": 2,
      "roomCount": 8,
      "cabinetCount": 180,
      "deviceCount": 720,
      "usageRate": 0.85,
      "powerUsageRate": 0.7,
      "coolingUsageRate": 0.68,
      "alerts": {
        "total": 12,
        "critical": 1,
        "warning": 6,
        "info": 5
      }
    },
    {
      "id": "dc-shunyi",
      "name": "顺义数据中心",
      "buildingCount": 3,
      "roomCount": 5,
      "cabinetCount": 100,
      "deviceCount": 380,
      "usageRate": 0.9,
      "powerUsageRate": 0.65,
      "coolingUsageRate": 0.63,
      "alerts": {
        "total": 10,
        "critical": 1,
        "warning": 5,
        "info": 4
      }
    },
    {
      "id": "dc-haidian",
      "name": "海淀数据中心",
      "buildingCount": 1,
      "roomCount": 2,
      "cabinetCount": 40,
      "deviceCount": 150,
      "usageRate": 0.75,
      "powerUsageRate": 0.5,
      "coolingUsageRate": 0.48,
      "alerts": {
        "total": 6,
        "critical": 1,
        "warning": 4,
        "info": 1
      }
    }
  ]
}
```

## 3. 获取单个数据中心统计

获取指定数据中心的详细统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/datacenters/:id`
- **权限**: 需要`statistics:read`权限

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
    "id": "dc-yizhuan",
    "name": "亦庄数据中心",
    "buildings": {
      "total": 2,
      "active": 2,
      "list": [
        {
          "id": "bld-yizhuang-north",
          "name": "亦庄北楼",
          "roomCount": 5,
          "cabinetCount": 120,
          "usageRate": 0.88
        },
        {
          "id": "bld-yizhuang-south",
          "name": "亦庄南楼",
          "roomCount": 3,
          "cabinetCount": 60,
          "usageRate": 0.78
        }
      ]
    },
    "rooms": {
      "total": 8,
      "active": 7,
      "maintenance": 1,
      "byStatus": {
        "normal": 7,
        "maintenance": 1,
        "construction": 0
      }
    },
    "cabinets": {
      "total": 180,
      "used": 160,
      "usageRate": 0.889,
      "byType": {
        "server": 120,
        "network": 40,
        "storage": 15,
        "other": 5
      },
      "byStatus": {
        "normal": 165,
        "maintenance": 8,
        "reserved": 5,
        "fault": 2
      }
    },
    "devices": {
      "total": 720,
      "byType": {
        "server": 500,
        "network": 120,
        "storage": 60,
        "security": 30,
        "other": 10
      },
      "byStatus": {
        "online": 680,
        "offline": 10,
        "maintenance": 20,
        "fault": 5,
        "standby": 5
      }
    },
    "capacity": {
      "totalU": 7560,
      "usedU": 5800,
      "uUsageRate": 0.767,
      "totalPower": "1800kW",
      "usedPower": "1260kW",
      "powerUsageRate": 0.7,
      "totalCooling": "2000kW",
      "usedCooling": "1360kW",
      "coolingUsageRate": 0.68
    },
    "alerts": {
      "total": 12,
      "critical": 1,
      "warning": 6,
      "info": 5,
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
        }
      ]
    },
    "trends": {
      "powerUsage": [
        {
          "date": "2025-03-12",
          "value": "1220kW"
        },
        {
          "date": "2025-03-13",
          "value": "1230kW"
        },
        {
          "date": "2025-03-14",
          "value": "1240kW"
        },
        {
          "date": "2025-03-15",
          "value": "1245kW"
        },
        {
          "date": "2025-03-16",
          "value": "1250kW"
        },
        {
          "date": "2025-03-17",
          "value": "1255kW"
        },
        {
          "date": "2025-03-18",
          "value": "1260kW"
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
          "value": 0.885
        },
        {
          "date": "2025-03-17",
          "value": 0.885
        },
        {
          "date": "2025-03-18",
          "value": 0.889
        }
      ]
    }
  }
}
```

## 4. 获取建筑统计

获取所有建筑的统计数据。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/statistics/buildings`
- **权限**: 需要`statistics:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": "bld-yizhuang-north",
      "name": "亦庄北楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "roomCount": 5,
      "cabinetCount": 120,
      "deviceCount": 480,
      "usageRate": 0.88,
      "powerUsageRate": 0.72,
      "coolingUsageRate": 0.7
    },
    {
      "id": "bld-yizhuang-south",
      "name": "亦庄南楼",
      "dataCenterId": "dc-yizhuan",
      "dataCenterName": "亦庄数据中心",
      "roomCount": 3,
      "cabinetCount": 60,
      "deviceCount": 240,
      "usageRate": 0.78,
      "powerUsageRate": 0.65,
      "coolingUsageRate": 0.63
    },
    {
      "id": "bld-shunyi-main",
      "name": "顺义主楼",
      "dataCenterId": "dc-shunyi",
      "dataCenterName": "顺义数据中心",
      "roomCount": 3,
      "cabinetCount": 70,
      "deviceCount": 280,
      "usageRate": 0.92,
      "powerUsageRate": 0.68,
      "coolingUsageRate": 0.65
    }
  ]
}
```
