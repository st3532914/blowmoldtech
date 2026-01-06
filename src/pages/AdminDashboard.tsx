import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useContext } from 'react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogisticsTracking } from '../components/LogisticsTracking';
import { LogisticsContext } from '../contexts/logisticsContext';


// 模拟销售数据
const salesData = [
  { month: '1月', sales: 12, revenue: 2400000 },
  { month: '2月', sales: 19, revenue: 3800000 },
  { month: '3月', sales: 15, revenue: 3000000 },
  { month: '4月', sales: 20, revenue: 4000000 },
  { month: '5月', sales: 25, revenue: 5000000 },
  { month: '6月', sales: 22, revenue: 4400000 },
];

// 模拟设备分类数据
const categoryData = [
  { name: 'PET吹塑设备', value: 40 },
  { name: '吹塑机', value: 25 },
  { name: '注塑设备', value: 15 },
  { name: '灌装设备', value: 10 },
  { name: '其他', value: 10 },
];

// 饼图颜色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 模拟最近订单数据
const recentOrders = [
  { id: 'ORD12345678', customer: '张三', amount: 189000, status: 'paid', date: '2025-12-26' },
  { id: 'ORD12345679', customer: '李四', amount: 98000, status: 'shipped', date: '2025-12-25' },
  { id: 'ORD12345680', customer: '王五', amount: 145000, status: 'delivered', date: '2025-12-24' },
  { id: 'ORD12345681', customer: '赵六', amount: 168000, status: 'pending', date: '2025-12-23' },
];

// 模拟待处理设备数据
const pendingDevices = [
  { id: 'DEV98765432', name: 'PET吹瓶机PET-500', seller: '远大塑业', date: '2025-12-26', status: 'pending' },
  { id: 'DEV98765433', name: '注塑机IM-600', seller: '诚信机械', date: '2025-12-25', status: 'pending' },
  { id: 'DEV98765434', name: '吹塑模具配件', seller: '合力塑胶', date: '2025-12-24', status: 'pending' },
];

