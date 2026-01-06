import { createContext, useState, useEffect, ReactNode } from 'react';
import { Device } from '../components/DeviceCard';

// 购物车商品类型
export interface CartItem extends Device {
  quantity: number;
}

// 购物车上下文类型
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (device: Device, quantity?: number) => void;
  removeFromCart: (deviceId: string) => void;
  updateQuantity: (deviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 创建购物车上下文
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
});

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // 从localStorage加载购物车数据
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Failed to parse saved cart data:', error);
        return [];
      }
    }
    return [];
  });

  // 保存购物车数据到localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 添加商品到购物车
  const addToCart = (device: Device, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === device.id);
      
      if (existingItem) {
        // 如果商品已在购物车中，更新数量
        return prevItems.map(item => 
          item.id === device.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // 如果商品不在购物车中，添加新商品
        return [...prevItems, { ...device, quantity }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (deviceId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== deviceId));
  };

  // 更新商品数量
  const updateQuantity = (deviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(deviceId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === deviceId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 获取购物车商品总数
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // 获取购物车商品总价
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}