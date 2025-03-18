# 数据模型

本文档描述了数据中心管理系统中使用的主要数据模型及其关系。

## 1. 数据中心 (DataCenter)

数据中心是系统中的顶级资源，包含多个建筑。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 数据中心唯一标识符 |
| name | string | 数据中心名称 |
| location | string | 地理位置 |
| address | string | 详细地址 |
| area | number | 占地面积（平方米） |
| status | string | 状态，参考数据中心状态枚举值 |
| totalBuildings | integer | 建筑总数 |
| totalRooms | integer | 机房总数 |
| totalCabinets | integer | 机柜总数 |
| totalDevices | integer | 设备总数 |
| powerCapacity | string | 电力容量 |
| coolingCapacity | string | 制冷容量 |
| description | string | 描述信息 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 2. 建筑 (Building)

建筑是数据中心内的物理建筑，包含多个机房。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 建筑唯一标识符 |
| name | string | 建筑名称 |
| dataCenterId | string | 所属数据中心ID |
| dataCenterName | string | 所属数据中心名称 |
| floors | integer | 楼层数 |
| area | number | 建筑面积（平方米） |
| status | string | 状态，参考建筑状态枚举值 |
| totalRooms | integer | 机房总数 |
| totalCabinets | integer | 机柜总数 |
| totalDevices | integer | 设备总数 |
| powerCapacity | string | 电力容量 |
| coolingCapacity | string | 制冷容量 |
| description | string | 描述信息 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 3. 机房 (Room)

机房是建筑内的专用房间，用于放置机柜和设备。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 机房唯一标识符 |
| name | string | 机房名称 |
| buildingId | string | 所属建筑ID |
| buildingName | string | 所属建筑名称 |
| dataCenterId | string | 所属数据中心ID |
| dataCenterName | string | 所属数据中心名称 |
| floor | integer | 所在楼层 |
| area | number | 面积（平方米） |
| status | string | 状态，参考机房状态枚举值 |
| raisedFloor | boolean | 是否有架空地板 |
| totalCabinetRows | integer | 机柜行总数 |
| totalCabinets | integer | 机柜总数 |
| totalDevices | integer | 设备总数 |
| powerCapacity | string | 电力容量 |
| coolingCapacity | string | 制冷容量 |
| description | string | 描述信息 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 4. 机柜行 (CabinetRow)

机柜行是机房内的机柜排列单元，包含多个机柜。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 机柜行唯一标识符 |
| name | string | 机柜行名称 |
| roomId | string | 所属机房ID |
| roomName | string | 所属机房名称 |
| buildingId | string | 所属建筑ID |
| buildingName | string | 所属建筑名称 |
| dataCenterId | string | 所属数据中心ID |
| dataCenterName | string | 所属数据中心名称 |
| type | string | 类型，如网络、服务器等 |
| orientation | string | 朝向，如horizontal、vertical |
| position | object | 位置坐标 |
| width | number | 宽度 |
| depth | number | 深度 |
| cabinetCount | integer | 机柜数量 |
| usageRate | number | 使用率 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 5. 机柜 (Cabinet)

机柜是放置设备的标准单元。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 机柜唯一标识符 |
| name | string | 机柜名称 |
| type | string | 类型，参考机柜类型枚举值 |
| specification | string | 规格说明 |
| model | string | 型号 |
| manufacturer | string | 制造商 |
| serialNumber | string | 序列号 |
| assetNumber | string | 资产编号 |
| width | integer | 宽度（毫米） |
| height | integer | 高度（U） |
| depth | integer | 深度（毫米） |
| maxWeight | number | 最大承重（千克） |
| status | string | 状态，参考机柜状态枚举值 |
| roomId | string | 所属机房ID |
| roomName | string | 所属机房名称 |
| buildingId | string | 所属建筑ID |
| buildingName | string | 所属建筑名称 |
| dataCenterId | string | 所属数据中心ID |
| dataCenterName | string | 所属数据中心名称 |
| rowId | string | 所属机柜行ID |
| rowName | string | 所属机柜行名称 |
| position | object | 位置坐标 |
| usageRate | number | 使用率 |
| usedUnits | integer | 已使用U数 |
| totalUnits | integer | 总U数 |
| powerCapacity | string | 电力容量 |
| usedPower | string | 已使用电力 |
| powerUsageRate | number | 电力使用率 |
| purchaseDate | string | 购买日期 |
| warrantyExpiration | string | 保修到期日 |
| notes | string | 备注 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 6. 设备 (Device)

