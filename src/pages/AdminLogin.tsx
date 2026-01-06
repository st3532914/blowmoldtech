import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { z } from 'zod';

// 表单验证模式
const loginSchema = z.object({
  username: z.string().min(2, '用户名至少需要2个字符'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

// 表单数据类型
interface LoginFormData {
  username: string;
  password: string;
}

export default function AdminLogin() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 清除对应字段的错误信息
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          errors[issue.path[0] as string] = issue.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的管理员验证（实际应用中应该通过API验证）
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // 存储管理员登录状态
        localStorage.setItem('adminAuthenticated', 'true');
        toast.success('登录成功！');
        navigate('/admin');
      } else {
        toast.error('用户名或密码错误');
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试');
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
              <i className="fas fa-shield-alt text-red-700 text-3xl mr-2"></i>
              <span className="font-bold text-2xl">BlowMoldTech 管理后台</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">管理员登录</h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            请输入您的管理员账号和密码
          </p>
        </motion.div>

        {/* 登录表单 */}
        <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          
          {/* 用户名输入 */}
          <div className="rounded-md -space-y-px">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              用户名
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className="fas fa-user-shield"></i>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.username ? 'border-red-500' : ''}`}
                placeholder="管理员用户名"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.username && (
              <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                密码
              </label>
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
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.password ? 'border-red-500' : ''}`}
                placeholder="管理员密码"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* 登录按钮 */}
          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  登录中...
                </div>
              ) : (
                '管理员登录'
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}