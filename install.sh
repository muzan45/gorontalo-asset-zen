#!/bin/bash

# ================================================
# SCRIPT INSTALASI OTOMATIS - SISTEM INVENTARIS BKN
# ================================================

set -e  # Exit jika ada error

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function untuk konfirmasi user
confirm() {
    while true; do
        read -p "$1 (y/n): " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Silakan jawab y atau n.";;
        esac
    done
}

# Header
clear
echo "================================================"
echo "    SISTEM INVENTARIS DIGITAL BKN GORONTALO    "
echo "           SCRIPT INSTALASI OTOMATIS            "
echo "================================================"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "Script ini tidak boleh dijalankan sebagai root!"
   print_info "Jalankan dengan: ./install.sh"
   exit 1
fi

# Konfirmasi instalasi
print_info "Script ini akan menginstall sistem inventaris BKN secara otomatis"
print_info "Proses ini akan:"
print_info "1. Menginstall Node.js dan dependencies"
print_info "2. Setup MySQL database"
print_info "3. Konfigurasi aplikasi"
print_info "4. Setup PM2 untuk production"
echo ""

if ! confirm "Apakah Anda ingin melanjutkan?"; then
    print_info "Instalasi dibatalkan."
    exit 0
fi

# Get system info
print_info "Mengecek sistem operasi..."
OS=$(lsb_release -si 2>/dev/null || echo "Unknown")
VER=$(lsb_release -sr 2>/dev/null || echo "Unknown")
print_info "OS: $OS $VER"

# Update sistem
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install curl jika belum ada
if ! command -v curl &> /dev/null; then
    print_info "Installing curl..."
    sudo apt install -y curl
fi

# Install Node.js
print_info "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_info "Node.js sudah terinstall: $NODE_VERSION"
else
    print_info "Installing Node.js 18 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js berhasil diinstall: $(node --version)"
fi

# Install MySQL
print_info "Checking MySQL installation..."
if command -v mysql &> /dev/null; then
    print_info "MySQL sudah terinstall"
else
    print_info "Installing MySQL Server..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    print_success "MySQL berhasil diinstall"
    
    print_warning "Silakan jalankan 'sudo mysql_secure_installation' setelah script selesai"
fi

# Install Git
if ! command -v git &> /dev/null; then
    print_info "Installing Git..."
    sudo apt install -y git
fi

# Install PM2
print_info "Installing PM2..."
sudo npm install -g pm2

# Setup directory
INSTALL_DIR="/var/www/inventaris-bkn"
print_info "Membuat direktori instalasi: $INSTALL_DIR"

if [ -d "$INSTALL_DIR" ]; then
    print_warning "Direktori $INSTALL_DIR sudah ada"
    if confirm "Apakah Anda ingin menghapus dan install ulang?"; then
        sudo rm -rf $INSTALL_DIR
    else
        print_info "Menggunakan direktori yang ada"
    fi
fi

# Create directory dan set ownership
sudo mkdir -p $INSTALL_DIR
sudo chown -R $USER:$USER $INSTALL_DIR

# Copy files ke direktori instalasi
print_info "Menyalin file aplikasi..."
cp -r . $INSTALL_DIR/
cd $INSTALL_DIR

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
npm install

# Setup environment file
print_info "Setup environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_info "File .env dibuat dari .env.example"
    print_warning "Silakan edit file backend/.env untuk konfigurasi database"
fi

# Create directories
mkdir -p logs uploads
chmod 755 uploads

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd ..
npm install

# Konfigurasi database
print_info "=== KONFIGURASI DATABASE ==="
echo "Silakan masukkan informasi database MySQL:"

read -p "Database name [inventaris_bkn]: " DB_NAME
DB_NAME=${DB_NAME:-inventaris_bkn}

read -p "Database user [inventaris_user]: " DB_USER
DB_USER=${DB_USER:-inventaris_user}

read -s -p "Database password: " DB_PASSWORD
echo ""

read -p "Database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

# Update .env file
print_info "Updating database configuration..."
cd backend
sed -i "s/DB_NAME=.*/DB_NAME=$DB_NAME/" .env
sed -i "s/DB_USER=.*/DB_USER=$DB_USER/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')
print_info "Server IP: $SERVER_IP"

# Update CORS origin
sed -i "s|CORS_ORIGIN=.*|CORS_ORIGIN=http://$SERVER_IP:3000|" .env

# Database setup
print_info "=== DATABASE SETUP ==="
if confirm "Apakah Anda ingin membuat database dan user secara otomatis?"; then
    print_info "Membuat database dan user..."
    
    # Create database script
    cat > /tmp/setup_db.sql << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;
EOF
    
    print_info "Masukkan password MySQL root:"
    mysql -u root -p < /tmp/setup_db.sql
    
    # Run migrations
    print_info "Running database migrations..."
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/01-create-tables.sql
    
    rm /tmp/setup_db.sql
    print_success "Database setup berhasil!"
else
    print_warning "Silakan setup database manual menggunakan file migrations/01-create-tables.sql"
fi

# Build frontend
print_info "Building frontend application..."
cd ..
npm run build

# Configure firewall
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22    # SSH
    sudo ufw allow 3000  # Frontend
    sudo ufw allow 5000  # Backend
    sudo ufw allow 3306  # MySQL
    print_success "Firewall configured"
fi

# Setup PM2
print_info "Setting up PM2..."
cd backend

# Start backend
pm2 start ecosystem.config.js
print_success "Backend started with PM2"

# Start frontend
cd ..
pm2 serve dist 3000 --name "inventaris-bkn-frontend" --spa

# Save PM2 configuration
pm2 save

# Setup PM2 startup
print_info "Setting up PM2 auto-startup..."
pm2 startup | grep -E "sudo.*pm2" | bash

print_success "PM2 setup berhasil!"

# Test installation
print_info "Testing installation..."

# Wait for services to start
sleep 5

# Test backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend API berhasil berjalan"
else
    print_error "Backend API tidak dapat diakses"
fi

# Final instructions
echo ""
echo "================================================"
print_success "INSTALASI SELESAI!"
echo "================================================"
echo ""
print_info "Aplikasi telah terinstall di: $INSTALL_DIR"
print_info "Frontend URL: http://$SERVER_IP:3000"
print_info "Backend API: http://$SERVER_IP:5000"
echo ""
print_info "Login default:"
print_info "  Username: admin"
print_info "  Password: admin123456"
echo ""
print_info "Monitoring aplikasi:"
print_info "  pm2 status          - Lihat status aplikasi"
print_info "  pm2 logs            - Lihat logs"
print_info "  pm2 monit           - Monitoring real-time"
print_info "  pm2 restart all     - Restart semua aplikasi"
echo ""
print_warning "PENTING:"
print_warning "1. Ganti password default admin setelah login"
print_warning "2. Edit konfigurasi di backend/.env jika diperlukan"
print_warning "3. Jalankan 'sudo mysql_secure_installation' untuk keamanan MySQL"
print_warning "4. Setup backup database secara berkala"
echo ""
print_success "Sistem Inventaris BKN siap digunakan!"

# Cleanup
cd ~