设备是安装在机柜中的硬件设备。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 设备唯一标识符 |
| name | string | 设备名称 |
| type | string | 类型，参考设备类型枚举值 |
| model | string | 型号 |
| manufacturer | string | 制造商 |
| serialNumber | string | 序列号 |
| assetNumber | string | 资产编号 |
| cabinetId | string | 所属机柜ID |
| cabinetName | string | 所属机柜名称 |
| roomId | string | 所属机房ID |
| roomName | string | 所属机房名称 |
| buildingId | string | 所属建筑ID |
| buildingName | string | 所属建筑名称 |
| dataCenterId | string | 所属数据中心ID |
| dataCenterName | string | 所属数据中心名称 |
| position | integer | 在机柜中的起始位置（U） |
| size | integer | 设备高度（U） |
| status | string | 状态，参考设备状态枚举值 |
| description | string | 描述信息 |
| powerConsumption | string | 功耗 |
| heatDissipation | string | 散热量 |
| weight | number | 重量（千克） |
| ipAddresses | array | IP地址列表 |
| connections | array | 连接关系列表 |
| purchaseDate | string | 购买日期 |
| warrantyExpiration | string | 保修到期日 |
| maintenanceContract | string | 维保合同编号 |
| maintenanceExpirationDate | string | 维保到期日 |
| owner | string | 所有者/部门 |
| contact | string | 联系人 |
| contactPhone | string | 联系电话 |
| notes | string | 备注 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 7. IP地址 (IPAddress)

设备的IP地址信息。

| 字段名 | 类型 | 描述 |
|---|---|---|
| type | string | 类型，如management、data等 |
| address | string | IP地址 |
| mask | string | 子网掩码 |
| gateway | string | 网关地址 |

## 8. 设备连接 (Connection)

设备之间的连接关系。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 连接唯一标识符 |
| type | string | 连接类型，如network、power等 |
| sourceDeviceId | string | 源设备ID |
| sourceDeviceName | string | 源设备名称 |
| sourcePort | string | 源设备端口 |
| targetDeviceId | string | 目标设备ID |
| targetDeviceName | string | 目标设备名称 |
| targetPort | string | 目标设备端口 |
| bandwidth | string | 带宽（网络连接） |
| medium | string | 介质，如fiber、copper等 |
| length | string | 长度 |
| status | string | 状态 |
| notes | string | 备注 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 9. 告警 (Alert)

系统告警信息。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 告警唯一标识符 |
| level | string | 告警级别，如critical、warning、info |
| type | string | 告警类型，如power、cooling、security等 |
| message | string | 告警消息 |
| location | string | 告警位置 |
| resourceId | string | 相关资源ID |
| resourceType | string | 相关资源类型 |
| timestamp | string | 告警时间 |
| status | string | 状态，如active、acknowledged、resolved |
| acknowledgedBy | string | 确认人 |
| acknowledgedAt | string | 确认时间 |
| resolvedBy | string | 解决人 |
| resolvedAt | string | 解决时间 |
| notes | string | 备注 |

## 10. 用户 (User)

系统用户信息。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 用户唯一标识符 |
| username | string | 用户名 |
| name | string | 姓名 |
| email | string | 电子邮箱 |
| phone | string | 电话 |
| department | string | 部门 |
| role | string | 角色 |
| permissions | array | 权限列表 |
| status | string | 状态，如active、inactive |
| lastLogin | string | 最后登录时间 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 11. 操作日志 (OperationLog)

系统操作日志。

| 字段名 | 类型 | 描述 |
|---|---|---|
| id | string | 日志唯一标识符 |
| userId | string | 操作用户ID |
| username | string | 操作用户名 |
| action | string | 操作类型 |
| resourceType | string | 资源类型 |
| resourceId | string | 资源ID |
| details | object | 操作详情 |
| ip | string | 操作IP |
| userAgent | string | 用户代理 |
| timestamp | string | 操作时间 |

## 数据模型关系图

```
DataCenter
    |
    +-- Building
          |
          +-- Room
                |
                +-- CabinetRow
                      |
                      +-- Cabinet
                            |
                            +-- Device
                                  |
                                  +-- IPAddress
                                  |
                                  +-- Connection
```

## 状态枚举值

### 数据中心状态

| 状态值 | 描述 |
|---|---|
| operational | 运营中 |
| maintenance | 维护中 |
| construction | 建设中 |
| decommissioned | 已退役 |

### 建筑状态

| 状态值 | 描述 |
|---|---|
| operational | 运营中 |
| maintenance | 维护中 |
| construction | 建设中 |
| renovation | 翻新中 |
| decommissioned | 已退役 |

### 机房状态

| 状态值 | 描述 |
|---|---|
| normal | 正常 |
| maintenance | 维护中 |
| construction | 建设中 |
| renovation | 翻新中 |
| decommissioned | 已退役 |

### 机柜类型

| 类型值 | 描述 |
|---|---|
| server | 服务器机柜 |
| network | 网络机柜 |
| storage | 存储机柜 |
| other | 其他类型 |

### 机柜状态

| 状态值 | 描述 |
|---|---|
| normal | 正常 |
| maintenance | 维护中 |
| reserved | 已预留 |
| fault | 故障 |
| decommissioned | 已退役 |

### 设备类型

| 类型值 | 描述 |
|---|---|
| server | 服务器 |
| network | 网络设备 |
| storage | 存储设备 |
| security | 安全设备 |
| other | 其他设备 |

### 设备状态

| 状态值 | 描述 |
|---|---|
| online | 在线 |
| offline | 离线 |
| maintenance | 维护中 |
| fault | 故障 |
| standby | 待机 |
| decommissioned | 已退役 |
