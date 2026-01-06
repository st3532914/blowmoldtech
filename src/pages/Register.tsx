import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, User } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { z } from 'zod';

// 注册表单验证模式
const registerSchema = z.object({
  name: z.string().min(2, '用户名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少需要8个字符')
    .regex(/[A-Z]/, '密码需要包含至少一个大写字母')
    .regex(/[a-z]/, '密码需要包含至少一个小写字母')
    .regex(/[0-9]/, '密码需要包含至少一个数字'),
  confirmPassword: z.string()
});

// 注册表单数据类型
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function Register() {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      registerSchema.parse(formData);
      
      // 检查密码是否匹配
      if (formData.password !== formData.confirmPassword) {
        setFormErrors({ confirmPassword: '两次输入的密码不匹配' });
        return false;
      }
      
      // 检查是否同意条款
      if (!formData.agreeTerms) {
        setFormErrors({ agreeTerms: '请同意用户协议和隐私政策' });
        return false;
      }
      
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
      
      // 在实际应用中，这里应该是调用后端API进行注册
      // 这里使用模拟数据进行演示
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2',
        isVerified: false,
        creditScore: 80,
        memberLevel: '普通会员',
      };
      
      // 注册成功后自动登录
      login(mockUser);
      toast.success('注册成功！欢迎加入EcoTech');
      navigate('/');
    } catch (error) {
      toast.error('注册失败，请稍后重试');
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
        {/* 注册表单标题 */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <i className="fas fa-industry text-blue-700 text-3xl mr-2"></i>
              <span className="font-bold text-2xl">BlowMoldTech</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">创建您的账户</h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            加入我们，开始您的吹塑设备采购之旅
          </p>
        </motion.div>

        {/* 注册表单 */}
        <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 用户名输入 */}
          <div className="rounded-md -space-y-px">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              用户名
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className="fas fa-user"></i>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.name ? 'border-red-500' : ''}`}
                placeholder="您的用户名"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>

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
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              密码
            </label>
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
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.password ? 'border-red-500' : ''}`}
                placeholder="设置您的密码"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* 确认密码输入 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              确认密码
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className="fas fa-lock"></i>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="再次输入您的密码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* 同意条款 */}
          <div className={`flex items-start ${formErrors.agreeTerms ? 'text-red-500' : ''}`}>
            <div className="flex items-center h-5">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded transition-all ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                } ${formErrors.agreeTerms ? 'border-red-500' : ''}`}
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeTerms" className="font-medium">
                我同意 EcoTech 的
                <a 
                  href="#" 
                  className={`text-blue-600 hover:text-blue-700 transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
                  }`}
                >
                  用户协议
                </a>
                和
                <a 
                  href="#" 
                  className={`text-blue-600 hover:text-blue-700 transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
                  }`}
                >
                  隐私政策
                </a>
              </label>
              {formErrors.agreeTerms && (
                <p className="mt-1 text-xs">{formErrors.agreeTerms}</p>
              )}
            </div>
          </div>

          {/* 注册按钮 */}
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
                  注册中...
                </div>
              ) : (
                '创建账户'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* 登录链接 */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm">
            已有账户?{' '}
            <Link
              to="/login"
              className={`font-medium text-blue-600 hover:text-blue-700 transition-colors ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
              }`}
            >
              立即登录
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}