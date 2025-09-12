import axios from 'axios';
import { DEMO_MODE, demoUsers, demoInventory, demoLocations, demoEvents, demoStats } from './demo-data';

const API_BASE_URL = (() => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production/local network detection
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production on same server
  if (window.location.port === '3000') {
    return `http://${hostname}:5000/api`;
  }
  
  // Default production (same domain)
  return '/api';
})();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('This should not be called in demo mode - use AuthContext instead');
    }
    
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Registrasi berhasil (demo mode)',
        data: { user: userData }
      };
    }
    
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getMe: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return {
          success: true,
          data: { user: JSON.parse(storedUser) }
        };
      }
      throw new Error('Not authenticated');
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  getUsers: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          users: demoUsers.map(u => ({ ...u, password: undefined })),
          pagination: { page: 1, limit: 10, total: demoUsers.length }
        }
      };
    }
    
    const response = await api.get('/auth/users', { params });
    return response.data;
  },
  
  updateUser: async (id: string, data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'User updated successfully (demo mode)',
        data: { user: { id, ...data } }
      };
    }
    
    const response = await api.put(`/auth/users/${id}`, data);
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          items: demoInventory,
          pagination: { page: 1, limit: 10, total: demoInventory.length }
        }
      };
    }
    
    const response = await api.get('/inventory', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const item = demoInventory.find(i => i.id === id);
      return {
        success: true,
        data: { item: item || null }
      };
    }
    
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem = {
        id: String(demoInventory.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        message: 'Item berhasil dibuat (demo mode)',
        data: { item: newItem }
      };
    }
    
    const response = await api.post('/inventory', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Item berhasil diupdate (demo mode)',
        data: { item: { id, ...data } }
      };
    }
    
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Item berhasil dihapus (demo mode)'
      };
    }
    
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: demoStats.inventory
      };
    }
    
    const response = await api.get('/inventory/stats/summary');
    return response.data;
  },
};

// Locations API
export const locationsAPI = {
  getAll: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          locations: demoLocations,
          pagination: { page: 1, limit: 10, total: demoLocations.length }
        }
      };
    }
    
    const response = await api.get('/locations', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const location = demoLocations.find(l => l.id === id);
      return {
        success: true,
        data: { location: location || null }
      };
    }
    
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newLocation = {
        id: String(demoLocations.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        message: 'Lokasi berhasil dibuat (demo mode)',
        data: { location: newLocation }
      };
    }
    
    const response = await api.post('/locations', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Lokasi berhasil diupdate (demo mode)',
        data: { location: { id, ...data } }
      };
    }
    
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Lokasi berhasil dihapus (demo mode)'
      };
    }
    
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: demoStats.locations
      };
    }
    
    const response = await api.get('/locations/stats/summary');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          events: demoEvents,
          pagination: { page: 1, limit: 10, total: demoEvents.length }
        }
      };
    }
    
    const response = await api.get('/kegiatan', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const event = demoEvents.find(e => e.id === id);
      return {
        success: true,
        data: { event: event || null }
      };
    }
    
    const response = await api.get(`/kegiatan/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEvent = {
        id: String(demoEvents.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        message: 'Kegiatan berhasil dibuat (demo mode)',
        data: { event: newEvent }
      };
    }
    
    const response = await api.post('/kegiatan', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Kegiatan berhasil diupdate (demo mode)',
        data: { event: { id, ...data } }
      };
    }
    
    const response = await api.put(`/kegiatan/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Kegiatan berhasil dihapus (demo mode)'
      };
    }
    
    const response = await api.delete(`/kegiatan/${id}`);
    return response.data;
  },
  
  assignInventory: async (eventId: string, items: any[]) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Inventaris berhasil ditugaskan (demo mode)'
      };
    }
    
    const response = await api.post(`/kegiatan/${eventId}/items`, { items });
    return response.data;
  },
  
  updateCondition: async (eventId: string, itemId: string, data: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Kondisi item berhasil diupdate (demo mode)'
      };
    }
    
    const response = await api.put(`/kegiatan/${eventId}/items/${itemId}`, data);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getInventoryReport: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          report: 'Demo inventory report data',
          items: demoInventory,
          summary: demoStats.inventory
        }
      };
    }
    
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },
  
  getEventReport: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          report: 'Demo event report data',
          events: demoEvents,
          summary: demoStats.events
        }
      };
    }
    
    const response = await api.get('/reports/events', { params });
    return response.data;
  },
  
  exportInventoryPDF: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Create a mock PDF blob
      const pdfContent = 'Demo PDF content for inventory report';
      return new Blob([pdfContent], { type: 'application/pdf' });
    }
    
    const response = await api.get('/reports/inventory/export/pdf', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportInventoryExcel: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Create a mock Excel blob
      const excelContent = 'Demo Excel content for inventory report';
      return new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    const response = await api.get('/reports/inventory/export/excel', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportEventPDF: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pdfContent = 'Demo PDF content for event report';
      return new Blob([pdfContent], { type: 'application/pdf' });
    }
    
    const response = await api.get('/reports/events/export/pdf', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportEventExcel: async (params?: any) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const excelContent = 'Demo Excel content for event report';
      return new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    const response = await api.get('/reports/events/export/excel', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  backup: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Backup berhasil dibuat (demo mode)',
        data: { backupFile: 'demo-backup.sql' }
      };
    }
    
    const response = await api.post('/backup');
    return response.data;
  },
  
  restore: async (file: File) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Restore berhasil (demo mode)'
      };
    }
    
    const formData = new FormData();
    formData.append('backup', file);
    const response = await api.post('/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;