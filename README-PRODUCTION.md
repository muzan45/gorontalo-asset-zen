# 🏢 Sistem Inventaris Digital BKN Gorontalo
## Production Ready Version

Sistem manajemen inventaris digital yang siap deploy untuk UPT BKN Gorontalo dengan fitur lengkap untuk mengelola sarana dan prasarana kantor.

## ✨ Fitur Utama

### 📊 Dashboard
- Overview statistik inventaris
- Grafik kondisi barang
- Aksi cepat (Tambah Barang, Jadwalkan Kegiatan, dll)

### 📦 Manajemen Inventaris
- CRUD inventaris lengkap
- Kategorisasi barang (Furniture, Electronics, Tools, dll)
- Tracking kondisi (Baik, Rusak Ringan, Rusak Berat, Hilang)
- Upload foto barang
- Export data ke Excel
- Sinkronisasi data

### 📍 Manajemen Lokasi
- Kelola lokasi/ruangan
- Mapping inventaris ke lokasi
- Kapasitas ruangan

### 🎯 Manajemen Kegiatan
- Pencatatan kegiatan/acara
- Assignment inventaris ke kegiatan
- Tracking penggunaan barang
- Status kegiatan (Planned, Ongoing, Completed)

### 📈 Laporan
- Laporan inventaris lengkap
- Laporan kegiatan
- Export PDF dan Excel
- Filter dan pencarian advanced

### 👥 Manajemen User
- Role-based access (Admin, Supervisor, Staff, Operator)
- Authentication JWT
- Audit trail

## 🚀 Quick Start

### Opsi 1: Instalasi Otomatis (Rekomendasi)
```bash
# Download dan jalankan installer
wget https://raw.githubusercontent.com/your-repo/main/install.sh
chmod +x install.sh
./install.sh
```

### Opsi 2: Docker (Advanced)
```bash
git clone <repository-url>
cd inventaris-bkn
docker-compose up -d
```

### Opsi 3: Manual Setup
Ikuti panduan lengkap di `PANDUAN_INSTALASI.md`

## 📋 Persyaratan Sistem

### Minimum Requirements:
- **OS**: Ubuntu 18.04+ / CentOS 7+ / Windows Server 2016+
- **RAM**: 4GB (Rekomendasi: 8GB)
- **Storage**: 20GB free space
- **Network**: Ethernet connection untuk akses LAN

### Software Dependencies:
- Node.js 16+ 
- MySQL 8.0+
- PM2 (auto-installed)

## 🌐 Deployment Options

| Option | Best For | Complexity | Cost |
|--------|----------|------------|------|
| **Manual NAS** | Office LAN | ⭐⭐ | FREE |
| **Docker** | Consistent deployment | ⭐⭐⭐ | FREE |
| **Cloud VM** | Internet access | ⭐⭐ | $5-20/month |

## 🔧 Konfigurasi Network

### Akses Lokal (NAS/Server):
- Frontend: `http://192.168.1.100:3000`
- Backend API: `http://192.168.1.100:5000`
- Database: `localhost:3306`

### Port Requirements:
- **3000**: Frontend Web App
- **5000**: Backend API
- **3306**: MySQL Database

## 👤 Default Login

Setelah instalasi, gunakan akun default:
- **Username**: `admin`
- **Password**: `admin123456`

⚠️ **PENTING**: Ganti password default setelah login pertama!

## 📁 Struktur Project

```
inventaris-bkn/
├── backend/                 # API Server (Node.js + Express)
│   ├── config/             # Database config
│   ├── models/             # Data models (Sequelize)
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & validation
│   ├── migrations/         # Database migrations
│   └── uploads/            # File storage
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # UI components
│   ├── pages/              # Application pages
│   ├── lib/                # Utilities & API
│   └── assets/             # Static assets
├── PANDUAN_INSTALASI.md    # Complete setup guide
├── DEPLOYMENT_OPTIONS.md   # Deployment strategies
├── MAINTENANCE_GUIDE.md    # Operation & maintenance
└── install.sh             # Auto-installer script
```

## 🛠️ Maintenance

### Daily Operations:
```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart if needed
pm2 restart all
```

### Backup:
```bash
# Auto-backup (configured during install)
/usr/local/bin/backup-inventaris.sh

# Manual backup
mysqldump -u inventaris_user -p inventaris_bkn > backup.sql
```

### Updates:
```bash
cd /var/www/inventaris-bkn
git pull origin main
npm install
npm run build
pm2 restart all
```

## 📚 Dokumentasi Lengkap

- 📖 **[Panduan Instalasi](PANDUAN_INSTALASI.md)** - Setup lengkap step-by-step
- 🚀 **[Opsi Deployment](DEPLOYMENT_OPTIONS.md)** - Manual, Docker, Cloud options
- 🔧 **[Panduan Maintenance](MAINTENANCE_GUIDE.md)** - Operasional & troubleshooting
- 🔒 **[Security Guide](backend/README.md)** - Keamanan & best practices

## 🆘 Support & Troubleshooting

### Common Issues:
1. **Port 5000 already in use**: `sudo lsof -i :5000` then kill process
2. **Database connection error**: Check MySQL status & credentials
3. **Permission denied**: Fix with `sudo chown -R $USER:$USER /var/www/inventaris-bkn`

### Health Check:
- Backend: `curl http://localhost:5000/api/health`
- Frontend: Browser ke `http://localhost:3000`
- Database: `mysql -u inventaris_user -p inventaris_bkn`

### Logs Location:
- Application: `backend/logs/`
- PM2: `~/.pm2/logs/`
- MySQL: `/var/log/mysql/`

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Role-based Authorization (RBAC)
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Activity logging

## 📊 Built With

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File upload

### Frontend:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Router** - Navigation
- **Axios** - API client

## 📄 License

MIT License - Free untuk penggunaan komersial dan non-komersial.

## 👥 Team

Dikembangkan untuk **UPT BKN Gorontalo** dengan focus pada kemudahan penggunaan dan reliability untuk operasional sehari-hari.

---

**🎉 Siap deploy dan digunakan untuk mengelola inventaris kantor Anda!**