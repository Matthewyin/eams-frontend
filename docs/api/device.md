# 设备管理API

## 1. 获取所有设备

获取系统中所有设备的基本信息列表。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/devices`
- **权限**: 需要`device:read`权限

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| dataCenterId | string | 否 | 按数据中心ID筛选 |
| buildingId | string | 否 | 按建筑ID筛选 |
| roomId | string | 否 | 按机房ID筛选 |
| cabinetId | string | 否 | 按机柜ID筛选 |
| type | string | 否 | 按类型筛选，可选值：`server`, `network`, `storage`, `security`, `other` |
| status | string | 否 | 按状态筛选，可选值：`online`, `offline`, `maintenance`, `fault`, `standby` |
| manufacturer | string | 否 | 按制造商筛选 |
| model | string | 否 | 按型号筛选 |
| query | string | 否 | 搜索关键词，匹配设备名称、序列号或资产编号 |
| page | integer | 否 | 页码，默认1 |
| pageSize | integer | 否 | 每页大小，默认20 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 350,
    "page": 1,
    "pageSize": 20,
    "totalPages": 18,
    "items": [
      {
        "id": "device-001",
        "name": "核心交换机-01",
        "type": "network",
        "model": "Cisco Nexus 9000",
        "manufacturer": "Cisco",
        "serialNumber": "NXOS-9K-001",
        "assetNumber": "NET-001",
        "cabinetId": "cabinet-a1-1",
        "cabinetName": "A1-1",
        "roomId": "room-north-1f-a",
        "roomName": "北楼1层A区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "position": 38,
        "size": 4,
        "status": "online",
        "powerConsumption": "1200W",
        "createdAt": "2023-02-15T10:30:00Z",
        "updatedAt": "2025-03-05T14:45:00Z"
      },
      {
        "id": "device-002",
        "name": "核心路由器-01",
        "type": "network",
        "model": "Cisco ASR 9000",
        "manufacturer": "Cisco",
        "serialNumber": "ASR-9K-001",
        "assetNumber": "NET-002",
        "cabinetId": "cabinet-a1-1",
        "cabinetName": "A1-1",
        "roomId": "room-north-1f-a",
        "roomName": "北楼1层A区",
        "buildingId": "bld-yizhuang-north",
        "buildingName": "亦庄北楼",
        "dataCenterId": "dc-yizhuan",
        "dataCenterName": "亦庄数据中心",
        "position": 34,
        "size": 4,
        "status": "online",
        "powerConsumption": "1500W",
        "createdAt": "2023-02-15T11:15:00Z",
        "updatedAt": "2025-02-20T09:30:00Z"
      }
    ]
  }
}
```

## 2. 获取设备详情

获取指定设备的详细信息。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/devices/:id`
- **权限**: 需要`device:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": {
    "id": "device-001",
    "name": "核心交换机-01",
    "type": "network",
    "model": "Cisco Nexus 9000",
    "manufacturer": "Cisco",
    "serialNumber": "NXOS-9K-001",
    "assetNumber": "NET-001",
    "cabinetId": "cabinet-a1-1",
    "cabinetName": "A1-1",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "position": 38,
    "size": 4,
    "status": "online",
    "description": "核心网络交换机，负责数据中心内部网络互联",
    "powerConsumption": "1200W",
    "heatDissipation": "4100BTU/h",
    "weight": 25.5,
    "ipAddresses": [
      {
        "type": "management",
        "address": "192.168.1.1",
        "mask": "255.255.255.0",
        "gateway": "192.168.1.254"
      },
      {
        "type": "data",
        "address": "10.10.1.1",
        "mask": "255.255.255.0",
        "gateway": "10.10.1.254"
      }
    ],
    "connections": [
      {
        "id": "conn-001",
        "type": "network",
        "sourcePort": "Eth1/1",
        "targetDeviceId": "device-002",
        "targetDeviceName": "核心路由器-01",
        "targetPort": "Eth0/0",
        "bandwidth": "100Gbps",
        "status": "active"
      },
      {
        "id": "conn-002",
        "type": "network",
        "sourcePort": "Eth1/2",
        "targetDeviceId": "device-003",
        "targetDeviceName": "防火墙-01",
        "targetPort": "Eth1",
        "bandwidth": "40Gbps",
        "status": "active"
      }
    ],
    "purchaseDate": "2023-01-15",
    "warrantyExpiration": "2028-01-15",
    "maintenanceContract": "CISCO-MAINT-001",
    "maintenanceExpirationDate": "2026-01-15",
    "owner": "网络运维部",
    "contact": "李工",
    "contactPhone": "13800138001",
    "notes": "关键设备，需定期巡检",
    "createdAt": "2023-02-15T10:30:00Z",
    "updatedAt": "2025-03-05T14:45:00Z"
  }
}
```

## 3. 创建设备

创建新的设备。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/devices`
- **权限**: 需要`device:create`权限
- **内容类型**: `application/json`

