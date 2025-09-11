// Demo data untuk mode demo tanpa backend

export const DEMO_MODE = true;

export const demoUsers = [
  {
    id: '1',
    fullName: 'Administrator',
    username: 'admin',
    email: 'admin@bkn-gorontalo.com',
    role: 'Admin',
    phone: '081234567890',
    password: 'admin123'
  },
  {
    id: '2',
    fullName: 'Staff Inventaris',
    username: 'staff',
    email: 'staff@bkn-gorontalo.com', 
    role: 'Staff',
    phone: '081234567891',
    password: 'staff123'
  },
  {
    id: '3',
    fullName: 'Supervisor',
    username: 'supervisor',
    email: 'supervisor@bkn-gorontalo.com',
    role: 'Supervisor', 
    phone: '081234567892',
    password: 'supervisor123'
  }
];

export const demoInventory = [
  {
    id: '1',
    name: 'Laptop Dell Latitude 5520',
    code: 'INV001',
    category: 'Elektronik',
    condition: 'Baik',
    location: 'Ruang IT',
    description: 'Laptop untuk kebutuhan administrasi',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Kursi Kantor Ergonomis',
    code: 'INV002', 
    category: 'Furniture',
    condition: 'Baik',
    location: 'Ruang Staff',
    description: 'Kursi kantor dengan sandaran ergonomis',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: '3',
    name: 'Proyektor Epson',
    code: 'INV003',
    category: 'Elektronik', 
    condition: 'Rusak Ringan',
    location: 'Ruang Rapat',
    description: 'Proyektor untuk presentasi',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  }
];

export const demoLocations = [
  {
    id: '1',
    name: 'Ruang IT',
    description: 'Ruangan untuk divisi IT dan teknologi',
    capacity: 10,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '2', 
    name: 'Ruang Staff',
    description: 'Ruangan kerja staff administrasi',
    capacity: 20,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Ruang Rapat',
    description: 'Ruangan untuk meeting dan presentasi',
    capacity: 15,
    createdAt: '2024-01-10', 
    updatedAt: '2024-01-10'
  }
];

export const demoEvents = [
  {
    id: '1',
    name: 'Rapat Koordinasi Bulanan',
    description: 'Rapat koordinasi rutin setiap bulan',
    startDate: '2024-02-15',
    endDate: '2024-02-15',
    location: 'Ruang Rapat',
    status: 'Selesai',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15'
  },
  {
    id: '2',
    name: 'Pelatihan Software Baru',
    description: 'Pelatihan penggunaan software inventaris baru',
    startDate: '2024-02-20',
    endDate: '2024-02-22',
    location: 'Ruang IT',
    status: 'Berlangsung',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-20'
  }
];

export const demoStats = {
  inventory: {
    total: 156,
    available: 142,
    damaged: 8,
    maintenance: 6
  },
  locations: {
    total: 12,
    active: 12,
    inactive: 0
  },
  events: {
    total: 24,
    active: 3,
    completed: 21
  }
};

// Helper functions untuk demo mode
export const findDemoUser = (username: string, password: string) => {
  return demoUsers.find(user => user.username === username && user.password === password);
};

export const getDemoUserById = (id: string) => {
  return demoUsers.find(user => user.id === id);
};