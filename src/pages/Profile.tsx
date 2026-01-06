import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { LogisticsContext } from '../contexts/logisticsContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogisticsTracking } from '../components/LogisticsTracking';

// 模拟交易数据
const transactionData = [
  { month: '1月', sales: 4 },
  { month: '2月', sales: 3 },
  { month: '3月', sales: 5 },
  { month: '4月', sales: 2 },
  { month: '5月', sales: 6 },
  { month: '6月', sales: 4 },
];

// 模拟设备数据
const myDevices = [
  {
    id: '5',
    name: 'PET吹瓶机PET-600',
    category: 'PET吹塑设备',
    price: 95000,
    status: 'selling', // selling, sold, pending
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20blowing%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=9743cd2a075f2f4ceee912e6715c9153',
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views: 345,
  },
  {
    id: '6',
    name: '注塑机IM-800',
    category: '注塑设备',
    price: 82000,
    status: 'pending',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=plastic%20injection%20molding%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=2dffdde1c6df615c8025320204291dba',
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    views: 123,
  },
  {
    id: '7',
    name: '吹塑模具配件套装',
    category: '配件耗材',
    price: 12000,
    status: 'sold',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=plastic%20molding%20machine%20parts%2C%20tools%2C%20professional%20photography&sign=ab5ee8a4198e7700d6edb161173f21a5',
    ],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    views: 234,
  },
];

