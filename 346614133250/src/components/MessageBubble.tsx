import React from 'react';
import { Message } from '../contexts/chatContext';
import { useTheme } from '../hooks/useTheme';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const { theme } = useTheme();
  
  // 格式化时间
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
          <img 
            src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture&sign=c1d9440f3ad417ee5f4c7c5a92ebbf15" 
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`max-w-[70%] relative`}>
        <div className={`px-4 py-2 rounded-lg ${
          isCurrentUser
            ? theme === 'dark' 
              ? 'bg-blue-700 text-white rounded-br-none' 
              : 'bg-blue-500 text-white rounded-br-none'
            : theme === 'dark'
              ? 'bg-gray-700 text-white rounded-bl-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className={`text-xs mt-1 block ${
          isCurrentUser ? 'text-right' : 'text-left'
        } ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};