export default function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLogisticsOrder, setSelectedLogisticsOrder] = useState<any>(null);
  const [showLogisticsTracking, setShowLogisticsTracking] = useState<any>(null);
  const { logisticsOrders } = useContext(LogisticsContext);

  // 检查管理员是否已登录
  useEffect(() => {
    const adminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!adminAuthenticated) {
      navigate('/admin-login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast.success('已成功登出');
    navigate('/admin-login');
  };

  // 处理查看设备
  const handleViewDevice = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  // 处理查看订单
  const handleViewOrder = (orderId: string) => {
    // 实际应用中应该跳转到订单详情页面
    toast.info(`查看订单 ${orderId}`);
  };

  // 处理审核设备
  const handleApproveDevice = (deviceId: string) => {
    toast.success(`已审核设备 ${deviceId}`);
  };

  // 处理拒绝设备
  const handleRejectDevice = (deviceId: string) => {
    toast.success(`已拒绝设备 ${deviceId}`);
  };

  // 获取订单状态显示文本
  const getOrderStatusText = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'pending':
        return { text: '待付款', color: 'text-yellow-500' };
      case 'paid':
        return { text: '已付款', color: 'text-blue-500' };
      case 'shipped':
        return { text: '已发货', color: 'text-green-500' };
      case 'delivered':
        return { text: '已送达', color: 'text-green-600' };
      case 'cancelled':
        return { text: '已取消', color: 'text-red-500' };
      default:
        return { text: '未知', color: 'text-gray-500' };
    }
  };

  // 动画变量
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* 顶部导航 */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-red-700 text-2xl mr-2"></i>
              <span className="font-bold text-xl">BlowMoldTech 管理后台</span>
            </div>
            <button 
              onClick={handleLogout}
              className={`text-sm px-3 py-1 rounded-full ${
              theme === 'dark' 
                ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            >
              退出登录
            </button>
          </div>
        </div>
      </div>

      {/* 管理内容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAuthenticated && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* 管理标签页导航 */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex overflow-x-auto">
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'dashboard'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  仪表盘
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'devices'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('devices')}
                >
                  设备管理
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'orders'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  订单管理
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'users'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  用户管理
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'settings'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  系统设置
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'logistics'
                      ? 'text-red-500 border-b-2 border-red-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('logistics')}
                >
                  物流管理
                </button>
              </div>
            </motion.div>

            {/* 标签页内容 */}
            <motion.div variants={itemVariants}>
              {/* 仪表盘标签页 */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">数据概览</h2>
                  
                  {/* 统计卡片 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          总销售额
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <i className="fas fa-chart-line text-blue-500"></i>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">¥22,600,000</div>
                      <div className="flex items-center mt-2">
                        <span className="text-green-500 flex items-center text-sm">
                          <i className="fas fa-arrow-up mr-1"></i> 12.5%
                        </span>
                        <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          相比上月
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          订单数量
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <i className="fas fa-shopping-cart text-green-500"></i>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">113</div>
                      <div className="flex items-center mt-2"><span className="text-green-500 flex items-center text-sm">
                          <i className="fas fa-arrow-up mr-1"></i> 8.2%
                        </span>
                        <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          相比上月
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          活跃用户
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <i className="fas fa-users text-purple-500"></i>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">456</div>
                      <div className="flex items-center mt-2">
                        <span className="text-green-500 flex items-center text-sm">
                          <i className="fas fa-arrow-up mr-1"></i> 5.3%
                        </span>
                        <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          相比上月
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          待审核设备
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                          <i className="fas fa-hourglass-half text-yellow-500"></i>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="flex items-center mt-2">
                        <span className="text-red-500 flex items-center text-sm">
                          <i className="fas fa-arrow-up mr-1"></i> 1
                        </span>
                        <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          相比昨天
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 图表区域 */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 销售趋势图 */}
                    <div className={`lg:col-span-2 p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <h3 className="text-lg font-bold mb-4">销售趋势</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#eee'} />
                            <XAxis 
                              dataKey="month" 
                              stroke={theme === 'dark' ? '#aaa' : '#666'} 
                            />
                            <YAxis 
                              stroke={theme === 'dark' ? '#aaa' : '#666'} 
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                                border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
                                color: theme === 'dark' ? '#fff' : '#333'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="sales" 
                              name="销售数量"
                              stroke="#0088FE" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              name="销售额(万元)"
                              stroke="#00C49F" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* 设备分类占比 */}
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <h3 className="text-lg font-bold mb-4">设备分类占比</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, '占比']}
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                                border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
                                color: theme === 'dark' ? '#fff' : '#333'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* 最近订单和待处理设备 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 最近订单 */}
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">最近订单</h3>
                        <button className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                          查看全部 <i className="fas fa-chevron-right text-xs ml-1"></i>
                        </button>
                      </div>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div 
                            key={order.id}
                            className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{order.id}</div>
                                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {order.customer} · {order.date}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-red-500">¥{order.amount.toLocaleString()}</div>
                                <div className={`text-sm mt-1 ${getOrderStatusText(order.status).color}`}>
                                  {getOrderStatusText(order.status).text}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleViewOrder(order.id)}
                              className={`mt-3 px-3 py-1 text-xs rounded ${
                                theme === 'dark' 
                                  ? 'bg-gray-600 hover:bg-gray-500' 
                                  : 'bg-gray-200 hover:bg-gray-300'
                              } transition-colors`}
                            >
                              查看详情
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 待处理设备 */}
                    <div className={`p-6 rounded-16 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">待审核设备</h3>
                        <button className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                          查看全部 <i className="fas fa-chevron-right text-xs ml-1"></i>
                        </button>
                      </div>
                      <div className="space-y-4">
                        {pendingDevices.map((device) => (
                          <div 
                            key={device.id}
                            className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{device.name}</div>
                                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {device.seller} · {device.date}
                                </div>
                              </div>
                              <div className="text-yellow-500 text-sm">
                                待审核
                              </div>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <button 
                                onClick={() => handleViewDevice(device.id)}
                                className={`px-3 py-1 text-xs rounded ${
                                  theme === 'dark' 
                                    ? 'bg-gray-600 hover:bg-gray-500' 
                                    : 'bg-gray-200 hover:bg-gray-300'
                                } transition-colors`}
                              >
                                查看详情
                              </button>
                              <button 
                                onClick={() => handleApproveDevice(device.id)}
                                className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                              >
                                审核通过
                              </button>
                              <button 
                                onClick={() => handleRejectDevice(device.id)}
                                className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                拒绝
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 设备管理标签页 */}
              {activeTab === 'devices' && (
                <div className={`p-6 rounded-16 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <h2 className="text-xl font-bold mb-6">设备管理</h2>
                  <p className="text-center py-12">设备管理功能开发中...</p>
                </div>
              )}
              
              {/* 订单管理标签页 */}
              {activeTab === 'orders' && (
                <div className={`p-6 rounded-16 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <h2 className="text-xl font-bold mb-6">订单管理</h2>
                  <p className="text-center py-12">订单管理功能开发中...</p>
                </div>
              )}
              
              {/* 用户管理标签页 */}
              {activeTab === 'users' && (
                <div className={`p-6 rounded-16 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <h2 className="text-xl font-bold mb-6">用户管理</h2>
                  <p className="text-center py-12">用户管理功能开发中...</p>
                </div>
              )}
              
              {/* 系统设置标签页 */}
              {activeTab === 'settings' && (
                <div className={`p-6 rounded-16 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <h2 className="text-xl font-bold mb-6">系统设置</h2>
                   <p className="text-center py-12">系统设置功能开发中...</p>
                 </div>
               )}
               
               {/* 物流管理标签页 */}
               {activeTab === 'logistics' && (
                 <div className={`p-6 rounded-16 ${
                   theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                 } shadow-lg`}>
                   <h2 className="text-xl font-bold mb-6">物流管理</h2>
                   
                   {logisticsOrders.length > 0 ? (
                     <div className="space-y-6">
                       {logisticsOrders.map((logisticsOrder) => (
                         <div key={logisticsOrder.id}>
                           <div className={`p-4 rounded-t-lg border ${
                               theme === 'dark' 
                                 ? 'border-gray-700 hover:border-gray-600' 
                                 : 'border-gray-200 hover:border-gray-300'
                             } transition-colors`}
                           >
                             <div className="flex justify-between items-center">
                               <div>
                                 <div className="flex items-center">
                                   <span className="font-medium">{logisticsOrder.deviceName}</span>
                                   <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                     theme === 'dark' 
                                       ? 'bg-gray-700 text-gray-300' 
                                       : 'bg-gray-100 text-gray-700'
                                   }`}>
                                     {logisticsOrder.providerName}
                                   </span>
                                 </div>
                                 <div className="flex items-center mt-2">
                                   <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                     运单号: {logisticsOrder.trackingNumber}
                                   </span>
                                   <span className="mx-2">|</span>
                                   <span className={`text-sm ${
                                     logisticsOrder.status === 'delivered' ? 'text-green-500' :
                                     logisticsOrder.status === 'in_transit' ? 'text-blue-500' :
                                     logisticsOrder.status === 'cancelled' ? 'text-red-500' :
                                     'text-yellow-500'
                                   }`}>
                                     {logisticsOrder.status === 'pending' ? '待安排' :
                                      logisticsOrder.status === 'scheduled' ? '已安排' :
                                      logisticsOrder.status === 'picked_up' ? '已取货' :
                                      logisticsOrder.status === 'in_transit' ? '运输中' :
                                      logisticsOrder.status === 'delivered' ? '已送达' :
                                      logisticsOrder.status === 'cancelled' ? '已取消' :
                                      '未知状态'}
                                   </span>
                                 </div>
                               </div>
                               <button 
                                 className={`px-3 py-1 rounded text-xs ${
                                   theme === 'dark' 
                                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                     : 'border border-gray-300 bg-white hover:bg-gray-200'
                                 }`}
                                 onClick={() => {
                                   setSelectedLogisticsOrder(logisticsOrder);
                                   setShowLogisticsTracking(logisticsOrder.id);
                                 }}
                               >
                                 查看物流详情
                               </button>
                             </div>
                           </div>
                           
                           {/* 物流追踪区域 */}
                           {showLogisticsTracking === logisticsOrder.id && (
                             <motion.div
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               transition={{ duration: 0.3 }}
                               className={`border-t-0 rounded-b-lg overflow-hidden ${
                                 theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                               }`}
                             >
                               <LogisticsTracking logisticsOrder={logisticsOrder} />
                             </motion.div>
                           )}
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className={`p-8 text-center rounded-lg ${
                       theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                     }`}>
                       <i className="fas fa-truck text-4xl mb-3 text-gray-400"></i>
                       <p className="mb-4">暂无物流订单</p>
                     </div>
                   )}
                 </div>
               )}
             </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}