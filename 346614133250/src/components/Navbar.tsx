import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import CartIcon from './CartIcon';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* 网站 Logo */}
            <Link to="/" className="flex items-center">
              <i className="fas fa-industry text-blue-700 text-2xl mr-2"></i>
              <span className="font-bold text-xl">BlowMoldTech</span>
            </Link>
            
            {/* 导航链接 - 桌面版 */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/devices" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-blue-500 text-blue-600'
                } hover:border-blue-500 hover:text-blue-500`}
              >
                设备市场
              </Link>
              <Link 
                to="/sell" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'border-transparent text-gray-300 hover:border-gray-700 hover:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                发布闲置
              </Link>
              <Link 
                to="/about" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'border-transparent text-gray-300 hover:border-gray-700 hover:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                关于我们
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* 主题切换按钮 */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full mr-2 transition-colors ${
                theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-800'
              }`}
              aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
           
  {/* 用户操作 */}
  {isAuthenticated ? (
    // 已登录状态
    <div className="flex items-center">
      {/* 通知图标 */}
      <button
        className={`relative p-2 rounded-full ml-2 ${
          theme === 'dark' 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } transition-colors`}
        aria-label="通知"
      >
        <i className="fas fa-bell text-xl"></i>
        {/* 模拟未读通知 */}
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
          3
        </span>
      </button>
      
      <CartIcon />
      
      <button
        onClick={() => navigate('/chat')}
        className={`relative p-2 rounded-full ml-2 ${
          theme === 'dark' 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } transition-colors`}
        aria-label="消息"
      >
        <i className="fas fa-comment-alt text-xl"></i>
        {/* 模拟未读消息 */}
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
          2
        </span>
      </button>
      <div className="ml-3 relative">
        <div className="flex items-center">
          {/* 用户头像 */}
          <div className="relative">
            <img 
              src={user?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture%2C%20modern%20style&sign=a0b33d4a923e8ec00f34e3db59f56ff2'} 
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
            />
            {user?.isVerified && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></span>
            )}
          </div>
          
          {/* 用户名 */}
          <span className="ml-2 text-sm font-medium truncate max-w-[100px]">
            {user?.name}
          </span>
          
          {/* 会员等级标签 */}
          {user?.memberLevel && (
            <span className="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
              {user.memberLevel}
            </span>
          )}
        </div>
      </div>
    </div>
  ) : (
    // 未登录状态
    <div className="hidden md:flex items-center space-x-4">
      <Link 
        to="/login" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          theme === 'dark' 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        登录
      </Link>
      <Link 
        to="/register" 
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        注册
      </Link>
    </div>
  )}
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <div className="md:hidden">
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Link 
            to="/devices" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white' 
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            设备市场
          </Link>
          <Link 
            to="/sell" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            发布闲置
          </Link>
          {isAuthenticated ? (
            <Link 
              to="/profile" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              个人中心
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;