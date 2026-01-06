import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cartContext';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';

// 地址类型定义
interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

// 支付方式类型定义
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export default function Checkout() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems, clearCart, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('wechat');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<'address' | 'payment' | 'confirm'>('address');

  // 模拟地址数据
  const addresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '138****1234',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      address: '张江高科技园区博云路2号',
      isDefault: true,
    },
    {
      id: '2',
      name: '李四',
      phone: '139****5678',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      address: '天河路385号',
      isDefault: false,
    },
  ];

  // 模拟支付方式数据
  const paymentMethods: PaymentMethod[] = [
    { id: 'wechat', name: '微信支付', icon: 'fa-weixin' },
    { id: 'alipay', name: '支付宝', icon: 'fa-alipay' },
    { id: 'card', name: '银行卡支付', icon: 'fa-credit-card' },
  ];

  // 计算总价
  const totalPrice = getTotalPrice();
  const shippingFee = 0; // 免运费
  const finalPrice = totalPrice + shippingFee;

  // 检查用户是否已登录
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
    } else if (cartItems.length === 0) {
      toast.info('购物车为空');
      navigate('/cart');
    } else {
      // 设置默认地址
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [isAuthenticated, navigate, cartItems]);

  // 处理选择地址
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  // 处理选择支付方式
  const handleSelectPaymentMethod = (methodId: string) => {
    setSelectedPaymentMethodId(methodId);
  };

  // 处理下一步
  const handleNextStep = () => {
    if (activeStep === 'address' && !selectedAddressId) {
      toast.error('请选择收货地址');
      return;
    }
    
    if (activeStep === 'address') {
      setActiveStep('payment');
    } else if (activeStep === 'payment') {
      setActiveStep('confirm');
    }
  };

  // 处理上一步
  const handlePrevStep = () => {
    if (activeStep === 'payment') {
      setActiveStep('address');
    } else if (activeStep === 'confirm') {
      setActiveStep('payment');
    }
  };

  // 处理提交订单
  const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      // 模拟支付请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟支付成功
      clearCart();
      toast.success('支付成功！');
      navigate('/payment-success');
    } catch (error) {
      toast.error('支付失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 动画变量
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
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
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-semibold">确认订单</h1>
            <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
          </div>
        </div>
      </div>

      {/* 订单确认内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* 步骤指示器 */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep === 'address' || activeStep === 'payment' || activeStep === 'confirm'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className={`text-sm ${
                activeStep === 'address' || activeStep === 'payment' || activeStep === 'confirm'
                  ? 'text-blue-600 dark:text-blue-400'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                选择地址
              </span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              activeStep === 'payment' || activeStep === 'confirm'
                ? 'bg-blue-600'
                : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="flex flex-col items-center w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep === 'payment' || activeStep === 'confirm'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm ${
                activeStep === 'payment' || activeStep === 'confirm'
                  ? 'text-blue-600 dark:text-blue-400'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                选择支付方式
              </span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              activeStep === 'confirm'
                ? 'bg-blue-600'
                : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="flex flex-col items-center w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep === 'confirm'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm ${
                activeStep === 'confirm'
                  ? 'text-blue-600 dark:text-blue-400'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                确认支付
              </span>
            </div>
          </div>

          {/* 步骤内容 */}
          <div className={`rounded-16 p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
             {/* 选择地址步骤 */}
            {activeStep === 'address' && (
              <div>
                <h2 className="text-xl font-bold mb-6">选择收货地址</h2>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      onClick={() => handleSelectAddress(address.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? theme === 'dark' 
                            ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                            : 'border-blue-500 bg-blue-50'
                          : theme === 'dark' 
                            ? 'border-gray-700 hover:border-gray-600' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{address.name}</span>
                          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {address.phone}
                          </span>
                        </div>
                        {address.isDefault && (
                          <span className={`text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full`}>
                            默认
                          </span>
                        )}
                      </div>
                      <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {address.province}{address.city}{address.district}{address.address}
                      </div>
                      {selectedAddressId === address.id && (
                        <div className="mt-2 flex justify-end">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* 添加新地址按钮 */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-4 rounded-lg border flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-600'
                    } transition-colors`}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加新地址
                  </motion.button>
                </div>
              </div>
            )}

            {/* 选择支付方式步骤 */}
            {activeStep === 'payment' && (
              <div>
                <h2 className="text-xl font-bold mb-6">选择支付方式</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => handleSelectPaymentMethod(method.id)}
                      className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        selectedPaymentMethodId === method.id
                          ? theme === 'dark' 
                            ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                            : 'border-blue-500 bg-blue-50'
                          : theme === 'dark' 
                            ? 'border-gray-700 hover:border-gray-600' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <i className={`fab ${method.icon} text-xl ${
                            method.id === 'wechat' ? 'text-green-500' :
                            method.id === 'alipay' ? 'text-blue-500' :
                            'text-purple-500'
                          }`}></i>
                        </div>
                        <span className="font-medium">{method.name}</span>
                      </div>
                      {selectedPaymentMethodId === method.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* 优惠券选择 */}
                  <div className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'border-gray-700' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-ticket-alt text-red-500 mr-2"></i>
                        <span>优惠券</span>
                      </div>
                      <div className="flex items-center text-blue-500">
                        <span>3张可用</span>
                        <i className="fas fa-chevron-right ml-1 text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 确认支付步骤 */}
            {activeStep === 'confirm' && (
              <div>
                <h2 className="text-xl font-bold mb-6">确认订单信息</h2>
                
                {/* 收货信息 */}
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    收货信息
                  </h3>
                  {selectedAddressId && (
                    <>
                      {(() => {
                        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                        if (selectedAddress) {
                          return (
                            <>
                              <div className="flex items-center">
                                <span className="font-medium mr-2">{selectedAddress.name}</span>
                                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {selectedAddress.phone}
                                </span>
                              </div>
                              <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {selectedAddress.province}{selectedAddress.city}{selectedAddress.district}{selectedAddress.address}
                              </div>
                            </>
                          );
                        }
                        return null;
                      })()}
                    </>
                  )}
                </div>
                
                {/* 支付方式 */}
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-credit-card mr-2"></i>
                    支付方式
                  </h3>
                  {(() => {
                    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethodId);
                    if (selectedMethod) {
                      return (
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <i className={`fab ${selectedMethod.icon} text-lg ${
                              selectedMethod.id === 'wechat' ? 'text-green-500' :
                              selectedMethod.id === 'alipay' ? 'text-blue-500' :
                              'text-purple-500'
                            }`}></i>
                          </div>
                          <span>{selectedMethod.name}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                {/* 商品清单 */}
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-4 flex items-center">
                    <i className="fas fa-box mr-2"></i>
                    商品清单
                  </h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{item.name}</h4>
                          <div className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                            成色: {item.condition}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-red-500">¥{item.price}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 物流方式 */}
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-truck mr-2"></i>
                    物流方式
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <i className="fas fa-shipping-fast text-blue-500"></i>
                      </div>
                      <span>标准物流</span>
                    </div>
                    <span>免运费</span>
                  </div>
                </div>
                
                {/* 发票信息 */}
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-file-invoice mr-2"></i>
                    发票信息
                  </h3>
                  <div className="flex justify-between items-center">
                    <span>不开发票</span>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </div>
                
                {/* 订单金额 */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>商品总价:</span>
                    <span>¥{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>运费:</span>
                    <span>¥{shippingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>优惠券:</span>
                    <span className="text-green-500">-¥1000</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">实付款:</span>
                    <span className="text-xl font-bold text-red-500">¥{finalPrice - 1000}</span>
                  </div>
                </div>
                
                {/* 订单备注 */}
                <div className="mt-4">
                  <label htmlFor="remark" className="block text-sm font-medium mb-2">
                    订单备注
                  </label>
                  <textarea
                    id="remark"
                    rows={3}
                    placeholder="选填，请填写其他需要说明的信息"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className={`fixed bottom-0 left-0 right-0 p-4 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-t`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {activeStep !== 'address' && (
                <button 
                  onClick={handlePrevStep}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border border-gray-300 bg-white hover:bg-gray-50'
                  } transition-colors`}
                >
                  上一步
                </button>
              )}
              
              <div className="text-right">
                {activeStep === 'confirm' && (
                  <div className="flex items-center justify-end mb-2">
                    <span className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      应付金额:
                    </span>
                    <span className="text-xl font-bold text-red-500">¥{finalPrice}</span>
                  </div>
                )}
                
                {activeStep !== 'confirm' ? (
                  <button 
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    下一步
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                      loading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        支付处理中...
                      </div>
                    ) : (
                      '立即支付'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}