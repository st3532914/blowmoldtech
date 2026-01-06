import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export default function About() {
  const { theme } = useTheme();
  
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
              onClick={() => window.history.back()}
              className={`flex items-center ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-semibold">关于我们</h1>
            <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          className={`rounded-16 p-8 mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <i className="fas fa-industry text-4xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">BlowMoldTech</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                大型吹塑设备专业平台，让每一台设备都能发挥最大价值
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-3">平台使命</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                BlowMoldTech致力于打造专业的大型吹塑设备交易平台，通过整合行业资源，降低设备交易门槛，促进设备的循环利用，为环保事业贡献一份力量。我们相信，每一台设备都有其独特的价值，通过合理的流通和再利用，可以为企业创造更大的经济效益，同时减少资源浪费和环境污染。
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3">平台优势</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    专业检测
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    每台设备经过专业工程师30项严格检测，确保性能稳定可靠
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                    交易保障
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    平台担保交易，提供专业合同和资金监管，安全可靠
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-tools text-green-500 mr-2"></i>
                    售后支持
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    提供安装调试、技术培训和维修保养等完善服务
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-exchange-alt text-green-500 mr-2"></i>
                    灵活方案
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    提供设备租赁、以旧换新、分期付款等多种合作模式
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3">平台愿景</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                我们致力于成为全球领先的吹塑设备交易和服务平台，通过技术创新和模式创新，为行业创造更大的价值。我们希望通过我们的努力，能够推动吹塑行业的可持续发展，实现资源的高效利用和环境的有效保护。
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3">联系我们</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-blue-500 w-6 text-center mr-3"></i>
                  <span>上海市浦东新区张江高科技园区</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone text-blue-500 w-6 text-center mr-3"></i>
                  <span>400-888-8888</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-blue-500 w-6 text-center mr-3"></i>
                  <span>contact@blowmoldtech.com</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock text-blue-500 w-6 text-center mr-3"></i>
                  <span>周一至周日 9:00-21:00</span>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}