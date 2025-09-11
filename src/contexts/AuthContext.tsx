import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { DEMO_MODE, findDemoUser, getDemoUserById } from '@/lib/demo-data';

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
          
          // In demo mode, skip server verification
          if (!DEMO_MODE) {
            await authAPI.getMe();
          }
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
      
      if (DEMO_MODE) {
        // Demo mode login
        const demoUser = findDemoUser(username, password);
        
        if (demoUser) {
          const userData = {
            id: demoUser.id,
            fullName: demoUser.fullName,
            username: demoUser.username,
            email: demoUser.email,
            role: demoUser.role,
            phone: demoUser.phone
          };
          
          const demoToken = `demo-token-${demoUser.id}`;
          localStorage.setItem('token', demoToken);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          toast({
            title: "Login berhasil (Mode Demo)",
            description: `Selamat datang, ${userData.fullName}`,
          });
        } else {
          throw new Error('Username atau password salah');
        }
      } else {
        // Real backend login
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
      
      if (DEMO_MODE) {
        // Demo mode registration (simplified)
        toast({
          title: "Registrasi berhasil (Mode Demo)",
          description: "Dalam mode demo, gunakan akun yang sudah tersedia",
        });
      } else {
        // Real backend registration
        const response = await authAPI.register(userData);
        
        if (response.success) {
          toast({
            title: "Registrasi berhasil",
            description: "Akun berhasil dibuat, silakan login",
          });
        } else {
          throw new Error(response.message || 'Registrasi gagal');
        }
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
      description: DEMO_MODE ? "Anda telah keluar dari mode demo" : "Anda telah keluar dari sistem",
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