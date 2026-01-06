import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { z } from 'zod';

// 表单验证模式
const sellSchema = z.object({
  title: z.string().min(2, '标题至少需要2个字符').max(100, '标题不能超过100个字符'),
  category: z.string().min(1, '请选择分类'),
  condition: z.string().min(1, '请选择成色'),
  price: z.number().positive('价格必须大于0'),
  originalPrice: z.number().positive('原价必须大于0'),
  description: z.string().min(10, '描述至少需要10个字符').max(1000, '描述不能超过1000个字符'),
  location: z.string().min(1, '请输入所在地'),
  agreeTerms: z.boolean().refine(value => value, '请同意发布条款'),
});

// 设备分类
const CATEGORIES = [
  { id: 'pet-blowing', name: 'PET吹塑设备' },
  { id: 'blow-molding', name: '吹塑机' },
  { id: 'injection-molding', name: '注塑设备' },
  { id: 'filling', name: '灌装设备' },
  { id: 'water-treatment', name: '水处理设备' },
  { id: 'auxiliary', name: '配套设备' },
  { id: 'parts', name: '配件耗材' },
];

// 设备成色
const CONDITIONS = [
  { id: 'brand-new', name: '全新' },
  { id: 'like-new', name: '99新' },
  { id: 'excellent', name: '95新' },
  { id: 'good', name: '90新' },
  { id: 'fair', name: '8成新' },
  { id: 'acceptable', name: '7成新及以下' },
];

// 表单数据类型
interface SellFormData {
  title: string;
  category: string;
  condition: string;
  price: string;
  originalPrice: string;
  description: string;
  location: string;
  agreeTerms: boolean;
}

export default function Sell() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SellFormData>({
    title: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    description: '',
    location: '',
    agreeTerms: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // 检查用户是否已登录
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录才能发布闲置');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      // 将价格转换为数字进行验证
      const validatedData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
      };
      
      sellSchema.parse(validatedData);
      
      // 检查是否上传了图片
      if (images.length === 0) {
        setFormErrors({ images: '请至少上传一张图片' });
        return false;
      }
      
      // 检查价格是否合理
      if (parseFloat(formData.price) > parseFloat(formData.originalPrice)) {
        setFormErrors({ price: '售价不能高于原价' });
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

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // 清除input值，以便可以重复上传同一文件
    e.target.value = '';
  };

  // 处理拖放文件
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  // 处理拖放悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  // 处理拖放离开
  const handleDragLeave = () => {
    setDragging(false);
  };

  // 处理文件
  const handleFiles = (files: FileList) => {
    const newImages: string[] = [];
    
    // 限制最多上传5张图片
    const maxFiles = Math.min(files.length, 5 - images.length);
    
    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];
      // 检查文件类型是否为图片
      if (!file.type.match('image.*')) {
        toast.error('请上传图片文件');
        continue;
      }
      
      // 检查文件大小是否超过10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error('图片大小不能超过10MB');
        continue;
      }
      
      // 读取文件并生成预览URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === maxFiles) {
            setImages(prev => [...prev, ...newImages]);
            // 清除图片相关的错误
            if (formErrors.images) {
              setFormErrors(prev => {const newErrors = { ...prev };
                delete newErrors.images;
                return newErrors;
              });
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 移除图片
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 在实际应用中，这里应该是调用后端API进行发布
      console.log('发布设备数据:', {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        images,
        sellerId: user?.id,
        sellerName: user?.name,
        createdAt: new Date().toISOString(),
      });
      
      toast.success('发布成功！我们将尽快审核您的设备');
      navigate('/');
    } catch (error) {
      toast.error('发布失败，请稍后重试');
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* 顶部导航 */}
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

      {/* 发布表单内容 */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-8 text-center">
            发布您的吹塑设备
          </motion.h1>

          <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleSubmit}>
            {/* 设备标题 */}
            <div className="rounded-md -space-y-px">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                设备标题 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.title ? 'border-red-500' : ''}`}
                placeholder="例如：iPhone 15 Pro 256GB 原色 99新"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
              )}
            </div>

            {/* 设备分类和成色 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  设备分类 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.category ? 'border-red-500' : ''}`}
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">请选择分类</option>
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>
                )}
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-1">
                  设备成色 <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.condition ? 'border-red-500' : ''}`}
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="">请选择成色</option>
                  {CONDITIONS.map(condition => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
                {formErrors.condition && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.condition}</p>
                )}
              </div>
            </div>

            {/* 价格信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  售价 (元) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ¥
                  </div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={`block w-full pl-8 pr-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${formErrors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.price && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>
                )}
              </div>
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium mb-1">
                  原价 (元) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ¥
                  </div>
                  <input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={`block w-full pl-8 pr-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${formErrors.originalPrice ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.originalPrice && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.originalPrice}</p>
                )}
              </div>
            </div>

            {/* 设备描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                设备描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.description ? 'border-red-500' : ''}`}
                placeholder="请详细描述设备的使用情况、配置、外观状态等信息，有助于更快售出..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <div className={`flex justify-between mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <p className="text-xs">
                  {formErrors.description && <span className="text-red-500">{formErrors.description}</span>}
                </p>
                <p className="text-xs">{formData.description.length}/1000</p>
              </div>
            </div>

            {/* 所在地 */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                所在地 <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${formErrors.location ? 'border-red-500' : ''}`}
                placeholder="例如：北京"
                value={formData.location}
                onChange={handleInputChange}
              />
              {formErrors.location && (
                <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>
              )}
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium mb-3">
                上传图片 <span className="text-red-500">*</span> (最多5张)
              </label>
              
              {/* 已上传图片预览 */}
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mb-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 上传区域 */}
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all ${
                    theme === 'dark' 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${
                    dragging 
                      ? `${theme === 'dark' ? 'border-blue-500 bg-gray-800' : 'border-blue-500 bg-blue-50'}` 
                      : ''
                  } ${formErrors.images ? 'border-red-500' : ''}
                `}
                onClick={() => document.getElementById('image-upload')?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <i className={`fas fa-cloud-upload-alt text-3xl mb-3 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}></i>
                <p className="mb-1">点击或拖拽图片到这里上传</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  支持 JPG, PNG, GIF 格式，单张不超过10MB
                </p>
                {formErrors.images && (
                  <p className="mt-2 text-xs text-red-500">{formErrors.images}</p>
                )}
              </div>
            </div>

            {/* 发布条款 */}
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
                  我已阅读并同意
                  <a 
                    href="#" 
                    className={`text-blue-600 hover:text-blue-700 transition-colors ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
                    }`}
                  >
                    《发布规则》
                  </a>
                  和
                  <a 
                    href="#" 
                    className={`text-blue-600 hover:text-blue-700 transition-colors ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''
                    }`}
                  >
                    《用户协议》
                  </a>
                </label>
                {formErrors.agreeTerms && (
                  <p className="mt-1 text-xs">{formErrors.agreeTerms}</p>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="pt-4">
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
                    发布中...
                  </div>
                ) : (
                  '发布设备'
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
}