# 🚀 Pilihan Deployment - Sistem Inventaris BKN

## Pilihan 1: Manual Installation (Direkomendasikan untuk NAS)

### Keuntungan:
- ✅ Kontrol penuh atas sistem
- ✅ Cocok untuk NAS/server lokal
- ✅ Resource efficiency
- ✅ Mudah maintenance

### Cara Install:
1. **Otomatis**: Jalankan `chmod +x install.sh && ./install.sh`
2. **Manual**: Ikuti `PANDUAN_INSTALASI.md`

---

## Pilihan 2: Docker Deployment

### Keuntungan:
- ✅ Isolated environment
- ✅ Easy scaling
- ✅ Consistent deployment
- ✅ Easy backup/restore

### Persyaratan:
- Docker & Docker Compose
- Minimum 2GB RAM

### Quick Start:
```bash
# Clone repository
git clone <your-repo> inventaris-bkn
cd inventaris-bkn

# Setup environment
cp backend/.env.production .env
# Edit .env sesuai kebutuhan

# Start dengan Docker
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs
```

### Environment Variables (.env):
```env
# Database
MYSQL_ROOT_PASSWORD=secure_root_password
DB_NAME=inventaris_bkn
DB_USER=inventaris_user
DB_PASSWORD=secure_db_password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key

# Network
CORS_ORIGIN=http://your-nas-ip:3000
```

### Commands:
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Backup database
docker exec inventaris-mysql mysqldump -u root -p inventaris_bkn > backup.sql

# Restore database
docker exec -i inventaris-mysql mysql -u root -p inventaris_bkn < backup.sql

# Update application
docker-compose pull
docker-compose up -d --force-recreate
```

---

## Pilihan 3: Cloud Deployment

### Platform Pilihan:
1. **DigitalOcean Droplet** (Rekomendasi)
2. **AWS EC2**
3. **Google Cloud VM**
4. **Azure VM**

### Spec Minimum Cloud:
- **CPU**: 1 vCPU
- **RAM**: 2GB
- **Storage**: 20GB SSD
- **Bandwidth**: 1TB

### Setup Cloud:
```bash
# 1. Create VM dengan Ubuntu 20.04 LTS
# 2. SSH ke server
ssh root@your-server-ip

# 3. Run installation script
wget https://raw.githubusercontent.com/your-repo/main/install.sh
chmod +x install.sh
./install.sh

# 4. Configure domain (optional)
# Point your domain A record to server IP
# Update CORS_ORIGIN in backend/.env
```

---

## Pilihan 4: Heroku Deployment (Untuk Testing)

### Setup:
```bash
# Install Heroku CLI
# Login: heroku login

# Create apps
heroku create inventaris-bkn-api
heroku create inventaris-bkn-web

# Add MySQL addon
heroku addons:create jawsdb-maria:kitefin -a inventaris-bkn-api

# Set environment variables
heroku config:set NODE_ENV=production -a inventaris-bkn-api
heroku config:set JWT_SECRET=your-jwt-secret -a inventaris-bkn-api

# Deploy backend
git subtree push --prefix=backend heroku-api main

# Deploy frontend
# Update API URL in src/lib/api.ts
git add . && git commit -m "Update API URL"
git push heroku-web main
```

---

## Perbandingan Deployment

| Method | Complexity | Cost | Performance | Maintenance |
|--------|------------|------|-------------|-------------|
| Manual NAS | ⭐⭐ | 💰 FREE | ⚡⚡⚡ | ⭐⭐ |
| Docker | ⭐⭐⭐ | 💰 FREE | ⚡⚡⚡ | ⭐ |
| Cloud VM | ⭐⭐ | 💰💰 $5-20/month | ⚡⚡ | ⭐⭐ |
| Heroku | ⭐ | 💰💰💰 $7-25/month | ⚡ | ⭐⭐⭐ |

---

## Rekomendasi Berdasarkan Kebutuhan

### 🏢 Kantor/NAS Internal:
**Manual Installation** - Kontrol penuh, gratis, performa optimal

### 🌐 Akses Internet:
**Cloud VM + Docker** - Scalable, reliable, moderate cost

### 🧪 Testing/Demo:
**Heroku** - Quick setup, managed infrastructure

### 🔧 Development:
**Docker Compose** - Consistent environment, easy reset

---

## Monitoring & Maintenance

### Health Check URLs:
- Frontend: `http://your-server:3000`
- Backend: `http://your-server:5000/api/health`

### Logs Location:
- **Manual**: `backend/logs/`
- **Docker**: `docker-compose logs`
- **PM2**: `pm2 logs`

### Backup Strategy:
```bash
# Database backup
mysqldump -u user -p inventaris_bkn > backup_$(date +%Y%m%d).sql

# File backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# Full backup
rsync -av /var/www/inventaris-bkn/ /backup/inventaris/
```

### Update Process:
```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd backend && npm install
cd .. && npm install

# Rebuild frontend
npm run build

# Restart services
pm2 restart all
# OR for Docker:
docker-compose up -d --force-recreate
```