### 请求体

```json
{
  "name": "核心交换机-02",
  "type": "network",
  "model": "Cisco Nexus 9000",
  "manufacturer": "Cisco",
  "serialNumber": "NXOS-9K-002",
  "assetNumber": "NET-004",
  "cabinetId": "cabinet-a1-2",
  "position": 38,
  "size": 4,
  "status": "online",
  "description": "备用核心网络交换机，负责数据中心内部网络互联",
  "powerConsumption": "1200W",
  "heatDissipation": "4100BTU/h",
  "weight": 25.5,
  "ipAddresses": [
    {
      "type": "management",
      "address": "192.168.1.2",
      "mask": "255.255.255.0",
      "gateway": "192.168.1.254"
    },
    {
      "type": "data",
      "address": "10.10.1.2",
      "mask": "255.255.255.0",
      "gateway": "10.10.1.254"
    }
  ],
  "purchaseDate": "2025-03-01",
  "warrantyExpiration": "2030-03-01",
  "maintenanceContract": "CISCO-MAINT-002",
  "maintenanceExpirationDate": "2028-03-01",
  "owner": "网络运维部",
  "contact": "李工",
  "contactPhone": "13800138001",
  "notes": "备用核心设备，用于高可用架构"
}
```

### 响应

```json
{
  "code": 201,
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "device-004",
    "name": "核心交换机-02",
    "type": "network",
    "model": "Cisco Nexus 9000",
    "manufacturer": "Cisco",
    "serialNumber": "NXOS-9K-002",
    "assetNumber": "NET-004",
    "cabinetId": "cabinet-a1-2",
    "cabinetName": "A1-2",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "position": 38,
    "size": 4,
    "status": "online",
    "description": "备用核心网络交换机，负责数据中心内部网络互联",
    "powerConsumption": "1200W",
    "heatDissipation": "4100BTU/h",
    "weight": 25.5,
    "ipAddresses": [
      {
        "type": "management",
        "address": "192.168.1.2",
        "mask": "255.255.255.0",
        "gateway": "192.168.1.254"
      },
      {
        "type": "data",
        "address": "10.10.1.2",
        "mask": "255.255.255.0",
        "gateway": "10.10.1.254"
      }
    ],
    "purchaseDate": "2025-03-01",
    "warrantyExpiration": "2030-03-01",
    "maintenanceContract": "CISCO-MAINT-002",
    "maintenanceExpirationDate": "2028-03-01",
    "owner": "网络运维部",
    "contact": "李工",
    "contactPhone": "13800138001",
    "notes": "备用核心设备，用于高可用架构",
    "createdAt": "2025-03-18T21:30:00Z",
    "updatedAt": "2025-03-18T21:30:00Z"
  }
}
```

## 4. 更新设备

更新指定设备的信息。

### 请求

