import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function PaymentSuccess() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 处理查看订单
  const handleViewOrder = () => {
    navigate('/profile', { state: { tab: 'orders' } });
  };

  // 处理继续购物
  const handleContinueShopping = () => {
    navigate('/devices');
  };

  // 动画变量
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div 
        className={`max-w-md w-full space-y-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } p-8 rounded-2xl shadow-xl text-center`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 成功图标 */}
        <motion.div 
          variants={itemVariants}
          className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto"
        >
          <i className="fas fa-check-circle text-4xl text-green-500"></i>
        </motion.div>
        
        {/* 成功信息 */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold">支付成功！</h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            您的订单已支付成功，我们将尽快为您安排发货
          </p>
        </motion.div>
        
        {/* 订单信息卡片 */}
        <motion.div 
          variants={itemVariants}
          className={`p-4 rounded-lg mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>订单编号:</span>
            <span className="font-medium">ORD{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>支付时间:</span>
            <span>{new Date().toLocaleString('zh-CN')}</span>
          </div>
        </motion.div>
        
        {/* 操作按钮 */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-3">
          <button 
            onClick={handleViewOrder}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            查看订单
          </button>
          <button 
            onClick={handleContinueShopping}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === 'dark' 
                ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            继续购物
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}