import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, User } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';

// 表单数据类型
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 简单的表单验证
    if (!formData.email || !formData.password) {
      toast.error('请填写所有必填字段');
      setIsLoading(false);
      return;
    }

    // 模拟API请求延迟
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里应该是调用后端API进行登录验证
      // 这里使用模拟数据进行演示
      const mockUser: User = {
        id: 'user_123',
        name: '用户示例',
        email: formData.email,
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2',
        isVerified: true,
        creditScore: 98,
        memberLevel: '白金会员',
      };
      
      login(mockUser);
      toast.success('登录成功！');
      navigate('/');
    } catch (error) {
      toast.error('登录失败，请检查您的邮箱和密码');
    } finally {
      setIsLoading(false);
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
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div 
        className={`max-w-md w-full space-y-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } p-8 rounded-2xl shadow-xl`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 登录表单标题 */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <i className="fas fa-industry text-blue-700 text-3xl mr-2"></i>
              <span className="font-bold text-2xl">BlowMoldTech</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">登录您的账户</h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            欢迎回到 BlowMoldTech，继续您的吹塑设备采购之旅
          </p>
        </motion.div>

        {/* 登录表单 */}
        <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          
          {/* 邮箱输入 */}
          <div className="rounded-md -space-y-px">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              邮箱地址
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className="fas fa-envelope"></i>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                密码
              </label>
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className={`font-medium text-blue-600 hover:text-blue-700 transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
                  }`}
                >
                  忘记密码?
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className="fas fa-lock"></i>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="输入您的密码"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 记住我选项 */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded transition-all ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm">
              记住我
            </label>
          </div>

          {/* 登录按钮 */}
          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  登录中...
                </div>
              ) : (
                '登录账户'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* 第三方登录 */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <div className={`absolute inset-0 flex items-center ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>
                或使用以下方式登录
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <motion.a
              href="#"
              whileHover={{ y: -3 }}
              className={`inline-flex justify-center py-2 px-4 border border rounded-lg shadow-sm ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              aria-label="使用Google登录"
            >
              <i className="fab fa-google text-red-500 text-xl"></i>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -3 }}
              className={`inline-flex justify-center py-2 px-4 border border rounded-lg shadow-sm ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              aria-label="使用Apple登录"
            >
              <i className="fab fa-apple text-black dark:text-white text-xl"></i>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -3 }}
              className={`inline-flex justify-center py-2 px-4 border border rounded-lg shadow-sm ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              aria-label="使用微信登录"
            >
              <i className="fab fa-weixin text-green-500 text-xl"></i>
            </motion.a>
          </div>
        </motion.div>

        {/* 注册链接 */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm">
            还没有账户?{' '}
            <Link
              to="/register"
              className={`font-medium text-blue-600 hover:text-blue-700 transition-colors ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
              }`}
            >
              立即注册
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}