- **方法**: `PUT`
- **路径**: `/api/v1/devices/:id`
- **权限**: 需要`device:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 请求体

```json
{
  "name": "核心交换机-02（备用）",
  "status": "standby",
  "description": "备用核心网络交换机，用于灾备切换",
  "ipAddresses": [
    {
      "type": "management",
      "address": "192.168.1.2",
      "mask": "255.255.255.0",
      "gateway": "192.168.1.254"
    },
    {
      "type": "data",
      "address": "10.10.1.2",
      "mask": "255.255.255.0",
      "gateway": "10.10.1.254"
    }
  ],
  "notes": "备用核心设备，当主设备故障时自动接管"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "device-004",
    "name": "核心交换机-02（备用）",
    "type": "network",
    "model": "Cisco Nexus 9000",
    "manufacturer": "Cisco",
    "serialNumber": "NXOS-9K-002",
    "assetNumber": "NET-004",
    "cabinetId": "cabinet-a1-2",
    "cabinetName": "A1-2",
    "roomId": "room-north-1f-a",
    "roomName": "北楼1层A区",
    "buildingId": "bld-yizhuang-north",
    "buildingName": "亦庄北楼",
    "dataCenterId": "dc-yizhuan",
    "dataCenterName": "亦庄数据中心",
    "position": 38,
    "size": 4,
    "status": "standby",
    "description": "备用核心网络交换机，用于灾备切换",
    "powerConsumption": "1200W",
    "heatDissipation": "4100BTU/h",
    "weight": 25.5,
    "ipAddresses": [
      {
        "type": "management",
        "address": "192.168.1.2",
        "mask": "255.255.255.0",
        "gateway": "192.168.1.254"
      },
      {
        "type": "data",
        "address": "10.10.1.2",
        "mask": "255.255.255.0",
        "gateway": "10.10.1.254"
      }
    ],
    "purchaseDate": "2025-03-01",
    "warrantyExpiration": "2030-03-01",
    "maintenanceContract": "CISCO-MAINT-002",
    "maintenanceExpirationDate": "2028-03-01",
    "owner": "网络运维部",
    "contact": "李工",
    "contactPhone": "13800138001",
    "notes": "备用核心设备，当主设备故障时自动接管",
    "createdAt": "2025-03-18T21:30:00Z",
    "updatedAt": "2025-03-18T22:15:00Z"
  }
}
```

## 5. 删除设备

删除指定的设备。

### 请求

- **方法**: `DELETE`
- **路径**: `/api/v1/devices/:id`
- **权限**: 需要`device:delete`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 6. 移动设备

将设备移动到新的位置。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/devices/:id/move`
- **权限**: 需要`device:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 请求体

```json
{
  "cabinetId": "cabinet-a1-3",
  "position": 30,
  "reason": "设备重新布局，优化网络连接",
  "movedBy": "张三",
  "scheduledTime": "2025-03-25T10:00:00Z"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "移动成功",
  "data": {
    "id": "device-004",
    "name": "核心交换机-02（备用）",
    "previousCabinetId": "cabinet-a1-2",
    "previousCabinetName": "A1-2",
    "previousPosition": 38,
    "cabinetId": "cabinet-a1-3",
    "cabinetName": "A1-3",
    "position": 30,
    "movedBy": "张三",
    "movedAt": "2025-03-18T22:30:00Z",
    "scheduledTime": "2025-03-25T10:00:00Z",
    "reason": "设备重新布局，优化网络连接"
  }
}
```

## 7. 更改设备状态

更改指定设备的状态。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/devices/:id/status`
- **权限**: 需要`device:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 请求体

```json
{
  "status": "maintenance",
  "reason": "定期维护，更新固件",
  "changedBy": "李四",
  "scheduledEndTime": "2025-03-20T18:00:00Z"
}
```

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "状态更改成功",
  "data": {
    "id": "device-004",
    "name": "核心交换机-02（备用）",
    "previousStatus": "standby",
    "status": "maintenance",
    "changedBy": "李四",
    "changedAt": "2025-03-18T23:00:00Z",
    "scheduledEndTime": "2025-03-20T18:00:00Z",
    "reason": "定期维护，更新固件"
  }
}
```

## 8. 添加设备连接

添加设备之间的连接关系。

### 请求

- **方法**: `POST`
- **路径**: `/api/v1/devices/:id/connections`
- **权限**: 需要`device:update`权限
- **内容类型**: `application/json`

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 源设备ID |

### 请求体

```json
{
  "type": "network",
  "sourcePort": "Eth1/3",
  "targetDeviceId": "device-005",
  "targetPort": "Eth0/1",
  "bandwidth": "100Gbps",
  "medium": "fiber",
  "length": "5m",
  "status": "active",
  "notes": "高速互联链路"
}
```

### 响应

```json
{
  "code": 201,
  "success": true,
  "message": "连接添加成功",
  "data": {
    "id": "conn-003",
    "type": "network",
    "sourceDeviceId": "device-004",
    "sourceDeviceName": "核心交换机-02（备用）",
    "sourcePort": "Eth1/3",
    "targetDeviceId": "device-005",
    "targetDeviceName": "汇聚交换机-01",
    "targetPort": "Eth0/1",
    "bandwidth": "100Gbps",
    "medium": "fiber",
    "length": "5m",
    "status": "active",
    "notes": "高速互联链路",
    "createdAt": "2025-03-18T23:15:00Z",
    "updatedAt": "2025-03-18T23:15:00Z"
  }
}
```

## 9. 获取设备连接

