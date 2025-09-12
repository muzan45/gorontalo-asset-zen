# 📋 Panduan Instalasi Lengkap - Sistem Inventaris Digital BKN

## 🎯 Persyaratan Sistem

### Hardware Requirements (NAS/Server)
- **RAM**: Minimum 4GB, Rekomendasi 8GB
- **Storage**: Minimum 20GB ruang kosong
- **CPU**: Dual Core atau lebih
- **Network**: Ethernet Port untuk koneksi jaringan lokal

### Software Requirements
- **Operating System**: Ubuntu 20.04 LTS / CentOS 8 / Windows Server
- **Node.js**: Version 16.0 atau lebih baru
- **MySQL**: Version 8.0 atau lebih baru
- **PM2**: Process Manager untuk Node.js (akan diinstall)

## 🛠️ Tahap 1: Persiapan Server/NAS

### 1.1 Update System (Ubuntu/CentOS)
```bash
# Ubuntu
sudo apt update && sudo apt upgrade -y

# CentOS
sudo yum update -y
```

### 1.2 Install Node.js
```bash
# Download dan install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### 1.3 Install MySQL Server
```bash
# Ubuntu
sudo apt install mysql-server -y

# CentOS
sudo yum install mysql-server -y

# Start dan enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

### 1.4 Install Git
```bash
sudo apt install git -y
```

## 🗄️ Tahap 2: Setup Database

### 2.1 Login ke MySQL
```bash
sudo mysql -u root -p
```

### 2.2 Buat Database dan User
```sql
-- Buat database
CREATE DATABASE inventaris_bkn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Buat user untuk aplikasi
CREATE USER 'inventaris_user'@'localhost' IDENTIFIED BY 'password_yang_kuat_123!';

-- Berikan privileges
GRANT ALL PRIVILEGES ON inventaris_bkn.* TO 'inventaris_user'@'localhost';
GRANT ALL PRIVILEGES ON inventaris_bkn.* TO 'inventaris_user'@'%';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Keluar dari MySQL
EXIT;
```

## 📁 Tahap 3: Download dan Setup Aplikasi

### 3.1 Clone Repository
```bash
# Pindah ke direktori web
cd /var/www/

# Clone aplikasi (ganti dengan URL repository Anda)
sudo git clone <URL_REPOSITORY> inventaris-bkn
cd inventaris-bkn

# Ubah ownership
sudo chown -R $USER:$USER /var/www/inventaris-bkn
```

### 3.2 Setup Backend
```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
npm install

# Install PM2 globally untuk production
sudo npm install -g pm2

# Copy environment file
cp .env.example .env
```

### 3.3 Konfigurasi Environment (.env)
```bash
# Edit file .env
nano .env
```

Isi dengan konfigurasi berikut:
```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inventaris_bkn
DB_USER=inventaris_user
DB_PASSWORD=password_yang_kuat_123!

# JWT Configuration (GANTI dengan kunci rahasia yang kuat!)
JWT_SECRET=super-secret-key-yang-sangat-panjang-dan-aman-untuk-production-2024
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration (IP Server NAS Anda)
CORS_ORIGIN=http://192.168.1.100:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 3.4 Buat Direktori Upload
```bash
mkdir -p uploads
chmod 755 uploads
```

## 🚀 Tahap 4: Setup Frontend

### 4.1 Install Dependencies Frontend
```bash
# Kembali ke root directory
cd ..

# Install dependencies
npm install

# Install serve untuk production
sudo npm install -g serve
```

### 4.2 Konfigurasi API URL
```bash
# Edit file konfigurasi API
nano src/lib/api.ts
```

Ganti baseURL dengan IP server NAS Anda:
```typescript
const api = axios.create({
  baseURL: 'http://192.168.1.100:5000/api', // Ganti dengan IP NAS Anda
  timeout: 10000,
});
```

### 4.3 Build Aplikasi Frontend
```bash
# Build untuk production
npm run build
```

## ⚡ Tahap 5: Setup Production dengan PM2

### 5.1 Konfigurasi PM2 untuk Backend
```bash
cd backend

