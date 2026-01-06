import React from 'react';
import { motion } from 'framer-motion';
import { Conversation } from '../contexts/chatContext';
import { useTheme } from '../hooks/useTheme';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isActive, 
  onClick 
}) => {
  const { theme } = useTheme();
  
  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}分钟前`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}小时前`;
    } else {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${month}/${day}`;
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(249, 250, 251, 1)' }}
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer ${
        isActive 
          ? theme === 'dark' 
            ? 'bg-gray-700' 
            : 'bg-blue-50'
          : ''
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={conversation.otherUserAvatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture&sign=c1d9440f3ad417ee5f4c7c5a92ebbf15'} 
            alt={conversation.otherUserName}
            className="w-full h-full object-cover"
          />
        </div>
        {conversation.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h4 className="font-medium truncate">{conversation.otherUserName}</h4>
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
          {conversation.lastMessage}
        </p>
      </div>
      
      {conversation.unreadCount > 0 && (
        <div className="ml-2 flex-shrink-0">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </motion.div>
  );
};