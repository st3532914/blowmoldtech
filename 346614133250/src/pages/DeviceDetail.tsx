import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { LogisticsContext, LogisticsProviderType } from '../contexts/logisticsContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { Device, DeviceCard } from '../components/DeviceCard';
import { CartContext } from '@/contexts/cartContext';
import { LogisticsProviderSelector } from '../components/LogisticsProviderSelector';

// 模拟设备数据 - 以PET吹塑设备为主
const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'PET全自动吹瓶机PET-1200',
    category: 'PET吹塑设备',
    price: 189000,
    originalPrice: 245000,
    condition: '9成新',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20blowing%20machine%20production%20line%2C%20industrial%20equipment%2C%20factory%20setting%2C%20high%20quality%2C%20professional%20photography&sign=1e2786fa29c0bad675a4626fe0db24a4',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20blower%20control%20panel%2C%20digital%20display%2C%20professional%20equipment&sign=ca7402624cb46346a26132773b81aa08',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20blowing%20machine%20production%20process%2C%20factory%20setting%2C%20industrial%20environment&sign=06a9733ef8496a5e42f3b8cdb9c4982f',
    ],
    sellerType: 'platform',
    sellerName: 'BlowMoldTech自营',
    location: '上海',
    warranty: '1年',
    viewCount: 432,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'PET吹塑成型机PET-800',
    category: 'PET吹塑设备',
    price: 145000,
    originalPrice: 198000,
    condition: '8.5成新',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20production%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=565fc1a635ba9d2f450b3728d523b7db',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20blowing%20machine%20nozzle%20and%20mold%20part%2C%20close%20up%20view&sign=f7781c70b0f16f80ecf8134fdd685e91',
    ],
    sellerType: 'platform',
    sellerName: 'BlowMoldTech自营',
    location: '广州',
    warranty: '1年',
    viewCount: 321,
    isFeatured: true,
  },
  {
    id: '3',
    name: '注塑机IM-1000',
    category: '注塑设备',
    price: 98000,
    originalPrice: 135000,
    condition: '9成新',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=plastic%20injection%20molding%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=2dffdde1c6df615c8025320204291dba',
    ],
    sellerType: 'user',
    sellerName: '远大塑业',
    location: '深圳',
    warranty: '6个月',
    viewCount: 256,
    isFeatured: true,
  },
  {
    id: '4',
    name: '全自动灌装机FM-500',
    category: '灌装设备',
    price: 168000,
    originalPrice: 210000,
    condition: '8成新',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=automatic%20liquid%20filling%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=a389435bd88a6ce5f6d7c2528273e688',
    ],
    sellerType: 'user',
    sellerName: '诚信机械',
    location: '杭州',
    warranty: '3个月',
    viewCount: 189,
    isFeatured: true,
  },
];

// 设备详情数据
interface DeviceDetailType extends Device {
  description: string;
  specifications: {
    [key: string]: string;
  };
  inspectionReport: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  stock: number;
}

