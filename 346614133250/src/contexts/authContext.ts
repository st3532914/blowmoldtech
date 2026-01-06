import { createContext } from "react";

// 定义用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
  creditScore?: number;
  memberLevel?: string;
}

// 定义认证上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  login: () => {},
  logout: () => {},
});