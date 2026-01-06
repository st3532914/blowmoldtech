import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { DeviceCard, Device } from '../components/DeviceCard';
import { SearchBar } from '../components/SearchBar';
import { Empty } from '../components/Empty';

// 模拟设备数据
const generateMockDevices = (): Device[] => {
  const categories = ['PET吹塑设备', '吹塑机', '注塑设备', '灌装设备', '水处理设备', '配套设备', '配件耗材'];
  const conditions = ['9成新', '8.5成新', '8成新', '7.5成新'];
  const locations = ['上海', '广州', '深圳', '杭州', '苏州'];
  
  return Array.from({ length: 20 }, (_, index) => ({
    id: `device_${index + 10}`,
  name: `${['PET-', 'BM-', 'IM-', 'FM-', 'WT-', 'AU-', 'AC-'][index % 7]}${500 + Math.floor(Math.random() * 1500)} ${
    index % 7 === 0 ? ['PET瓶吹瓶机', 'PET吹塑成型机', 'PET吹瓶生产线', 'PET瓶全自动吹瓶机'][index % 4] :
    index % 7 === 1 ? ['全自动吹塑机', '中空成型机', '挤吹一体机', '多层共挤吹塑机'][index % 4] :
    index % 7 === 2 ? ['注塑机', '注塑成型机', '精密注塑机', '高速注塑机'][index % 4] :
    index % 7 === 3 ? ['灌装机', '液体灌装机', '全自动灌装机', '定量灌装机'][index % 4] :
    index % 7 === 4 ? ['水处理设备', '反渗透设备', '纯水设备', '过滤设备'][index % 4] :
    index % 7 === 5 ? ['配套设备', '辅助设备', '自动化设备', '输送设备'][index % 4] :
    ['模具配件', '温控器', '液压配件', '电气配件'][index % 4]
  }`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 150000) + 80000,
    originalPrice: Math.floor(Math.random() * 200000) + 120000,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    images: [
      `https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=${
        index % 7 === 0 ? 'PET%20bottle%20blowing%20machine%20production%20line%2C%20industrial%20equipment%2C%20factory%20setting' :
        index % 7 === 1 ? 'industrial%20blow%20molding%20machine%2C%20large%20scale%2C%20factory%20equipment' :
        index % 7 === 2 ? 'plastic%20injection%20molding%20machine%2C%20industrial%20equipment' :
        index % 7 === 3 ? 'liquid%20filling%20machine%2C%20automatic%20packaging%20line' :
        index % 7 === 4 ? 'water%20treatment%20equipment%2C%20purification%20system' :
        index % 7 === 5 ? 'auxiliary%20equipment%20for%20plastic%20processing' :
        'plastic%20molding%20machine%20parts%2C%20tools'
      }%2C%20high%20quality%20photography&sign=${Math.random().toString(36).substring(2, 10)}`,
    ],
    sellerType: Math.random() > 0.5 ? 'platform' : 'user',
    sellerName: Math.random() > 0.5 ? 'BlowMoldTech自营' : `${['远大塑业', '诚信机械', '恒通设备', '创新科技', '合力塑胶'][index % 5]}${Math.floor(Math.random() * 100)}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    warranty: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 3}个月` : '无',
    viewCount: Math.floor(Math.random() * 500),
  }));
};

// 设备分类
const CATEGORIES = [
  { id: 'all', name: '全部设备', icon: 'fa-th-large' },
  { id: 'pet-blowing', name: 'PET吹塑设备', icon: 'fa-industry' },
  { id: 'blow-molding', name: '吹塑机', icon: 'fa-industry' },
  { id: 'injection-molding', name: '注塑设备', icon: 'fa-cogs' },
  { id: 'filling', name: '灌装设备', icon: 'fa-bottle-water' },
  { id: 'water-treatment', name: '水处理设备', icon: 'fa-water' },
  { id: 'auxiliary', name: '配套设备', icon: 'fa-tools' },
  { id: 'parts', name: '配件耗材', icon: 'fa-puzzle-piece' },
];