// 获取设备详情
const getDeviceDetail = (id: string): DeviceDetailType | null => {
  const device = MOCK_DEVICES.find(d => d.id === id);
  if (!device) return null;
  
  // 添加详细信息
  return {
    ...device,
    description: `${device.name}是一款高性能的工业吹塑设备，${device.sellerType === 'platform' ? '经过BlowMoldTech专业工程师团队全面检测和维护，确保设备性能稳定可靠。' : '由正规企业使用和维护，状态良好。'}该设备${device.condition}，主要部件磨损轻微，所有功能正常运行，可直接投入生产使用。`,
    specifications: {
      '型号': device.name,
      '成色': device.condition,
      '生产能力': '800-1200个/小时',
      '适用原料': 'PE, PP, PVC, PET',
      '最大制品容积': device.name.includes('1000') ? '100L' : '50L',
      '机器重量': device.name.includes('1000') ? '8吨' : '6吨',
      '电源要求': '380V/50Hz/30KW',
    },
    inspectionReport: {
      '主电机': '运行平稳，噪音正常',
      '液压系统': '压力稳定，无泄漏',
      '温控系统': '温控精准，温差±1℃',
      '模具系统': '合模精准，无偏差',
      '电气控制系统': 'PLC运行正常，按键灵敏',
      '冷却系统': '冷却效果良好',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    stock: 1,
  };
};

export default function DeviceDetail() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceDetailType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<LogisticsProviderType | undefined>(undefined);
  const { addToCart } = useContext(CartContext);
  const { createLogisticsOrder, scheduleLogistics } = useContext(LogisticsContext);

  // 关闭联系卖家弹窗
  const handleCloseContactModal = () => {
    setShowContactModal(false);
  };


  // 模拟API请求获取设备详情
  useEffect(() => {
    const fetchDeviceDetail = async () => {
      setLoading(true);
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const deviceDetail = getDeviceDetail(id || '');
        if (deviceDetail) {
          setDevice(deviceDetail);
          setSelectedImage(deviceDetail.images[0]);
        } else {
          toast.error('设备不存在');
          navigate('/');
        }
      } catch (error) {
        toast.error('获取设备详情失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeviceDetail();
  }, [id, navigate]);

  // 处理加入收藏
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '已取消收藏' : '已加入收藏');
  };

  // 处理加入购物车
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    
    if (device) {
      addToCart(device);
      toast.success('已添加到购物车');
    }
  };

  // 处理立即购买
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    
    if (device) {
      addToCart(device);
      navigate('/checkout');
    }
    // 实际应用中，这里应该跳转到订单确认页面
  };

   // 处理联系卖家
  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    
    // 导航到聊天页面并创建对话
    const sellerId = device.sellerType === 'platform' ? 'platform_seller' : `user_${device.id}`;
    localStorage.setItem('newConversation', JSON.stringify({
      userId: sellerId,
      userName: device.sellerName,
      userAvatar: device.sellerType === 'platform' 
        ? 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=company%20logo%2C%20EcoTech%2C%20modern%20style&sign=d5a09aece8559449b2e73aa53890709b'
        : 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2'
    }));
    navigate('/chat');
  };

  // 处理提交咨询
  const handleSubmitInquiry = (message: string) => {
    if (message.trim()) {
      toast.success('咨询已发送');
      setShowContactModal(false);
    } else {
      toast.error('请输入咨询内容');
    }
  };

  // 加载状态
  if (loading || !device) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">加载设备详情...</p>
        </div>
      {/* 相关推荐设备 */}
      <section className="max-w-7xl mx-auto px-4 py-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">相关推荐</h2>
          <button 
            className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
            }`}
            onClick={() => navigate('/devices')}
          >
            查看更多 <i className="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DEVICES.filter(d => d.id !== device.id).slice(0, 4).map((recDevice) => (
            <DeviceCard 
              key={recDevice.id}
              device={recDevice}
              onClick={() => navigate(`/device/${recDevice.id}`)}
            />
          ))}
        </div>
      </section>
      
      </div>
    );
  }

  // 计算折扣
  const discount = Math.round((1 - device.price / device.originalPrice) * 100);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* 返回按钮 */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            <span>返回</span>
          </button>
        </div>
      </div>

      {/* 设备详情内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设备图片 */}
          <div className="lg:col-span-2">
            <motion.div 
              className="mb-4 overflow-hidden rounded-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={selectedImage} 
                alt={device.name}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </motion.div>
            
            {/* 缩略图列表 */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {device.images.map((img, index) => (
                <motion.div 
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImage === img ? 'ring-2 ring-blue-500' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${device.name} ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 右侧：设备信息 */}
          <motion.div 
            className={`rounded-16 p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg sticky top-24 self-start`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* 设备名称 */}
            <h1 className="text-2xl font-bold mb-2">{device.name}</h1>
            
            {/* 设备状态标签 */}
            <div className="flex items-center mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
              } mr-2`}>{device.condition}</span>
              
              {/* 平台自营标签 */}
              {device.sellerType === 'platform' && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2">自营</span>
              )}
              
              {/* 质保标签 */}
              {device.warranty && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  device.sellerType === 'platform' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')
                }`}>
                  <i className="fas fa-shield-alt mr-1"></i> {device.warranty}质保
                </span>
              )}
            </div>
            
            {/* 价格信息 */}
            <div className="flex items-baseline mb-6">
              <span className="text-red-500 font-bold text-3xl mr-2">¥{device.price}</span>
              {device.originalPrice > device.price && (
                <span className={`text-sm line-through ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>¥{device.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="ml-2 text-red-500 text-sm font-medium">-{discount}%</span>
              )}
            </div>
            
            {/* 卖家信息 */}
            <div className={`p-4 rounded-lg mb-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center">
                <img 
                  src={device.sellerType === 'platform' 
                    ? 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=company%20logo%2C%20EcoTech%2C%20modern%20style&sign=d5a09aece8559449b2e73aa53890709b' 
                    : 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2'
                  }
                  alt={device.sellerName}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">{device.sellerName}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {device.sellerType === 'platform' ? '官方认证' : '个人卖家'}
                  </p>
                </div>
              </div>
            </div>
            
             {/* 操作按钮 */}
             <div className="flex space-x-4 mb-6">
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleAddToCart}
                 className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                   theme === 'dark' 
                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                     : 'border border-gray-300 bg-white hover:bg-gray-50'
                 }`}
               >
                 <i className="fas fa-shopping-cart mr-1"></i> 加入购物车
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleBuyNow}
                 className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
               >
                 立即购买
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleContactSeller}
                 className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                   theme === 'dark' 
                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                     : 'border border-gray-300 bg-white hover:bg-gray-50'
                 }`}
               >
                 <i className="fas fa-comment-alt"></i>
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setShowLogisticsModal(true)}
                 className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                   theme === 'dark' 
                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                     : 'border border-gray-300 bg-white hover:bg-gray-50'
                 }`}
               >
                 <i className="fas fa-truck"></i>
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleToggleFavorite}
                 className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                   theme === 'dark' 
                     ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                     : 'border border-gray-300 bg-white hover:bg-gray-50'
                 }`}
               >
                 <i className={`fas ${isFavorite ? 'fa-heart text-red-500' : 'fa-heart'}`}></i>
               </motion.button>
             </div>
            
            {/* 额外信息 */}
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex justify-between mb-2">
                <span>所在地</span>
                <span>{device.location}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>浏览量</span>
                <span>{device.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span>发布时间</span>
                <span>{new Date(device.createdAt).toLocaleDateString()}</span>
              </div>
               </div>
               
               {/* 用户评价 */}
               <div className="mt-10">
                 <h2 className="text-xl font-bold mb-4">用户评价 (12)</h2>
                 <div className="space-y-6">
                   {[1, 2, 3].map((index) => (
                     <div key={index} className={`p-4 rounded-lg ${
                       theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                     }`}>
                       <div className="flex justify-between items-start">
                         <div className="flex items-center">
                           <img 
                             src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20professional%20style&sign=b10cc89af893fa5118a183b617772d34`} 
                             alt="User avatar"
                             className="w-10 h-10 rounded-full object-cover mr-3"
                           />
                           <div>
                             <p className="font-medium">用户{index}</p>
                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                               2025-{6+index}-{10+index}
                             </p>
                           </div>
                         </div>
                         <div className="flex">
                           {[...Array(5)].map((_, i) => (
                             <i 
                               key={i}
                               className="fas fa-star text-yellow-400"
                             ></i>
                           ))}
                         </div>
                       </div>
                       <p className="mt-3">设备质量很好，运行稳定，性价比高，卖家服务态度也很好，提供了详细的操作指导。</p>
                     </div>
                   ))}
                 </div>
                 <div className="mt-4 text-center">
                   <button className={`px-4 py-2 rounded-lg text-sm ${
                     theme === 'dark' 
                       ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                       : 'border border-gray-300 bg-white hover:bg-gray-50'
                   }`}>
                     查看全部评价
                   </button>
                 </div>
               </div>
           </motion.div>
        </div>
        
        {/* 设备详细描述和规格 */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 设备描述 */}
          <motion.div 
            className={`lg:col-span-2 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-16 p-6 shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">商品描述</h2>
            <p className={`mb-6 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {device.description}
            </p>
            
            {/* 设备规格 */}
            <h2 className="text-xl font-bold mb-4">规格参数</h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {Object.entries(device.specifications).map(([key, value]) => (
                <div key={key} className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {key}
                  </div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
            
            {/* 验机报告（仅平台自营） */}
            {device.sellerType === 'platform' && (
              <div>
                <h2 className="text-xl font-bold mb-4">专业验机报告</h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {Object.entries(device.inspectionReport).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {key}: 
                        </span>
                        <span className="ml-1 font-medium">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* 平台保障 */}
          <motion.div 
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-16 p-6 shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-4">交易保障</h2>
            <ul className="space-y-4">
              {device.sellerType === 'platform' ? (
                <>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">官方品质保证</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        每台设备经过严格检测，确保质量
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">{device.warranty}质保</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        购买后享受官方质保服务
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-undo text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">7天无理由退换</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        不满意可申请无理由退换
                      </p>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <i className="fas fa-user-check text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">实名认证卖家</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        卖家已完成实名认证
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">平台担保交易</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        资金安全有保障
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-gavel text-green-500 mt-1 mr-3"></i>
                    <div>
                      <p className="font-medium">纠纷仲裁</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        交易纠纷可申请平台介入
                      </p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        </div>
      </main>
      
      {/* 联系卖家弹窗 */}
      {showContactModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleCloseContactModal}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">联系卖家</h3>
                <button 
                  onClick={handleCloseContactModal}
                  className={`p-2 rounded-full ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <img 
                  src={device.sellerType === 'platform' 
                    ? 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=company%20logo%2C%20EcoTech%2C%20modern%20style&sign=d5a09aece8559449b2e73aa53890709b' 
                    : 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2'
                  }
                  alt={device.sellerName}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium">{device.sellerName}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {device.sellerType === 'platform' ? '官方客服' : '在线卖家'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="inquiry" className="block text-sm font-medium mb-2">
                  咨询内容
                </label>
                <textarea
                  id="inquiry"
                  rows={4}
                  placeholder="请输入您的问题或需求..."
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                ></textarea>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCloseContactModal}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  取消
                </button>
                <button
                  onClick={() => handleSubmitInquiry((document.getElementById('inquiry') as HTMLTextAreaElement)?.value || '')}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  发送咨询
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
       )}
       
       {/* 代叫物流弹窗 */}
       {showLogisticsModal && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
           onClick={() => setShowLogisticsModal(false)}
         >
           <motion.div
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             exit={{ scale: 0.9, y: 20 }}
             className={`w-full max-w-2xl rounded-16 overflow-hidden ${
               theme === 'dark' ? 'bg-gray-800' : 'bg-white'
             } shadow-xl`}
             onClick={(e) => e.stopPropagation()}
           >
             <div className="p-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">代叫物流服务</h3>
                 <button 
                   onClick={() => setShowLogisticsModal(false)}
                   className={`p-2 rounded-full ${
                     theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                   }`}
                 >
                   <i className="fas fa-times"></i>
                 </button>
               </div>
               
               <div className="flex items-center mb-6">
                 <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                   <img 
                     src={device.images[0]} 
                     alt={device.name}
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <div>
                   <p className="font-medium line-clamp-1">{device.name}</p>
                   <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                     准备从 {device.location} 发货
                   </p>
                 </div>
               </div>
               
               <LogisticsProviderSelector 
                 onSelectProvider={setSelectedProvider}
                 selectedProvider={selectedProvider}
               />
               
               <div className="mt-6">
                 <h4 className="font-medium mb-3">收货信息</h4>
                 <div className={`p-4 rounded-lg ${
                   theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                 }`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="font-medium">张三</p>
                       <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                         138****1234
                       </p>
                     </div>
                     <button className={`text-sm ${
                       theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                     }`}>
                       更换
                     </button>
                   </div>
                   <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                     上海市浦东新区张江高科技园区博云路2号
                   </p>
                 </div>
               </div>
               
               <div className="mt-6 flex space-x-4">
                 <button
                   onClick={() => setShowLogisticsModal(false)}
                   className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                     theme === 'dark' 
                       ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                       : 'border border-gray-300 bg-white hover:bg-gray-50'
                   }`}
                 >
                   取消
                 </button>
                 <button
                   onClick={async () => {
                     if (!selectedProvider) {
                       toast.error('请先选择物流公司');
                       return;
                     }
                     
                     try {
                       // 模拟创建订单
                       const orderId = `order_${Date.now()}`;
                       // 创建物流订单
                       await createLogisticsOrder(device.id, device.name, orderId);
                       // 安排物流
                       await scheduleLogistics(orderId, selectedProvider);
                       toast.success('物流已安排成功');
                       setShowLogisticsModal(false);
                     } catch (error) {
                       toast.error('物流安排失败，请稍后重试');
                     }
                   }}
                   disabled={!selectedProvider}
                   className={`flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                     !selectedProvider ? 'opacity-60 cursor-not-allowed' : ''
                   }`}
                 >
                   立即预约
                 </button>
               </div>
             </div>
           </motion.div>
         </motion.div>
       )}
     </div>
   );
}