获取指定设备的所有连接关系。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/devices/:id/connections`
- **权限**: 需要`device:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| type | string | 否 | 按连接类型筛选 |
| status | string | 否 | 按连接状态筛选 |

### 响应

```json
{
  "code": 200,
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": "conn-003",
      "type": "network",
      "sourceDeviceId": "device-004",
      "sourceDeviceName": "核心交换机-02（备用）",
      "sourcePort": "Eth1/3",
      "targetDeviceId": "device-005",
      "targetDeviceName": "汇聚交换机-01",
      "targetPort": "Eth0/1",
      "bandwidth": "100Gbps",
      "medium": "fiber",
      "length": "5m",
      "status": "active",
      "notes": "高速互联链路",
      "createdAt": "2025-03-18T23:15:00Z",
      "updatedAt": "2025-03-18T23:15:00Z"
    },
    {
      "id": "conn-004",
      "type": "network",
      "sourceDeviceId": "device-004",
      "sourceDeviceName": "核心交换机-02（备用）",
      "sourcePort": "Eth1/4",
      "targetDeviceId": "device-006",
      "targetDeviceName": "汇聚交换机-02",
      "targetPort": "Eth0/1",
      "bandwidth": "100Gbps",
      "medium": "fiber",
      "length": "5m",
      "status": "active",
      "notes": "高速互联链路",
      "createdAt": "2025-03-18T23:20:00Z",
      "updatedAt": "2025-03-18T23:20:00Z"
    }
  ]
}
```

## 10. 获取设备历史记录

获取指定设备的历史操作记录。

### 请求

- **方法**: `GET`
- **路径**: `/api/v1/devices/:id/history`
- **权限**: 需要`device:read`权限

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| id | string | 是 | 设备ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| type | string | 否 | 按操作类型筛选 |
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |
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
        "id": "hist-001",
        "deviceId": "device-004",
        "deviceName": "核心交换机-02（备用）",
        "type": "create",
        "description": "创建设备",
        "operator": "张三",
        "operatedAt": "2025-03-18T21:30:00Z",
        "details": {
          "name": "核心交换机-02",
          "type": "network",
          "cabinetId": "cabinet-a1-2",
          "position": 38
        }
      },
      {
        "id": "hist-002",
        "deviceId": "device-004",
        "deviceName": "核心交换机-02（备用）",
        "type": "update",
        "description": "更新设备信息",
        "operator": "张三",
        "operatedAt": "2025-03-18T22:15:00Z",
        "details": {
          "name": {
            "from": "核心交换机-02",
            "to": "核心交换机-02（备用）"
          },
          "status": {
            "from": "online",
            "to": "standby"
          }
        }
      },
      {
        "id": "hist-003",
        "deviceId": "device-004",
        "deviceName": "核心交换机-02（备用）",
        "type": "move",
        "description": "移动设备",
        "operator": "张三",
        "operatedAt": "2025-03-18T22:30:00Z",
        "details": {
          "cabinetId": {
            "from": "cabinet-a1-2",
            "to": "cabinet-a1-3"
          },
          "position": {
            "from": 38,
            "to": 30
          }
        }
      },
      {
        "id": "hist-004",
        "deviceId": "device-004",
        "deviceName": "核心交换机-02（备用）",
        "type": "status_change",
        "description": "更改设备状态",
        "operator": "李四",
        "operatedAt": "2025-03-18T23:00:00Z",
        "details": {
          "status": {
            "from": "standby",
            "to": "maintenance"
          },
          "reason": "定期维护，更新固件"
        }
      },
      {
        "id": "hist-005",
        "deviceId": "device-004",
        "deviceName": "核心交换机-02（备用）",
        "type": "connection_add",
        "description": "添加设备连接",
        "operator": "王五",
        "operatedAt": "2025-03-18T23:15:00Z",
        "details": {
          "connectionId": "conn-003",
          "targetDeviceId": "device-005",
          "targetDeviceName": "汇聚交换机-01"
        }
      }
    ]
  }
}
```

## 设备类型枚举值

| 类型值 | 描述 |
|---|---|
| server | 服务器 |
| network | 网络设备 |
| storage | 存储设备 |
| security | 安全设备 |
| other | 其他设备 |

## 设备状态枚举值

| 状态值 | 描述 |
|---|---|
| online | 在线 |
| offline | 离线 |
| maintenance | 维护中 |
| fault | 故障 |
| standby | 待机 |
| decommissioned | 已退役 |
