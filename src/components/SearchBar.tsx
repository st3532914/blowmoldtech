import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索...',
  onSearch,
  className = '',
  onFocus,
  onBlur,
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);
  };

  // 热门搜索词
  const popularSearches = ['PET吹瓶机', '注塑机', '灌装机', '水处理设备', '二手吹塑机'];

  // 搜索建议（模拟）
  const getSearchSuggestions = (input: string) => {
    if (!input.trim()) return [];
    return popularSearches.filter(item => 
      item.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  };

  const suggestions = getSearchSuggestions(query);

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn('relative flex items-center', className)}
    >
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => {
          setShowDropdown(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
          if (onBlur) onBlur();
        }}
        className="w-full py-3 pl-12 pr-4 rounded-full shadow-md border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all duration-300"
      />
      <i className="fas fa-search absolute left-4 text-gray-400 text-lg"></i>
      
      <motion.button
        type="submit"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="absolute right-2 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
      >
        搜索
      </motion.button>

      {/* 搜索建议下拉框 */}
      {showDropdown && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* 搜索建议 */}
          {query && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300">
                搜索建议
              </div>
              <ul>
                {suggestions.map((item, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants}
                  >
                    <button 
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        onSearch(item);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                    >
                      <i className="fas fa-search text-gray-400 mr-3 w-4 text-center"></i>
                      {item}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* 热门搜索标签 */}
          {(!query || suggestions.length === 0) && (
            <div className="p-4">
              <div className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                热门搜索
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, index) => (
                  <motion.button 
                    key={index}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      onSearch(item);
                      setShowDropdown(false);
                    }}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </form>
  );
};