import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../contexts/chatContext';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';
import { ConversationItem } from '../components/ConversationItem';
import { MessageBubble } from '../components/MessageBubble';
import { Empty } from '../components/Empty';
import { toast } from 'sonner';

export default function Chat() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { 
    conversations, 
    currentConversation, 
    messages, 
    setCurrentConversation, 
    sendMessage,
    createConversation
  } = useContext(ChatContext);
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 检查用户是否已登录并处理新对话
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录才能使用聊天功能');
      navigate('/login');
    } else {
      // 检查是否有新对话请求
      const newConversationData = localStorage.getItem('newConversation');
      if (newConversationData) {
        try {
          const { userId, userName, userAvatar } = JSON.parse(newConversationData);
          createConversation(userId, userName, userAvatar);
          // 清除临时数据
          localStorage.removeItem('newConversation');
        } catch (error) {
          console.error('Failed to parse new conversation data:', error);
        }
      }
    }
  }, [isAuthenticated, navigate, createConversation]);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 处理选择对话
  const handleSelectConversation = (conversation: any) => {
    setCurrentConversation(conversation);
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 获取当前对话的消息
  const getCurrentConversationMessages = () => {
    if (!currentConversation) return [];
    return messages.filter(msg => 
      (msg.senderId === 'currentUser' && msg.receiverId === currentConversation.otherUserId) || 
      (msg.senderId === currentConversation.otherUserId && msg.receiverId === 'currentUser')
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* 顶部导航 */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
            <h1 className="text-lg font-semibold">消息中心</h1>
            <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
          </div>
        </div>
      </div>

      {/* 聊天内容 */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* 对话列表 */}
        <div className={`w-full md:w-80 border-r ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* 搜索框 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索对话..."
                className={`w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          {/* 对话列表 */}
          <div className="overflow-y-auto h-[calc(100vh-130px)]">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ))
            ) : (
              <Empty message="暂无对话" icon="fa-comments" />
            )}
          </div>
        </div>
        
        {/* 聊天界面 */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* 聊天头部 */}
              <div className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } flex items-center`}>
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={currentConversation.otherUserAvatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20profile%20picture&sign=c1d9440f3ad417ee5f4c7c5a92ebbf15'} 
                      alt={currentConversation.otherUserName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {currentConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{currentConversation.otherUserName}</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentConversation.isOnline ? '在线' : '离线'}
                  </p>
                </div>
              </div>
              
              {/* 聊天消息区域 */}
              <div className={`flex-1 p-4 overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                {getCurrentConversationMessages().map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === 'currentUser'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* 输入区域 */}
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入消息..."
                      rows={1}
                      className={`w-full py-2 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className={`p-3 rounded-full ${
                      messageInput.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-200 text-gray-400'
                    } transition-colors`}
                    aria-label="发送消息"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Empty message="选择一个对话开始聊天" icon="fa-comment-alt" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}