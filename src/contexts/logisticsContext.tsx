import { createContext, useState, useEffect, ReactNode } from 'react';

// 物流状态类型
export type LogisticsStatus = 'pending' | 'scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

// 物流公司类型
export type LogisticsProviderType = 'huolala' | 'yunmanman' | 'sto' | 'yunda' | 'zto' | 'sf';

// 物流轨迹类型
export interface LogisticsTracking {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
}

// 物流订单类型
export interface LogisticsOrder {
  id: string;
  orderId: string;
  deviceId: string;
  deviceName: string;
  provider: LogisticsProviderType;
  providerName: string;
  trackingNumber: string;
  status: LogisticsStatus;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  trackingInfo: LogisticsTracking[];
  cost: number;
  distance: number;
  contactInfo: {
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 物流上下文类型
interface LogisticsContextType {
  logisticsOrders: LogisticsOrder[];
  selectedLogisticsOrder: LogisticsOrder | null;
  setSelectedLogisticsOrder: (order: LogisticsOrder | null) => void;
  createLogisticsOrder: (deviceId: string, deviceName: string, orderId: string) => Promise<LogisticsOrder>;
  trackLogistics: (trackingNumber: string, provider: LogisticsProviderType) => Promise<LogisticsTracking[]>;
  getLogisticsStatus: (trackingNumber: string, provider: LogisticsProviderType) => Promise<LogisticsStatus>;
  scheduleLogistics: (orderId: string, provider: LogisticsProviderType) => Promise<LogisticsOrder>;
  cancelLogistics: (logisticsOrderId: string) => Promise<boolean>;
}

// 创建物流上下文
export const LogisticsContext = createContext<LogisticsContextType>({
  logisticsOrders: [],
  selectedLogisticsOrder: null,
  setSelectedLogisticsOrder: () => {},
  createLogisticsOrder: async () => { throw new Error('Not implemented'); },
  trackLogistics: async () => { throw new Error('Not implemented'); },
  getLogisticsStatus: async () => { throw new Error('Not implemented'); },
  scheduleLogistics: async () => { throw new Error('Not implemented'); },
  cancelLogistics: async () => { throw new Error('Not implemented'); },
});

// 物流公司信息映射
const logisticsProviders: Record<LogisticsProviderType, { name: string; icon: string }> = {
  huolala: { name: '货拉拉', icon: 'fa-truck' },
  yunmanman: { name: '运满满', icon: 'fa-shipping-fast' },
  sto: { name: '申通快递', icon: 'fa-box' },
  yunda: { name: '韵达快递', icon: 'fa-box-open' },
  zto: { name: '中通快递', icon: 'fa-parcel' },
  sf: { name: '顺丰速运', icon: 'fa-shipping-fast' },
};

// 模拟物流订单数据
const mockLogisticsOrders: LogisticsOrder[] = [
  {
    id: 'logistics1',
    orderId: 'order1',
    deviceId: '1',
    deviceName: 'PET全自动吹瓶机PET-1200',
    provider: 'huolala',
    providerName: '货拉拉',
    trackingNumber: 'HL1234567890',
    status: 'delivered',
    estimatedDeliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    trackingInfo: [
      { id: 't1', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), location: '上海市浦东新区', status: '订单已创建，等待安排车辆' },
      { id: 't2', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), location: '上海市浦东新区', status: '已安排车辆，司机正在前往装货地点' },
      { id: 't3', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), location: '上海市浦东新区', status: '司机已到达装货地点，开始装货' },
      { id: 't4', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), location: '上海市浦东新区', status: '装货完成，车辆已出发' },
      { id: 't5', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), location: '江苏省苏州市', status: '车辆已到达中转站' },
      { id: 't6', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), location: '浙江省杭州市', status: '车辆已到达目的地城市' },
      { id: 't7', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), location: '浙江省杭州市余杭区', status: '司机已到达卸货地点，开始卸货' },
      { id: 't8', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), location: '浙江省杭州市余杭区', status: '卸货完成，货物已交付' },
    ],
    cost: 1800,
    distance: 250,
    contactInfo: {
      senderName: '张三',
      senderPhone: '138****1234',
      receiverName: '李四',
      receiverPhone: '139****5678',
      pickupAddress: '上海市浦东新区张江高科技园区博云路2号',
      deliveryAddress: '浙江省杭州市余杭区文一西路969号',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
  },
  {
    id: 'logistics2',
    orderId: 'order2',
    deviceId: '3',
    deviceName: '注塑机IM-1000',
    provider: 'yunmanman',
    providerName: '运满满',
    trackingNumber: 'YM1234567890',
    status: 'in_transit',
    estimatedDeliveryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    trackingInfo: [
      { id: 't1', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), location: '广东省深圳市', status: '订单已创建，等待安排车辆' },
      { id: 't2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), location: '广东省深圳市', status: '已安排车辆，司机正在前往装货地点' },
      { id: 't3', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), location: '广东省深圳市', status: '司机已到达装货地点，开始装货' },
      { id: 't4', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), location: '广东省深圳市', status: '装货完成，车辆已出发' },
      { id: 't5', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), location: '广东省广州市', status: '车辆已到达中转站' },
      { id: 't6', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), location: '湖南省长沙市', status: '车辆已进入湖南境内' },
    ],
    cost: 2500,
    distance: 800,
    contactInfo: {
      senderName: '王五',
      senderPhone: '137****9012',
      receiverName: '赵六',
      receiverPhone: '136****3456',
      pickupAddress: '广东省深圳市南山区科技园',
      deliveryAddress: '湖南省长沙市岳麓区麓谷大道',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

  // 物流提供者组件
  export function LogisticsProvider({ children }: { children: ReactNode }) {
  const [logisticsOrders, setLogisticsOrders] = useState<LogisticsOrder[]>(() => {
    // 从localStorage加载物流订单数据
    const savedLogisticsOrders = localStorage.getItem('logisticsOrders');
    if (savedLogisticsOrders) {
      try {
        const parsedOrders = JSON.parse(savedLogisticsOrders);
        // 转换时间戳字符串回Date对象
        return parsedOrders.map((order: any) => ({
          ...order,
          estimatedDeliveryTime: new Date(order.estimatedDeliveryTime),
          actualDeliveryTime: order.actualDeliveryTime ? new Date(order.actualDeliveryTime) : undefined,
          trackingInfo: order.trackingInfo.map((tracking: any) => ({
            ...tracking,
            timestamp: new Date(tracking.timestamp)
          })),
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }));
      } catch (error) {
        console.error('Failed to parse saved logistics orders:', error);
      }
    }
    // 提供默认物流订单数据
    return mockLogisticsOrders;
  });

  const [selectedLogisticsOrder, setSelectedLogisticsOrder] = useState<LogisticsOrder | null>(null);

  // 保存物流订单数据到localStorage
  useEffect(() => {
    localStorage.setItem('logisticsOrders', JSON.stringify(logisticsOrders));
  }, [logisticsOrders]);

  // 创建物流订单
  const createLogisticsOrder = async (deviceId: string, deviceName: string, orderId: string): Promise<LogisticsOrder> => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成随机物流公司
      const providers: LogisticsProviderType[] = ['huolala', 'yunmanman'];
      const randomProvider = providers[Math.floor(Math.random() * providers.length)];
      const providerInfo = logisticsProviders[randomProvider];
      
      const newOrder: LogisticsOrder = {
        id: `logistics_${Date.now()}`,
        orderId,
        deviceId,
        deviceName,
        provider: randomProvider,
        providerName: providerInfo.name,
        trackingNumber: `${randomProvider === 'huolala' ? 'HL' : 'YM'}${Math.floor(Math.random() * 10000000000)}`,
        status: 'pending',
        estimatedDeliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        trackingInfo: [
          { 
            id: `t_${Date.now()}`, 
            timestamp: new Date(), 
            location: '系统', 
            status: '订单已创建，等待安排车辆' 
          }
        ],
        cost: Math.floor(Math.random() * 3000) + 1000,
        distance: Math.floor(Math.random() * 1000) + 100,
        contactInfo: {
          senderName: '系统默认',
          senderPhone: '138****1234',
          receiverName: '系统默认',
          receiverPhone: '139****5678',
          pickupAddress: '默认发货地址',
          deliveryAddress: '默认收货地址',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setLogisticsOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error('Failed to create logistics order:', error);
      throw error;
    }
  };

  // 追踪物流
  const trackLogistics = async (trackingNumber: string, provider: LogisticsProviderType): Promise<LogisticsTracking[]> => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 查找对应的物流订单
      const logisticsOrder = logisticsOrders.find(order => 
        order.trackingNumber === trackingNumber && order.provider === provider
      );
      
      if (logisticsOrder) {
        return logisticsOrder.trackingInfo;
      }
      
      // 如果没有找到，返回模拟数据
      return [
        { id: 't1', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), location: '未知', status: '物流信息已生成' },
        { id: 't2', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), location: '未知', status: '货物已发出' },
      ];
    } catch (error) {
      console.error('Failed to track logistics:', error);
      throw error;
    }
  };

  // 获取物流状态
  const getLogisticsStatus = async (trackingNumber: string, provider: LogisticsProviderType): Promise<LogisticsStatus> => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 查找对应的物流订单
      const logisticsOrder = logisticsOrders.find(order => 
        order.trackingNumber === trackingNumber && order.provider === provider
      );
      
      if (logisticsOrder) {
        return logisticsOrder.status;
      }
      
      // 如果没有找到，返回默认状态
      return 'pending';
    } catch (error) {
      console.error('Failed to get logistics status:', error);
      throw error;
    }
  };

  // 安排物流
  const scheduleLogistics = async (orderId: string, provider: LogisticsProviderType): Promise<LogisticsOrder> => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 查找对应的物流订单
      const logisticsOrder = logisticsOrders.find(order => order.orderId === orderId);
      
      if (logisticsOrder) {
        const updatedOrder: LogisticsOrder = {
          ...logisticsOrder,
          provider,
          providerName: logisticsProviders[provider].name,
          status: 'scheduled',
          updatedAt: new Date(),
          trackingInfo: [
            ...logisticsOrder.trackingInfo,
            { 
              id: `t_${Date.now()}`, 
              timestamp: new Date(), 
              location: '系统', 
              status: '已安排物流，等待司机接单' 
            }
          ]
        };
        
        setLogisticsOrders(prev => prev.map(order => 
          order.id === logisticsOrder.id ? updatedOrder : order
        ));
        
        return updatedOrder;
      }
      
      // 如果没有找到，抛出错误
      throw new Error('Logistics order not found');
    } catch (error) {
      console.error('Failed to schedule logistics:', error);
      throw error;
    }
  };

  // 取消物流
  const cancelLogistics = async (logisticsOrderId: string): Promise<boolean> => {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 查找对应的物流订单
      const logisticsOrder = logisticsOrders.find(order => order.id === logisticsOrderId);
      
      if (logisticsOrder) {
        const updatedOrder: LogisticsOrder = {
          ...logisticsOrder,
          status: 'cancelled',
          updatedAt: new Date(),
          trackingInfo: [
            ...logisticsOrder.trackingInfo,
            { 
              id: `t_${Date.now()}`, 
              timestamp: new Date(), 
              location: '系统', 
              status: '物流订单已取消' 
            }
          ]
        };
        
        setLogisticsOrders(prev => prev.map(order => 
          order.id === logisticsOrder.id ? updatedOrder : order
        ));
        
        return true;
      }
      
      // 如果没有找到，抛出错误
      throw new Error('Logistics order not found');
    } catch (error) {
      console.error('Failed to cancel logistics:', error);
      throw error;
    }
  };

  const value = {
    logisticsOrders,
    selectedLogisticsOrder,
    setSelectedLogisticsOrder,
    createLogisticsOrder,
    trackLogistics,
    getLogisticsStatus,
    scheduleLogistics,
    cancelLogistics
  };

  return (
    <LogisticsContext.Provider value={value}>
      {children}
    </LogisticsContext.Provider>
  );
}