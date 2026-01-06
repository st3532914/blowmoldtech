import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

// 设备类型定义
export interface Device {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  condition: string;
  images: string[];
  sellerType: 'platform' | 'user';
  sellerName: string;
  location: string;
  warranty: string;
  viewCount: number;
  isFeatured?: boolean;
}

// 设备卡片属性
interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const { theme } = useTheme();
  
  // 计算折扣
  const discount = Math.round((1 - device.price / device.originalPrice) * 100);
  
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      className={`rounded-16 overflow-hidden cursor-pointer transition-all ${
        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
      }`}
      onClick={onClick}
    >
      {/* 设备图片 */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={device.images[0]} 
          alt={device.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* 设备类型标签 */}
        <div className="absolute top-3 left-3">
          {device.sellerType === 'platform' ? (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">自营</span>
          ) : (
            <span className={`text-xs px-2 py-1 rounded-full ${
              theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
            }`}>个人</span>
          )}
        </div>
        
        {/* 设备状态标签 */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
          }`}>{device.condition}</span>
        </div>
        
        {/* 折扣标签 */}
        {device.originalPrice > device.price && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {discount}% 优惠
          </div>
        )}
      </div>
      
      {/* 设备信息 */}
      <div className="p-4">
        {/* 设备名称 */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{device.name}</h3>
        
        {/* 价格信息 */}
        <div className="flex items-baseline mb-2">
          <span className="text-red-500 font-bold text-xl mr-2">¥{device.price}</span>
          {device.originalPrice > device.price && (
            <span className={`text-sm line-through ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>¥{device.originalPrice}</span>
          )}
        </div>
        
        {/* 卖家和位置信息 */}
        <div className="flex justify-between items-center text-sm">
          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {device.sellerName}
          </span>
          <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <i className="fas fa-map-marker-alt mr-1"></i> {device.location}
          </span>
        </div>
        
        {/* 质保和浏览量信息 */}
        <div className="flex justify-between items-center mt-2 text-xs">
          {device.warranty && (
            <span className={`flex items-center ${
              device.sellerType === 'platform' 
                ? 'text-blue-500' 
                : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
            }`}>
              <i className="fas fa-shield-alt mr-1"></i> {device.warranty}质保
            </span>
          )}
          <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <i className="fas fa-eye mr-1"></i> {device.viewCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};