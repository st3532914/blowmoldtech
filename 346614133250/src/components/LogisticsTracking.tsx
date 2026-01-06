import React, { useContext } from 'react';
import { LogisticsOrder, LogisticsStatus } from '../contexts/logisticsContext';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

interface LogisticsTrackingProps {
  logisticsOrder: LogisticsOrder;
}

export const LogisticsTracking: React.FC<LogisticsTrackingProps> = ({ logisticsOrder }) => {
  const { theme } = useTheme();


  // 获取物流状态显示文本和颜色
  const getStatusInfo = (status: LogisticsStatus): { text: string; color: string } => {
    switch (status) {
      case 'pending':
        return { text: '待安排', color: 'text-gray-500' };
      case 'scheduled':
        return { text: '已安排', color: 'text-blue-500' };
      case 'picked_up':
        return { text: '已取货', color: 'text-blue-600' };
      case 'in_transit':
        return { text: '运输中', color: 'text-green-500' };
      case 'delivered':
        return { text: '已送达', color: 'text-green-600' };
      case 'cancelled':
        return { text: '已取消', color: 'text-red-500' };
      default:
        return { text: '未知状态', color: 'text-gray-500' };
    }
  };

  // 格式化日期时间
  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 格式化日期
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 跟踪点动画变量
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // 找出最新的物流状态
  const latestTrackingInfo = logisticsOrder.trackingInfo[logisticsOrder.trackingInfo.length - 1];
  const statusInfo = getStatusInfo(logisticsOrder.status);

  return (
    <div className={`rounded-16 p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      {/* 物流头部信息 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'
          }`}>
            <i className={`fas fa-truck text-xl ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}></i>
          </div>
          <div>
            <h3 className="text-lg font-bold">{logisticsOrder.providerName}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              运单号: {logisticsOrder.trackingNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* 物流状态时间线 */}
      <motion.div 
        className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 ml-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {logisticsOrder.trackingInfo.map((tracking, index) => (
          <motion.div 
            key={tracking.id}
            className="mb-6 relative"
            variants={itemVariants}
          >
            {/* 时间点 */}
            <div className={`absolute -left-[53px] w-5 h-5 rounded-full flex items-center justify-center ${
              index === logisticsOrder.trackingInfo.length - 1
                ? 'bg-blue-500'
                : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              {index === logisticsOrder.trackingInfo.length - 1 && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            
            {/* 物流信息 */}
            <div>
              <p className={`font-medium ${
                index === logisticsOrder.trackingInfo.length - 1 ? statusInfo.color : ''
              }`}>
                {tracking.status}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>{tracking.location}</span>
                <span className="sm:mx-2 mt-1 sm:mt-0">|</span>
                <span>{formatDateTime(tracking.timestamp)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 物流详情信息 */}
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h4 className="font-medium mb-3">物流详情</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>预计送达时间</p>
            <p>{formatDate(logisticsOrder.estimatedDeliveryTime)}</p>
          </div>
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>实际送达时间</p>
            <p>{logisticsOrder.actualDeliveryTime ? formatDate(logisticsOrder.actualDeliveryTime) : '待送达'}</p>
          </div>
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>运输距离</p>
            <p>{logisticsOrder.distance} 公里</p>
          </div>
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>物流费用</p>
            <p className="text-red-500">¥{logisticsOrder.cost}</p>
          </div>
        </div>
      </div>
    </div>
  );
};