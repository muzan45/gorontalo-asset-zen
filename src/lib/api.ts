import axios from 'axios';

const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  ((location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api');

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
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  getUsers: async (params?: any) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/auth/users/${id}`, data);
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/inventory/stats/summary');
    return response.data;
  },
};

// Locations API
export const locationsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/locations', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/locations', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/locations/stats/summary');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/kegiatan', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/kegiatan/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/kegiatan', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/kegiatan/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/kegiatan/${id}`);
    return response.data;
  },
  
  assignInventory: async (eventId: string, items: any[]) => {
    const response = await api.post(`/kegiatan/${eventId}/items`, { items });
    return response.data;
  },
  
  updateCondition: async (eventId: string, itemId: string, data: any) => {
    const response = await api.put(`/kegiatan/${eventId}/items/${itemId}`, data);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getInventoryReport: async (params?: any) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },
  
  getEventReport: async (params?: any) => {
    const response = await api.get('/reports/events', { params });
    return response.data;
  },
  
  exportInventoryPDF: async (params?: any) => {
    const response = await api.get('/reports/inventory/export/pdf', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportInventoryExcel: async (params?: any) => {
    const response = await api.get('/reports/inventory/export/excel', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportEventPDF: async (params?: any) => {
    const response = await api.get('/reports/events/export/pdf', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportEventExcel: async (params?: any) => {
    const response = await api.get('/reports/events/export/excel', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  
  backup: async () => {
    const response = await api.post('/backup');
    return response.data;
  },
  
  restore: async (file: File) => {
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