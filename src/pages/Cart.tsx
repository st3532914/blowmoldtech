import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cartContext';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { Empty } from '../components/Empty';

export default function Cart() {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 处理数量变化
  const handleQuantityChange = (deviceId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(deviceId, newQuantity);
    }
  };

  // 处理删除商品
  const handleRemoveItem = (deviceId: string) => {
    removeFromCart(deviceId);
    toast.success('已从购物车移除');
  };

  // 处理清空购物车
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      clearCart();
      toast.success('购物车已清空');
    }
  };

  // 处理继续购物
  const handleContinueShopping = () => {
    navigate('/devices');
  };

  // 处理去结算
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  // 计算总价
  const totalPrice = getTotalPrice();

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
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-semibold">我的购物车</h1>
            <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
          </div>
        </div>
      </div>

      {/* 购物车内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // 空购物车状态
          <div className={`rounded-16 p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg text-center`}>
            <Empty message="您的购物车还是空的" icon="fa-shopping-cart" />
            <button 
              onClick={handleContinueShopping}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          // 购物车有商品状态
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* 购物车商品列表 */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-t-16 p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">购物车商品</h2>
                <button 
                  onClick={handleClearCart}
                  className={`text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-red-400' 
                      : 'text-gray-500 hover:text-red-500'
                  } transition-colors`}
                >
                  <i className="fas fa-trash-alt mr-1"></i> 清空购物车
                </button>
              </div>
              
               <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col sm:flex-row p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    {/* 商品图片 */}
                    <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-4 relative">
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {/* 勾选框 */}
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    
                    {/* 商品信息 */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className={`p-1 rounded-full ${
                            theme === 'dark' 
                              ? 'text-gray-400 hover:bg-gray-600 hover:text-red-400' 
                              : 'text-gray-500 hover:bg-gray-200 hover:text-red-500'
                          } transition-colors`}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      {/* 商品详情 */}
                      <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div>成色: {item.condition}</div>
                        <div>卖家: {item.sellerName}</div>
                        <div>所在地: {item.location}</div>
                      </div>
                      
                      {/* 优惠信息 */}
                      {item.originalPrice > item.price && (
                        <div className="mt-2 text-xs text-red-500">
                          优惠: {Math.round((1 - item.price / item.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    {/* 商品价格和数量 */}
                    <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
                      <div className="text-red-500 font-medium">¥{item.price}</div>
                      {item.originalPrice > item.price && (
                        <div className={`text-xs line-through mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          ¥{item.originalPrice}
                        </div>
                      )}
                      
                      {/* 数量选择器 */}
                      <div className="flex items-center mt-4">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            theme === 'dark' 
                              ? 'bg-gray-600 hover:bg-gray-500' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          } transition-colors`}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e)}
                          min="1"
                          className={`w-12 h-8 mx-2 text-center rounded ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            theme === 'dark' 
                              ? 'bg-gray-600 hover:bg-gray-500' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          } transition-colors`}
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
             </motion.div>
             
             {/* 优惠券区域 */}
             <motion.div 
               variants={itemVariants}
               className={`p-4 ${
                 theme === 'dark' ? 'bg-gray-800' : 'bg-white'
               } shadow-lg border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
             >
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
             </motion.div>
             
             {/* 购物车底部 */}
             <motion.div 
               variants={itemVariants}
               className={`sticky bottom-0 z-10 rounded-b-16 p-6 ${
                 theme === 'dark' ? 'bg-gray-800' : 'bg-white'
               } shadow-lg border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
             >
               <div className="flex flex-col sm:flex-row justify-between items-center">
                 <div className="flex items-center mb-4 sm:mb-0 space-x-4">
                   <div className="flex items-center">
                     <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                       <div className="w-3 h-3 rounded-full bg-white"></div>
                     </div>
                     <span>全选</span>
                   </div>
                   <button 
                     onClick={handleContinueShopping}
                     className={`px-4 py-2 rounded-lg text-sm ${
                       theme === 'dark' 
                         ? 'border border-gray-600 bg-gray-700 hover:bg-gray-600' 
                         : 'border border-gray-300 bg-white hover:bg-gray-50'
                     } transition-colors`}
                   >
                     继续购物
                   </button>
                 </div>
                 
                 <div className="text-center sm:text-right">
                   <div className="flex items-center justify-center sm:justify-end mb-2">
                     <span className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                       合计:
                     </span>
                      <span className="text-xl font-bold text-red-500">¥{totalPrice}</span>
                      {/* 计算所有商品的总节省金额 */}
                      {cartItems.some(item => item.originalPrice > item.price) && (
                        <span className={`ml-2 text-xs text-green-500`}>
                          省¥{cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)}
                        </span>
                      )}
                   </div>
                   <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                     共 {cartItems.reduce((total, item) => total + item.quantity, 0)} 件商品
                   </p>
                   <button 
                     onClick={handleCheckout}
                     disabled={loading}
                     className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                       loading ? 'opacity-80 cursor-not-allowed' : ''
                     }`}
                   >
                     {loading ? (
                       <div className="flex items-center">
                         <i className="fas fa-circle-notch fa-spin mr-2"></i>
                         处理中...
                       </div>
                     ) : (
                       '去结算'
                     )}
                   </button>
                 </div>
               </div>
             </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}