// 价格区间
const PRICE_RANGES = [
  { id: 'all', name: '全部价格' },
  { id: '0-1000', name: '0-1000元' },
  { id: '1000-3000', name: '1000-3000元' },
  { id: '3000-5000', name: '3000-5000元' },
  { id: '5000-10000', name: '5000-10000元' },
  { id: '10000+', name: '10000元以上' },
];

// 设备成色
const CONDITIONS = [
  { id: 'all', name: '全部成色' },
  { id: 'brand-new', name: '全新' },
  { id: 'like-new', name: '99新' },
  { id: 'excellent', name: '95新' },
  { id: 'good', name: '90新' },
  { id: 'fair', name: '8成新及以下' },
];

// 排序选项
const SORT_OPTIONS = [
  { id: 'recommended', name: '推荐排序' },
  { id: 'price-asc', name: '价格从低到高' },
  { id: 'price-desc', name: '价格从高到低' },
  { id: 'newest', name: '最新发布' },
  { id: 'most-viewed', name: '最多浏览' },
];

export default function Devices() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortOption, setSortOption] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 模拟API请求获取设备列表
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockDevices = generateMockDevices();
        setDevices(mockDevices);
        setFilteredDevices(mockDevices);
      } catch (error) {
        console.error('获取设备列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
    
    // 加载搜索历史
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory, selectedPriceRange, selectedCondition, sortOption);
    
    if (query.trim()) {
      // 添加到搜索历史
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  };

  // 处理分类选择
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category, selectedPriceRange, selectedCondition, sortOption);
  };

  // 处理价格区间选择
  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    applyFilters(searchQuery, selectedCategory, priceRange, selectedCondition, sortOption);
  };

  // 处理成色选择
  const handleConditionChange = (condition: string) => {
    setSelectedCondition(condition);
    applyFilters(searchQuery, selectedCategory, selectedPriceRange, condition, sortOption);
  };

  // 处理排序选项
  const handleSortChange = (option: string) => {
    setSortOption(option);
    applyFilters(searchQuery, selectedCategory, selectedPriceRange, selectedCondition, option);
  };

  // 应用所有筛选条件
  const applyFilters = (
    query: string, 
    category: string, 
    priceRange: string, 
    condition: string, 
    sort: string
  ) => {
    let result = [...devices];
    
    // 搜索筛选
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      result = result.filter(device => 
        device.name.toLowerCase().includes(lowerCaseQuery) ||
        device.category.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
     // 分类筛选
     if (category !== 'all') {
      // 这里需要映射分类ID到实际的分类名称
      const categoryMap: Record<string, string> = {
        'pet-blowing': 'PET吹塑设备',
        'blow-molding': '吹塑机',
        'injection-molding': '注塑设备',
        'filling': '灌装设备',
        'water-treatment': '水处理设备',
        'auxiliary': '配套设备',
        'parts': '配件耗材'
      };
      result = result.filter(device => device.category === categoryMap[category]);
    }
    
    // 价格区间筛选
    if (priceRange !== 'all') {
      result = result.filter(device => {
        if (priceRange === '0-1000') return device.price <= 1000;
        if (priceRange === '1000-3000') return device.price > 1000 && device.price <= 3000;
        if (priceRange === '3000-5000') return device.price > 3000 && device.price <= 5000;
        if (priceRange === '5000-10000') return device.price > 5000 && device.price <= 10000;
        if (priceRange === '10000+') return device.price > 10000;
        return true;
      });
    }
    
    // 成色筛选
    if (condition !== 'all') {
      // 这里需要映射成色ID到实际的成色名称
      const conditionMap: Record<string, string> = {
        'brand-new': '全新',
        'like-new': '99新',
        'excellent': '95新',
        'good': '90新',
        'fair': '8成新'
      };
      result = result.filter(device => device.condition.includes(conditionMap[condition]));
    }
    
    // 排序
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      // 假设ID较大的设备是较新发布的
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sort === 'most-viewed') {
      result.sort((a, b) => b.viewCount - a.viewCount);
    }
    
    setFilteredDevices(result);
  };

  // 重置所有筛选条件
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedCondition('all');
    setSortOption('recommended');
    setFilteredDevices(devices);
  };

  // 处理设备点击
  const handleDeviceClick = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* 顶部搜索栏 */}
      <div className={`sticky top-0 z-50 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <SearchBar 
              placeholder="搜索PET吹塑、注塑、灌装、水处理及配套设备..." 
              onSearch={handleSearch}
              className="w-full"
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            />
            
            {/* 搜索历史下拉框 */}
            {showSearchHistory && searchHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-gray-800"
              >
                <div className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium">搜索历史</span>
                  <button 
                    onClick={clearSearchHistory}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500"
                  >
                    清除
                  </button>
                </div>
                <ul>
                  {searchHistory.map((item, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => handleSearch(item)}
                        className="w-full text-left p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <i className="fas fa-history text-gray-400 mr-2"></i>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 设备列表内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 活跃筛选条件 */}
        {filteredDevices.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {selectedCategory !== 'all' && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  <button 
                    onClick={() => handleCategoryChange('all')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              {selectedPriceRange !== 'all' && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                  {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.name}
                  <button 
                    onClick={() => handlePriceRangeChange('all')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              {selectedCondition !== 'all' && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                  {CONDITIONS.find(c => c.id === selectedCondition)?.name}
                  <button 
                    onClick={() => handleConditionChange('all')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              {searchQuery && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                  {searchQuery}
                  <button 
                    onClick={() => handleSearch('')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedCondition !== 'all' || searchQuery) && (
                <button 
                  onClick={resetFilters}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  清除全部
                  <i className="fas fa-times ml-2"></i>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧筛选栏 */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-16 p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              {/* 移动端筛选器切换按钮 */}
              <div className="lg:hidden mb-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">筛选</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {showFilters ? '收起' : '展开'} <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'} ml-1`}></i>
                </button>
              </div>
              
              {/* 筛选内容 */}
              <div className={showFilters ? 'block' : 'hidden lg:block'}>
                {/* 分类筛选 */}
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">设备分类</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        <i className={`fas ${category.icon} mr-2`}></i>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 价格筛选 */}
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">价格区间</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handlePriceRangeChange(range.id)}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPriceRange === range.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 成色筛选 */}
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">设备成色</h3>
                  <div className="space-y-2">
                    {CONDITIONS.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => handleConditionChange(condition.id)}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCondition === condition.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        {condition.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 更多筛选条件 */}
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">卖家类型</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>平台自营</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>企业直售</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>个人卖家</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">所在地</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>上海</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>广东</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>江苏</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>浙江</span>
                    </label>
                    <button className="text-blue-500 text-sm">更多城市</button>
                  </div>
                </div>
                
                {/* 重置按钮 */}
                <button
                  onClick={resetFilters}
                  className={`w-full py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  重置筛选
                </button>
              </div>
            </div>
          </div>
          
          {/* 右侧设备列表 */}
          <div className="lg:col-span-3">
            {/* 排序和筛选信息 */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 rounded-16 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div>
                <h2 className="text-xl font-bold mb-1">设备市场</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  共找到 {filteredDevices.length} 件商品
                </p>
              </div>
              
              {/* 排序选择 */}
              <div className="mt-3 sm:mt-0 w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg border text-sm focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 加载状态 */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className={`rounded-16 overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '80%' }}></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '60%' }}></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '40%' }}></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredDevices.length > 0 ? (
              // 设备列表
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <DeviceCard 
                    key={device.id}
                    device={device}
                    onClick={() => handleDeviceClick(device.id)}
                  />
                ))}
              </div>
            ) : (
              // 空状态
              <Empty 
                message="没有找到符合条件的设备" 
                icon="fa-search" 
                onClick={() => resetFilters()}
              />
            )}

            {/* 分页控件 */}
            {filteredDevices.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button 
                    className={`px-3 py-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-white text-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button 
                      key={page}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        page === 1 
                          ? 'bg-blue-500 text-white' 
                          : theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <span className="px-2">...</span>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    10
                  </button>
                  
                  <button 
                    className={`px-3 py-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}