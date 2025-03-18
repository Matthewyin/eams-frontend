/**
 * 数据中心和机房机柜相关API
 */

import http from './http'

/**
 * 获取所有数据中心信息
 * @returns {Promise<Object>}
 */
export function getDataCenters() {
  // 由于后端API尚未就绪，返回模拟数据
  return Promise.resolve({
    code: 200,
    data: generateMockDataCenters(),
    message: 'success',
    success: true
  })
}

/**
 * 获取单个数据中心详情
 * @param {string} id 数据中心ID
 * @returns {Promise<Object>}
 */
export function getDataCenterById(id) {
  // 由于后端API尚未就绪，返回模拟数据
  const allDataCenters = generateMockDataCenters()
  const dataCenter = allDataCenters.find(dc => dc.id === id)
  
  return Promise.resolve({
    code: 200,
    data: dataCenter || null,
    message: dataCenter ? 'success' : 'not found',
    success: !!dataCenter
  })
}

/**
 * 生成模拟数据中心数据
 * @returns {Array} 数据中心数组
 */
function generateMockDataCenters() {
  // 生成模拟数据
  return [
    {
      id: 'dc-yizhuan',
      name: '亦庄数据中心',
      location: '北京亦庄经济开发区',
      status: 'online',
      buildings: [
        {
          id: 'bld-yizhuang-north',
          name: '亦庄北楼',
          rooms: [
            ...generateMockRooms('block', 1, 4)
          ]
        },
        {
          id: 'bld-yizhuang-south',
          name: '亦庄南楼',
          rooms: [
            ...generateMockRooms('block', 5, 8)
          ]
        }
      ]
    },
    {
      id: 'dc-xiwuhuan',
      name: '西五环射击场数据中心',
      location: '北京市海淀区西五环',
      status: 'online',
      buildings: [
        {
          id: 'bld-xiwuhuan-east',
          name: '西五环射击场东楼机房',
          rooms: [
            ...generateMockRooms('block', 9, 10)
          ]
        },
        {
          id: 'bld-xiwuhuan-west',
          name: '西五环射击场西楼机房',
          rooms: [
            ...generateMockRooms('block', 11, 12)
          ]
        }
      ]
    },
    {
      id: 'dc-yijing',
      name: '翌景数据中心',
      location: '北京市朝阳区翌景大厦',
      status: 'online',
      buildings: [
        {
          id: 'bld-yijing',
          name: '翌景大厦',
          rooms: [
            {
              id: 'room-yijing-6f',
              name: '翌景6层机房',
              status: 'normal',
              cabinetRows: generateCabinetRows()
            }
          ]
        }
      ]
    }
  ]
}

/**
 * 生成机房数据
 * @param {string} prefix 机房名称前缀
 * @param {number} start 起始编号
 * @param {number} end 结束编号
 * @returns {Array} 机房数组
 */
