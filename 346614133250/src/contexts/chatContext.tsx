import { createContext, useState, useEffect, ReactNode } from 'react';

// 消息类型定义
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
}

// 对话类型定义
export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
}

// 聊天上下文类型
interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (userId: string, userName: string, userAvatar?: string) => void;
}

// 创建聊天上下文
export const ChatContext = createContext<ChatContextType>({
  conversations: [],
  currentConversation: null,
  messages: [],
  setCurrentConversation: () => {},
  sendMessage: () => {},
  markAsRead: () => {},
  createConversation: () => {},
});

// 聊天提供者组件
export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    // 从localStorage加载对话数据
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        // 转换时间戳字符串回Date对象
        return parsedConversations.map((conv: any) => ({
          ...conv,
          lastMessageTime: new Date(conv.lastMessageTime)
        }));
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
      }
    }
    // 提供默认对话数据
    return [
      {
        id: 'conv1',
        otherUserId: 'seller1',
        otherUserName: 'BlowMoldTech自营',
        otherUserAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=company%20logo%2C%20EcoTech%2C%20modern%20style&sign=d5a09aece8559449b2e73aa53890709b',
        lastMessage: '您好，关于PET全自动吹瓶机PET-1200，我想了解更多细节',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
        unreadCount: 1,
        isOnline: true
      },
      {
        id: 'conv2',
        otherUserId: 'seller2',
        otherUserName: '远大塑业',
        otherUserAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=business%20owner%2C%20professional%20avatar&sign=425c5eb2d192e4e1baff1a2d31877d45',
        lastMessage: '我们的注塑机有现货，欢迎随时来看货',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
        unreadCount: 0,
        isOnline: false
      }
    ];
  });

  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    // 从localStorage加载消息数据
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // 转换时间戳字符串回Date对象
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
    // 提供默认消息数据
    return [
      {
        id: 'msg1',
        content: '您好，我对您的PET全自动吹瓶机PET-1200很感兴趣，请问机器的具体使用情况如何？',
        senderId: 'currentUser',
        receiverId: 'seller1',
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40分钟前
        isRead: true
      },
      {
        id: 'msg2',
        content: '您好，这台机器是2023年购买的，使用时间不到1年，保养得很好，性能稳定，目前还在正常生产中。',
        senderId: 'seller1',
        receiverId: 'currentUser',
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35分钟前
        isRead: true
      },
      {
        id: 'msg3',
        content: '您好，关于PET全自动吹瓶机PET-1200，我想了解更多细节',
        senderId: 'currentUser',
        receiverId: 'seller1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
        isRead: false
      }
    ];
  });

  // 保存对话数据到localStorage
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  // 保存消息数据到localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // 当切换对话时，加载该对话的消息
  useEffect(() => {
    if (currentConversation) {
      markAsRead(currentConversation.id);
    }
  }, [currentConversation]);

  // 发送消息
  const sendMessage = (content: string) => {
    if (!currentConversation || !content.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: content.trim(),
      senderId: 'currentUser',
      receiverId: currentConversation.otherUserId,
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    
    // 更新对话列表中的最后消息
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversation.id 
          ? {
              ...conv,
              lastMessage: content.trim(),
              lastMessageTime: new Date(),
              unreadCount: 0
            }
          : conv
      )
    );

    // 模拟对方回复
    setTimeout(() => {
      const replies = [
        '好的，我了解了，稍后给您详细回复。',
        '这个问题我需要确认一下，明天给您准确信息。',
        '没问题，我们可以安排现场看货，您方便什么时间？',
        '感谢您的咨询，这台设备目前还有3台现货。',
        '我们提供安装调试服务，您不用担心操作问题。'
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage: Message = {
        id: `msg_${Date.now()}_reply`,
        content: randomReply,
        senderId: currentConversation.otherUserId,
        receiverId: 'currentUser',
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prev => [...prev, replyMessage]);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id 
            ? {
                ...conv,
                lastMessage: randomReply,
                lastMessageTime: new Date(),
                unreadCount: conv.id === currentConversation.id ? 0 : conv.unreadCount + 1
              }
            : conv
        )
      );
    }, 1000 + Math.random() * 3000);
  };

  // 标记对话为已读
  const markAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    
    // 标记该对话的所有消息为已读
    if (currentConversation) {
      setMessages(prev => 
        prev.map(msg => 
          (msg.senderId === currentConversation.otherUserId || msg.receiverId === currentConversation.otherUserId) && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  };

  // 创建新对话
  const createConversation = (userId: string, userName: string, userAvatar?: string) => {
    // 检查是否已存在该用户的对话
    const existingConversation = conversations.find(conv => conv.otherUserId === userId);
    
    if (existingConversation) {
      setCurrentConversation(existingConversation);
    } else {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        otherUserId: userId,
        otherUserName: userName,
        otherUserAvatar: userAvatar,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isOnline: Math.random() > 0.5 // 随机模拟在线状态
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    setCurrentConversation,
    sendMessage,
    markAsRead,
    createConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}