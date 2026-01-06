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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center',
        className
      )}
    >
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full py-3 pl-12 pr-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <i className="fas fa-search absolute left-4 text-gray-400"></i>
      <button
        type="submit"
        className="absolute right-2 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        搜索
      </button>

      {/* 搜索建议下拉框 */}
      {query && suggestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-gray-800"
        >
          <ul>
            {suggestions.map((item, index) => (
              <li key={index}>
                <button 
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    onSearch(item);
                  }}
                  className="w-full text-left p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <i className="fas fa-search text-gray-400 mr-2"></i>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 热门搜索标签 */}
      {!query && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 bg-white dark:bg-gray-800 p-3">
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => {
                  setQuery(item);
                  onSearch(item);
                }}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};