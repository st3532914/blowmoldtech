import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto whitespace-nowrap">
      <div className="flex space-x-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category.id)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className={`fas ${category.icon} mr-2`}></i>
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};