function generateMockRooms(prefix, start, end) {
  const rooms = []
  for (let i = start; i <= end; i++) {
    rooms.push({
      id: `room-${prefix}${i}`,
      name: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${i}`,
      status: 'normal',
      cabinetRows: generateCabinetRows()
    })
  }
  return rooms
}

/**
 * 生成机柜列数据
 * @returns {Array} 机柜列数组
 */
function generateCabinetRows() {
  const rows = []
  // 生成A-N共14列机柜
  for (let i = 0; i < 14; i++) {
    const rowName = String.fromCharCode(65 + i) // 65是ASCII中'A'的编码
    const isNetwork = i < 4 // A,B,C,D是网络机柜
    
    rows.push({
      id: `row-${rowName}`,
      name: `${rowName}列`,
      type: isNetwork ? 'network' : 'server',
      cabinets: generateCabinets(rowName, isNetwork)
    })
  }
  return rows
}

/**
 * 生成单列中的机柜数据
 * @param {string} rowName 列名称
 * @param {boolean} isNetwork 是否为网络机柜
 * @returns {Array} 机柜数组
 */
function generateCabinets(rowName, isNetwork) {
  const cabinets = []
  // 每列假设有10个机柜
  for (let i = 1; i <= 10; i++) {
    // 为每个机柜生成设备列表
    const devices = generateDevices(rowName, i, isNetwork)
    // 根据设备列表生成对应的占用单元
    const units = generateRackUnitsFromDevices(devices, 42)
    
    cabinets.push({
      id: `cabinet-${rowName}${i}`,
      name: `${rowName}${i}`,
      type: isNetwork ? 'network' : 'server',
      width: isNetwork ? 800 : 600, // 网络机柜和服务器机柜宽度不同
      height: 42, // 42U
      status: 'normal',
      devices, // 添加设备列表
      units // 根据设备生成的单元
    })
  }
  return cabinets
}

/**
 * 根据设备列表生成机柜单元占用情况
 * @param {Array} devices 设备列表
 * @param {number} count 单元总数
 * @returns {Array} 机柜单元数组
 */
function generateRackUnitsFromDevices(devices, count) {
  const units = []
  for (let i = 1; i <= count; i++) {
    // 检查当前U位是否被某个设备占用
    const occupyingDevice = devices.find(device => {
      const startU = device.position;
      const endU = device.position + device.size - 1;
      return i >= startU && i <= endU;
    });
    
    units.push({
      id: `ru-${i}`,
      position: i,
      occupied: !!occupyingDevice,
      deviceId: occupyingDevice ? occupyingDevice.id : null
    })
  }
  return units
}

/**
 * 生成机柜设备数据
 * @param {string} rowName 机柜所在行名称
 * @param {number} cabinetNumber 机柜编号
 * @param {boolean} isNetwork 是否为网络机柜
 * @returns {Array} 设备列表
 */
function generateDevices(rowName, cabinetNumber, isNetwork) {
  const devices = [];
  const deviceCount = Math.floor(Math.random() * 6) + 2; // 2-7个设备
  
  // 已占用的U位，用于避免设备重叠
  const occupiedPositions = new Set();
  
  // 为机柜生成随机设备
  for (let i = 0; i < deviceCount; i++) {
    // 设备类型基于机柜类型
    let deviceType;
    if (isNetwork) {
      // 网络机柜主要是网络和安全设备
      deviceType = Math.random() > 0.3 ? 'network' : 'security';
    } else {
      // 服务器机柜主要是服务器，也有少量存储和其他设备
      const rand = Math.random();
      if (rand < 0.7) deviceType = 'server';
      else if (rand < 0.9) deviceType = 'storage';
      else deviceType = 'other';
    }
    
    // 根据设备类型确定设备大小（占用U数）
    let deviceSize;
    switch (deviceType) {
      case 'server':
        deviceSize = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : 4); // 1U/2U/4U 服务器
        break;
      case 'network':
        deviceSize = Math.random() > 0.7 ? 1 : 2; // 大部分是1U的网络设备，少数2U
        break;
      case 'storage':
        deviceSize = Math.random() > 0.5 ? 2 : 4; // 存储设备一般占2U或4U
        break;
      case 'security':
        deviceSize = Math.random() > 0.8 ? 2 : 1; // 安全设备多为1U，少数2U
        break;
      case 'other':
        deviceSize = 1; // 其他设备假设为1U
        break;
      default:
        deviceSize = 1;
    }
    
    // 尝试找个位置放置这个设备
    let position;
    let attempts = 0;
    const maxAttempts = 20; // 最大尝试次数，避免死循环
    
    do {
      attempts++;
      // 在1-42之间随机选择一个起始U位
      position = Math.floor(Math.random() * (42 - deviceSize + 1)) + 1;
      
      // 判断是否与已占用的位置冲突
      let conflicted = false;
      for (let u = position; u < position + deviceSize; u++) {
        if (occupiedPositions.has(u)) {
          conflicted = true;
          break;
        }
      }
      
      // 如果不冲突，这个位置可用
      if (!conflicted) break;
      
      // 如果尝试次数过多，减小设备尺寸或跳过这个设备
      if (attempts > maxAttempts) {
        if (deviceSize > 1) {
          deviceSize--;
          attempts = 0;
        } else {
          position = null; // 无法放置，跳过这个设备
          break;
        }
      }
    } while (true);
    
    // 如果找到有效位置，添加设备并标记占用的U位
    if (position !== null) {
      const device = {
        id: `device-${rowName}${cabinetNumber}-${i+1}`,
        name: getDeviceName(deviceType, i),
        type: deviceType,
        position: position,
        size: deviceSize
      };
      devices.push(device);
      
      // 标记占用的U位
      for (let u = position; u < position + deviceSize; u++) {
        occupiedPositions.add(u);
      }
    }
  }
  
  // 按位置从低到高排序设备
  return devices.sort((a, b) => a.position - b.position);
}

/**
 * 获取随机设备类型
 * @returns {string} 设备类型
 */
function getRandomDeviceType() {
  const types = ['server', 'network', 'storage', 'security', 'other']
  return types[Math.floor(Math.random() * types.length)]
}

/**
 * 根据设备类型生成设备名称
 * @param {string} type 设备类型
 * @param {number} index 索引
 * @returns {string} 设备名称
 */
function getDeviceName(type, index) {
  const manufacturers = {
    server: ['Dell', 'HP', 'IBM', 'Lenovo', 'Huawei', 'Inspur'],
    network: ['Cisco', 'H3C', 'Huawei', 'Juniper', 'Ruijie'],
    storage: ['EMC', 'NetApp', 'IBM', 'Huawei', 'Dell'],
    security: ['Fortinet', 'Paloalto', 'Checkpoint', 'H3C', 'Huawei'],
    other: ['Generic', 'Custom', 'APC']
  };
  
  const models = {
    server: ['PowerEdge', 'ProLiant', 'ThinkSystem', 'FusionServer', 'NF'],
    network: ['Catalyst', 'Nexus', 'S Series', 'QFX', 'CloudEngine'],
    storage: ['Unity', 'FAS', 'Dorado', 'V Series', 'PowerStore'],
    security: ['FortiGate', 'PA', 'Firewall', 'USG', 'NGFW'],
    other: ['PDU', 'Console', 'KVM']
  };
  
  const typeManu = manufacturers[type] || manufacturers.other;
  const typeModel = models[type] || models.other;
  
  const manu = typeManu[Math.floor(Math.random() * typeManu.length)];
  const model = typeModel[Math.floor(Math.random() * typeModel.length)];
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${manu} ${model}-${suffix}`;
}

/**
 * 获取随机设备名称 (兼容原有代码)
 * @returns {string} 设备名称
 */
function getRandomDeviceName() {
  return getDeviceName(getRandomDeviceType(), 0);
}
