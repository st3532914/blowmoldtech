import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cartContext';
import { useTheme } from '../hooks/useTheme';

const CartIcon: React.FC = () => {
  const { theme } = useTheme();
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  const totalItems = getTotalItems();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/cart')}
      className={`relative p-2 rounded-full ${
        theme === 'dark' 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } transition-colors`}
      aria-label="购物车"
    >
      <i className="fas fa-shopping-cart text-xl"></i>
      {totalItems > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full"
        >
          {totalItems}
        </motion.div>
      )}
    </motion.button>
  );
};

export default CartIcon;