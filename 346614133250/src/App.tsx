import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DeviceDetail from "@/pages/DeviceDetail";
import Devices from "@/pages/Devices";
import Sell from "@/pages/Sell";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Chat from "@/pages/Chat";
import About from "@/pages/About";
import { useState, useEffect } from "react";
  import { AuthContext, User } from '@/contexts/authContext';
  import { CartProvider } from '@/contexts/cartContext';
  import { ChatProvider } from '@/contexts/chatContext';
  import { LogisticsProvider } from '@/contexts/logisticsContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 从localStorage加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser) as User;
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
      }
    }
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <CartProvider>
      <AuthContext.Provider
        value={{ isAuthenticated, user, setIsAuthenticated, setUser, login, logout }}
      >
       <ChatProvider>
       <LogisticsProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/device/:id" element={<DeviceDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<div className="text-center text-xl py-12">找回密码 - 开发中</div>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
               <Route path="/chat" element={<Chat />} />
               <Route path="/about" element={<About />} />
             </Routes>
           </main>
          <Footer />
        </div>
       </LogisticsProvider>
       </ChatProvider>
      </AuthContext.Provider>
    </CartProvider>
  );
}