// 订单数据
const myOrders = [
  {
    id: 'order1',
    deviceId: '1',
    deviceName: 'PET全自动吹瓶机PET-1200',
    deviceImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20blowing%20machine%20production%20line%2C%20industrial%20equipment%2C%20factory%20setting%2C%20high%20quality%2C%20professional%20photography&sign=1e2786fa29c0bad675a4626fe0db24a4',
    price: 189000,
    status: 'delivered', // pending, paid, shipped, delivered, cancelled
    orderTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order2',
    deviceId: '3',
    deviceName: '注塑机IM-1000',
    deviceImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=plastic%20injection%20molding%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=2dffdde1c6df615c8025320204291dba',
    price: 98000,
    status: 'pending',
    orderTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// 会员等级信息
const membershipLevels = [
  { level: '普通会员', minPoints: 0, maxPoints: 999 },
  { level: '白银会员', minPoints: 1000, maxPoints: 2999 },
  { level: '黄金会员', minPoints: 3000, maxPoints: 4999 },
  { level: '白金会员', minPoints: 5000, maxPoints: 9999 },
  { level: '钻石会员', minPoints: 10000, maxPoints: Infinity },
];

export default function Profile() {
  const { theme } = useTheme();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { logisticsOrders, setSelectedLogisticsOrder } = useContext(LogisticsContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(4850); // 模拟积分
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);
  const [nextLevel, setNextLevel] = useState('钻石会员');
  const [showLogisticsTracking, setShowLogisticsTracking] = useState<string | null>(null);

  // 检查用户是否已登录
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.info('请先登录');
      navigate('/login');
    } else {
      // 计算距离下一等级的进度
      calculateProgress();
    }
  }, [isAuthenticated, user, navigate]);

  // 计算会员等级进度
  const calculateProgress = () => {
    const currentLevelIndex = membershipLevels.findIndex(
      level => currentPoints >= level.minPoints && currentPoints <= level.maxPoints
    );
    
    if (currentLevelIndex < membershipLevels.length - 1) {
      const currentLevel = membershipLevels[currentLevelIndex];
      const nextLevelData = membershipLevels[currentLevelIndex + 1];
      setNextLevel(nextLevelData.level);
      
      const pointsToNextLevel = nextLevelData.minPoints - currentPoints;
      const totalPointsForLevel = nextLevelData.minPoints - currentLevel.minPoints;
      const progress = ((totalPointsForLevel - pointsToNextLevel) / totalPointsForLevel) * 100;
      setProgressToNextLevel(progress);
    } else {
      setNextLevel('钻石会员');
      setProgressToNextLevel(100);
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    toast.success('已成功登出');
    navigate('/');
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

  // 获取设备状态显示文本
  const getDeviceStatusText = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'selling':
        return { text: '销售中', color: 'text-blue-500' };
      case 'pending':
        return { text: '待确认', color: 'text-yellow-500' };
      case 'sold':
        return { text: '已售出', color: 'text-green-500' };
      default:
        return { text: '未知', color: 'text-gray-500' };
    }
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 加载状态
  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">加载中...</p>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
               <h1 className="text-lg font-semibold">企业中心</h1>
              <button 
                onClick={() => setShowLogoutModal(true)}
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

      {/* 个人信息内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <motion.div 
          className={`rounded-16 p-6 mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* 用户头像 */}
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img 
                src={user.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2'} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
              />
              {user.isVerified && (
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <i className="fas fa-check text-xs text-white"></i>
                </span>
              )}
            </div>
            
            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <h2 className="text-xl font-bold mr-2">{user.name}</h2>
                    {user.memberLevel && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {user.memberLevel}
                      </span>
                    )}
                  </div>
                  <p className={`mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                </div>
                
                {/* 编辑资料按钮 */}
                <button className={`mt-2 md:mt-0 px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark' 
                    ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                    : 'border border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  编辑资料
                </button>
              </div>
              
              {/* 会员等级进度条 */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">会员等级</span>
                  <span className="text-sm font-medium text-blue-500">
                    距离{nextLevel}还需{(nextLevel === '钻石会员' ? 0 : 10000 - currentPoints)}积分
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextLevel}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
                <div className="mt-1 text-xs text-right">
                  {currentPoints} 积分
                </div>
              </div>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold">{myDevices.length}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                我的发布
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{myOrders.length}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                我的订单
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">5</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                收藏夹
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">4.9</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                信用评分
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 标签页导航 */}
        <div className={`rounded-t-16 overflow-hidden mb-2 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              概览
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'devices'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('devices')}
            >
              我的发布
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              我的订单
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'favorites'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              我的收藏
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              账户设置
            </button>
          </div>
        </div>
        
        {/* 标签页内容 */}
        <motion.div 
          className={`rounded-b-16 p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-bold mb-4">销售情况</h3>
              <div className="h-64 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 待处理订单 */}
                <div className={`p-5 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">待处理事项</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-clock text-yellow-500 mr-3"></i>
                        <span className="text-sm">待付款订单</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        1
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-box text-blue-500 mr-3"></i>
                        <span className="text-sm">待发货设备</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        1
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-comment-alt text-purple-500 mr-3"></i>
                        <span className="text-sm">未读消息</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        2
                      </span>
                    </li>
                  </ul>
                </div>
                
                {/* 近期活动 */}
                <div className={`p-5 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">近期活动</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
                      <div>
                        <p className="text-sm font-medium">iPhone 15 Pro 交易完成</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          2天前
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-upload text-blue-500 mt-0.5 mr-3"></i>
                      <div>
                        <p className="text-sm font-medium">发布了 iPhone 14 Pro</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          3天前
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-star text-yellow-500 mt-0.5 mr-3"></i>
                      <div>
                        <p className="text-sm font-medium">获得了新评价</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          1周前
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* 我的发布标签页 */}
          {activeTab === 'devices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">我的发布</h3>
                <button 
                  onClick={() => navigate('/sell')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-plus mr-1"></i> 发布新设备
                </button>
              </div>
              
              {myDevices.length > 0 ? (
                <div className="space-y-4">
                  {myDevices.map((device) => (
                    <div 
                      key={device.id}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'border-gray-700 hover:border-gray-600' 
                          : 'border-gray-200 hover:border-gray-300'
                      } transition-colors`}
                    >
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          <img 
                            src={device.images[0]} 
                            alt={device.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{device.name}</h4>
                            <span className={`text-sm font-medium ${getDeviceStatusText(device.status).color}`}>
                              {getDeviceStatusText(device.status).text}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-red-500 font-medium">¥{device.price}</span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              发布于 {formatDate(device.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className={`text-xs flex items-center ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <i className="fas fa-eye mr-1"></i> {device.views} 次浏览
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <button 
                            className={`px-3 py-1 rounded text-xs ${
                              theme === 'dark' 
                                ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                : 'border border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                          >
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <i className="fas fa-box-open text-4xl mb-3 text-gray-400"></i>
                  <p className="mb-4">您还没有发布任何设备</p>
                  <button 
                    onClick={() => navigate('/sell')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-1"></i> 发布新设备
                  </button>
                </div>
              )}
            </div>
          )}
          
           {/* 我的订单标签页 */}
           {activeTab === 'orders' && (
             <div>
               <h3 className="text-lg font-bold mb-6">我的订单</h3>
               
               {myOrders.length > 0 ? (
                 <div className="space-y-6">
                   {myOrders.map((order) => {
                     // 查找对应的物流订单
                     const logisticsOrder = logisticsOrders.find(logistics => logistics.orderId === order.id);
                     
                     return (
                       <div key={order.id}>
                         <div 
                           className={`p-4 rounded-t-lg border ${
                             theme === 'dark' 
                               ? 'border-gray-700 hover:border-gray-600' 
                               : 'border-gray-200 hover:border-gray-300'
                           } transition-colors`}
                         >
                           <div className="flex items-center">
                             <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                               <img 
                                 src={order.deviceImage} 
                                 alt={order.deviceName}
                                 className="w-full h-full object-cover"
                               />
                             </div>
                             <div className="flex-1">
                               <div className="flex justify-between items-start">
                                 <h4 className="font-medium">{order.deviceName}</h4>
                                 <span className={`text-sm font-medium ${getOrderStatusText(order.status).color}`}>
                                   {getOrderStatusText(order.status).text}
                                 </span>
                               </div>
                               <div className="flex justify-between items-center mt-2">
                                 <span className="text-red-500 font-medium">¥{order.price}</span>
                                 <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                   下单时间 {formatDate(order.orderTime)}
                                 </span>
                               </div>
                             </div>
                             <div className="flex-shrink-0 ml-4 space-x-2">
                               {logisticsOrder && (
                                 <button 
                                   className={`px-3 py-1 rounded text-xs ${
                                     theme === 'dark' 
                                       ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                       : 'border border-gray-300 bg-white hover:bg-gray-50'
                                   }`}
                                   onClick={() => {
                                     setSelectedLogisticsOrder(logisticsOrder);
                                     setShowLogisticsTracking(order.id);
                                   }}
                                 >
                                   物流追踪
                                 </button>
                               )}
                               <button 
                                 className={`px-3 py-1 rounded text-xs ${
                                   theme === 'dark' 
                                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                     : 'border border-gray-300 bg-white hover:bg-gray-50'
                                 }`}
                               >
                                 订单详情
                               </button>
                             </div>
                           </div>
                         </div>
                         
                         {/* 物流追踪区域 */}
                         {showLogisticsTracking === order.id && logisticsOrder && (
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
                     );
                   })}
                </div>
              ) : (
                <div className={`p-8 text-center rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <i className="fas fa-shopping-cart text-4xl mb-3 text-gray-400"></i>
                  <p className="mb-4">您还没有任何订单</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-shopping-bag mr-1"></i> 去逛逛
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* 我的收藏标签页 */}
          {activeTab === 'favorites' && (
            <div>
              <h3 className="text-lg font-bold mb-6">我的收藏</h3>
              
              <div className={`p-8 text-center rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <i className="fas fa-heart text-4xl mb-3 text-gray-400"></i>
                <p className="mb-4">您的收藏将显示在这里</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-shopping-bag mr-1"></i> 去发现好物
                </button>
              </div>
            </div>
          )}
          
           {/* 账户设置标签页 */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-bold mb-6">账户设置</h3>
              
              <div className="space-y-4">
                {/* 账户管理 */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">账户管理</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-user-circle text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">个人信息</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">已完善 80%</span>
                        <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-id-card text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">实名认证</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {user.isVerified ? '已认证' : '未认证'}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-address-book text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">收货地址</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">2个地址</span>
                        <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* 安全设置 */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">安全设置</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-lock text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">修改密码</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-mobile-alt text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">绑定手机</span>
                      </div>
                      <span className="text-sm text-gray-400">未绑定</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-shield-alt text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">支付设置</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                  </ul>
                </div>
                
                {/* 通知设置 */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">通知设置</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-sm">交易通知</span>
                      <label className={`relative inline-flex items-center cursor-pointer`}>
                        <input type="checkbox" value="" className="sr-only peer" checked />
                        <div className={`w-9 h-5 rounded-full peer ${
                          theme === 'dark' 
                            ? 'bg-gray-600 peer-checked:bg-blue-600' 
                            : 'bg-gray-200 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                      </label>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-sm">价格变动提醒</span>
                      <label className={`relative inline-flex items-center cursor-pointer`}>
                        <input type="checkbox" value="" className="sr-only peer" checked />
                        <div className={`w-9 h-5 rounded-full peer ${
                          theme === 'dark' 
                            ? 'bg-gray-600 peer-checked:bg-blue-600' 
                            : 'bg-gray-200 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                      </label>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-sm">新品推荐</span>
                      <label className={`relative inline-flex items-center cursor-pointer`}>
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className={`w-9 h-5 rounded-full peer ${
                          theme === 'dark' 
                            ? 'bg-gray-600 peer-checked:bg-blue-600' 
                            : 'bg-gray-200 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                      </label>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-sm">物流通知</span>
                      <label className={`relative inline-flex items-center cursor-pointer`}>
                        <input type="checkbox" value="" className="sr-only peer" checked />
                        <div className={`w-9 h-5 rounded-full peer ${
                          theme === 'dark' 
                            ? 'bg-gray-600 peer-checked:bg-blue-600' 
                            : 'bg-gray-200 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                      </label>
                    </li>
                  </ul>
                </div>
                
                {/* 关于我们 */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-3">关于我们</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-info-circle text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">关于BlowMoldTech</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-file-alt text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">用户协议</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-shield-alt text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">隐私政策</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-headset text-gray-500 mr-3 w-5 text-center"></i>
                        <span className="text-sm">联系客服</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                  </ul>
                </div>
                
                {/* 版本信息 */}
                <div className="text-center text-sm text-gray-500 py-2">
                  BlowMoldTech v1.0.0
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`w-full max-w-md rounded-16 overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <i className="fas fa-sign-out-alt text-3xl text-gray-400 mb-3"></i>
                <h3 className="text-xl font-bold">确认退出登录？</h3>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  您需要重新登录才能使用完整功能
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}