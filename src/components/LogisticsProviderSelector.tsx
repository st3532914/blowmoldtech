import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { LogisticsProviderType } from '../contexts/logisticsContext';

interface LogisticsProviderOption {
  id: LogisticsProviderType;
  name: string;
  icon: string;
  description: string;
  price: number;
  estimatedTime: string;
  rating: number;
}

interface LogisticsProviderSelectorProps {
  onSelectProvider: (provider: LogisticsProviderType) => void;
  selectedProvider?: LogisticsProviderType;
}

export const LogisticsProviderSelector: React.FC<LogisticsProviderSelectorProps> = ({ 
  onSelectProvider,
  selectedProvider 
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  // 物流公司选项
  const providers: LogisticsProviderOption[] = [
    {
      id: 'huolala',
      name: '货拉拉',
      icon: 'fa-truck',
      description: '专业的同城/跨城货运服务，提供各类车型选择',
      price: 1800,
      estimatedTime: '1-2天',
      rating: 4.8,
    },
    {
      id: 'yunmanman',
      name: '运满满',
      icon: 'fa-shipping-fast',
      description: '全国性物流服务平台，覆盖各类货物运输需求',
      price: 2200,
      estimatedTime: '2-3天',
      rating: 4.7,
    },
    {
      id: 'sto',
      name: '申通快递',
      icon: 'fa-box',
      description: '适合小件设备及配件运输，全国网点覆盖广',
      price: 800,
      estimatedTime: '3-5天',
      rating: 4.5,
    },
    {
      id: 'yunda',
      name: '韵达快递',
      icon: 'fa-box-open',
      description: '经济实惠的运输服务，适合非紧急货物',
      price: 700,
      estimatedTime: '4-6天',
      rating: 4.4,
    },
  ];

  // 动画变量
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // 处理选择物流公司
  const handleSelectProvider = (provider: LogisticsProviderType) => {
    onSelectProvider(provider);
    if (window.innerWidth < 768) {
      setExpanded(false);
    }
  };

  // 获取选中的物流公司信息
  const getSelectedProvider = () => {
    return providers.find(provider => provider.id === selectedProvider);
  };

  // 渲染星级评分
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index}
              className={`fas ${index < Math.floor(rating) ? 'fa-star text-yellow-400' : 'fa-star text-gray-300'}`}
            ></i>
          ))}
        </div>
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={`rounded-16 overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      {/* 选择器头部 */}
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer ${
          theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
        } transition-colors`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'
          }`}>
            <i className={`fas fa-truck ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}></i>
          </div>
          <div>
            <h3 className="font-medium">选择物流公司</h3>
            {selectedProvider && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                当前选择: {getSelectedProvider()?.name}
              </p>
            )}
          </div>
        </div>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-500 dark:text-gray-400`}></i>
      </div>
      
      {/* 物流公司列表 */}
      <motion.div
        variants={containerVariants}
        initial={expanded ? 'visible' : 'hidden'}
        animate={expanded ? 'visible' : 'hidden'}
        className="overflow-hidden"
      >
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            为您的设备选择最适合的物流服务
          </p>
          <div className="space-y-4">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                variants={itemVariants}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedProvider === provider.id
                    ? theme === 'dark' 
                      ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                      : 'border-blue-500 bg-blue-50'
                    : theme === 'dark' 
                      ? 'border-gray-700 hover:border-gray-600' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectProvider(provider.id)}
              >
                <div className="flex items-start">
                  {/* 公司图标 */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <i className={`fas ${provider.icon} text-2xl ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}></i>
                  </div>
                  
                  {/* 公司信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium truncate">{provider.name}</h4>
                      {renderRating(provider.rating)}
                    </div>
                    <p className={`text-sm mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {provider.description}
                    </p>
                  </div>
                </div>
                
                {/* 价格和时效 */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        预计费用
                      </p>
                      <p className="font-bold text-red-500">¥{provider.price}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        预计时效
                      </p>
                      <p>{provider.estimatedTime}</p>
                    </div>
                  </div>
                  
                  {/* 选中状态 */}
                  {selectedProvider === provider.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};