# Buat file konfigurasi PM2
nano ecosystem.config.js
```

Isi dengan:
```javascript
module.exports = {
  apps: [{
    name: 'inventaris-bkn-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 5.2 Buat Direktori Logs
```bash
mkdir -p logs
```

### 5.3 Start Backend dengan PM2
```bash
# Start aplikasi
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# Ikuti instruksi yang muncul (copy-paste command yang diberikan)
```

### 5.4 Setup Frontend Production
```bash
# Kembali ke root directory
cd ..

# Start frontend dengan PM2
pm2 serve dist 3000 --name "inventaris-bkn-frontend" --spa

# Save configuration
pm2 save
```

## 🌐 Tahap 6: Konfigurasi Firewall dan Network

### 6.1 Configure UFW (Ubuntu)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow aplikasi ports
sudo ufw allow 3000  # Frontend
sudo ufw allow 5000  # Backend

# Check status
sudo ufw status
```

### 6.2 Configure Network Access
Pastikan NAS/Server dapat diakses dari jaringan lokal:
- Frontend: `http://IP_NAS:3000`
- Backend API: `http://IP_NAS:5000`

## 👤 Tahap 7: Setup User Admin Pertama

### 7.1 Menggunakan API untuk Register Admin
```bash
# Test koneksi backend
curl http://localhost:5000/api/health

# Register admin user pertama
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Administrator",
    "username": "admin",
    "email": "admin@bkn.go.id",
    "password": "admin123456",
    "role": "admin"
  }'
```

## 📊 Tahap 8: Verifikasi Instalasi

### 8.1 Check Backend Status
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs inventaris-bkn-backend --lines 50
```

### 8.2 Test API Endpoints
```bash
# Test health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

### 8.3 Akses Aplikasi Web
1. Buka browser dari komputer client
2. Navigasi ke: `http://IP_NAS:3000`
3. Login dengan:
   - Username: `admin`
   - Password: `admin123456`

## 🔧 Tahap 9: Maintenance dan Monitoring

### 9.1 Auto-Restart dan Monitoring
```bash
# Monitor aplikasi
pm2 monit

# Restart aplikasi jika diperlukan
pm2 restart all

# Update aplikasi (saat ada update)
cd /var/www/inventaris-bkn
git pull
cd backend && npm install
cd .. && npm install && npm run build
pm2 restart all
```

### 9.2 Backup Database Otomatis
```bash
# Buat script backup
sudo nano /etc/cron.daily/backup-inventaris

# Isi dengan:
#!/bin/bash
BACKUP_DIR="/var/backups/inventaris"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u inventaris_user -ppassword_yang_kuat_123! inventaris_bkn > $BACKUP_DIR/inventaris_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Make executable
sudo chmod +x /etc/cron.daily/backup-inventaris
```

## 📝 Konfigurasi Network untuk Akses Kantor

### 10.1 Setting Static IP (Optional)
```bash
# Edit netplan (Ubuntu)
sudo nano /etc/netplan/00-installer-config.yaml

# Example configuration:
network:
  version: 2
  ethernets:
    eth0:  # atau interface name yang sesuai
      dhcp4: no
      addresses:
        - 192.168.1.100/24  # IP static yang diinginkan
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]

# Apply configuration
sudo netplan apply
```

### 10.2 Update CORS Origin
```bash
# Edit .env untuk mengizinkan akses dari jaringan lokal
nano backend/.env

# Update CORS_ORIGIN
CORS_ORIGIN=http://192.168.1.0/24,http://192.168.1.100:3000,http://localhost:3000

# Restart backend
pm2 restart inventaris-bkn-backend
```

## 🆘 Troubleshooting Umum

### Database Connection Error
```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Test database connection
mysql -u inventaris_user -p -h localhost inventaris_bkn
```

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :5000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 PID_NUMBER
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/inventaris-bkn

# Fix upload permissions
chmod 755 backend/uploads
```

### Memory Issues
```bash
# Check memory usage
free -h

# Check PM2 processes
pm2 list
pm2 show inventaris-bkn-backend
```

## 📞 Support dan Dokumentasi

- **API Documentation**: `http://IP_NAS:5000/api/health`
- **Log Files**: `backend/logs/`
- **PM2 Monitoring**: `pm2 monit`
- **Database**: MySQL pada port 3306

## ✅ Checklist Instalasi

- [ ] Node.js 16+ terinstall
- [ ] MySQL 8+ terinstall dan dikonfigurasi
- [ ] Database `inventaris_bkn` dibuat
- [ ] User database `inventaris_user` dibuat
- [ ] Aplikasi di-clone ke `/var/www/inventaris-bkn`
- [ ] Backend dependencies terinstall
- [ ] Frontend dependencies terinstall
- [ ] File `.env` dikonfigurasi
- [ ] PM2 terinstall dan dikonfigurasi
- [ ] Backend berjalan di PM2 port 5000
- [ ] Frontend berjalan di PM2 port 3000
- [ ] Firewall dikonfigurasi
- [ ] Admin user pertama dibuat
- [ ] Aplikasi dapat diakses dari browser
- [ ] Backup otomatis dikonfigurasi

**Selamat! Sistem Inventaris Digital BKN siap digunakan di jaringan kantor Anda! 🎉**