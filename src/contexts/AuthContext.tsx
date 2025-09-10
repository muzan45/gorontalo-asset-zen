import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify token with server
          await authAPI.getMe();
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ username, password });
      
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${userData.fullName}`,
        });
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login gagal",
        description: error.response?.data?.message || error.message || 'Terjadi kesalahan saat login',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        toast({
          title: "Registrasi berhasil",
          description: "Akun berhasil dibuat, silakan login",
        });
      } else {
        throw new Error(response.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast({
        title: "Registrasi gagal",
        description: error.response?.data?.message || error.message || 'Terjadi kesalahan saat registrasi',
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};