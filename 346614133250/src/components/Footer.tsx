import React from 'react';
import { useTheme } from '../hooks/useTheme';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  // 定义页脚导航链接
  const navLinks = [
    { title: '关于我们', links: ['平台介绍', '团队成员', '加入我们', '联系方式'] },
    { title: '帮助中心', links: ['新手指南', '交易流程', '常见问题', '投诉建议'] },
    { title: '交易保障', links: ['验机标准', '质保政策', '退换货政策', '安全支付'] },
    { title: '商务合作', links: ['商家入驻', '品牌合作', '广告投放', ' API合作'] },
  ];

  // 定义社交媒体图标
  const socialIcons = [
    { name: '微信', icon: 'fa-weixin', color: 'text-green-500' },
    { name: '微博', icon: 'fa-weibo', color: 'text-red-500' },
    { name: '抖音', icon: 'fa-music', color: 'text-black' },
    { name: '小红书', icon: 'fa-book', color: 'text-red-400' },
  ];

  return (
    <footer className={`transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
    }`}>
      {/* 主页脚 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-industry text-blue-700 text-2xl mr-2"></i>
              <span className="font-bold text-xl">BlowMoldTech</span>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              环保科技，循环利用 - 专业二手设备交易平台，让每一台设备都能发挥最大价值。
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`text-xl hover:opacity-80 transition-opacity ${social.color}`}
                  aria-label={social.name}
                >
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* 导航链接 */}
          {navLinks.map((group, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className={`hover:text-blue-500 transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : ''
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* 分隔线 */}
      <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
      
      {/* 版权信息 */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
<p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
  © 2025 BlowMoldTech. 保留所有权利。
</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className={`text-sm hover:text-blue-500 transition-colors ${
                theme === 'dark' ? 'text-gray-500 hover:text-blue-400' : 'text-gray-600'
              }`}
            >
              隐私政策
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-blue-500 transition-colors ${
                theme === 'dark' ? 'text-gray-500 hover:text-blue-400' : 'text-gray-600'
              }`}
            >
              用户协议
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-blue-500 transition-colors ${
                theme === 'dark' ? 'text-gray-500 hover:text-blue-400' : 'text-gray-600'
              }`}
            >
              免责声明
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;