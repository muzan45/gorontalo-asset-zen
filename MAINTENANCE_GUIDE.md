# 🔧 Panduan Maintenance - Sistem Inventaris BKN

## 📊 Monitoring Harian

### 1. Status Aplikasi
```bash
# Check PM2 status
pm2 status

# Check logs untuk error
pm2 logs --lines 100

# Memory usage
pm2 monit

# System resources
htop
df -h
```

### 2. Database Health Check
```bash
# MySQL status
sudo systemctl status mysql

# Database connection test
mysql -u inventaris_user -p -e "SELECT COUNT(*) FROM inventaris_bkn.inventory;"

# Check database size
mysql -u inventaris_user -p -e "
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'inventaris_bkn'
GROUP BY table_schema;"
```

### 3. Performance Monitoring
```bash
# API response test
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:5000/api/health"

# Disk space check
df -h /var/www/inventaris-bkn
df -h /var/log

# Network connectivity
ping -c 4 8.8.8.8
```

---

## 🗂️ Backup Strategies

### 1. Database Backup Otomatis

#### Setup Cron Job:
```bash
# Edit crontab
crontab -e

# Add backup job (daily at 2 AM)
0 2 * * * /usr/local/bin/backup-inventaris.sh >/dev/null 2>&1
```

#### Backup Script (`/usr/local/bin/backup-inventaris.sh`):
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/inventaris"
DB_NAME="inventaris_bkn"
DB_USER="inventaris_user"
DB_PASS="your_password"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Timestamp
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Files backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz -C /var/www/inventaris-bkn backend/uploads

# Application backup (weekly)
if [ $(date +%u) -eq 1 ]; then
    tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www inventaris-bkn --exclude=node_modules --exclude=logs
fi

# Cleanup old backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

# Log backup status
echo "$(date): Backup completed successfully" >> /var/log/inventaris-backup.log
```

#### Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-inventaris.sh
```

### 2. Manual Backup Commands
```bash
# Quick database backup
mysqldump -u inventaris_user -p inventaris_bkn > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u inventaris_user -p inventaris_bkn < backup_20240101.sql

# Backup uploads folder
tar -czf uploads_$(date +%Y%m%d).tar.gz backend/uploads/

# Full application backup
tar --exclude='node_modules' --exclude='logs' -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/inventaris-bkn/
```

---

## 🔄 Update Process

### 1. Minor Updates (Bug fixes, small features)
```bash
cd /var/www/inventaris-bkn

# Backup current version
git tag "backup-$(date +%Y%m%d)"

# Pull updates
git pull origin main

# Update backend dependencies
cd backend
npm install

# Update frontend dependencies
cd ..
npm install

# Rebuild frontend
npm run build

# Restart applications
pm2 restart all

# Verify
curl http://localhost:5000/api/health
```

### 2. Major Updates (Database changes)
```bash
# 1. Create full backup first
./backup-inventaris.sh

# 2. Put application in maintenance mode
pm2 stop all

# 3. Update code
git pull origin main

# 4. Run migrations if any
cd backend
mysql -u inventaris_user -p inventaris_bkn < migrations/new_migration.sql

# 5. Update dependencies
npm install
cd .. && npm install

# 6. Rebuild
npm run build

# 7. Start applications
pm2 start all

# 8. Test thoroughly
```

---

## 🚨 Troubleshooting Common Issues

### 1. Application Won't Start

#### Check PM2 Status:
```bash
pm2 status
pm2 logs --error --lines 50
```

#### Common Solutions:
```bash
# Restart PM2
pm2 restart all

# Reload PM2 config
pm2 reload ecosystem.config.js

# Kill and restart
pm2 kill
pm2 start ecosystem.config.js
```

### 2. Database Connection Issues

#### Check MySQL:
```bash
sudo systemctl status mysql
sudo systemctl restart mysql

# Check connection
mysql -u inventaris_user -p -h localhost
```

#### Fix Permissions:
```bash
mysql -u root -p
GRANT ALL PRIVILEGES ON inventaris_bkn.* TO 'inventaris_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. High Memory Usage

#### Check Process:
```bash
pm2 monit
top -u $USER

# Restart if needed
pm2 restart inventaris-bkn-backend --force
```

#### Optimize MySQL:
```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add optimizations
[mysqld]
innodb_buffer_pool_size=128M
max_connections=50
query_cache_size=16M

# Restart MySQL
sudo systemctl restart mysql
```

### 4. Disk Space Issues

#### Clean Logs:
```bash
# Rotate PM2 logs
pm2 flush

# Clean old logs
find backend/logs -name "*.log" -mtime +7 -delete

# Clean system logs
sudo journalctl --rotate
sudo journalctl --vacuum-time=7d
```

#### Clean Uploads:
```bash
# Find large files
find backend/uploads -size +10M -ls

# Clean temp files
find backend/uploads -name "tmp_*" -mtime +1 -delete
```

---

## 📈 Performance Optimization

### 1. Database Optimization

#### Regular Maintenance:
```bash
# Run monthly
mysql -u inventaris_user -p -e "
USE inventaris_bkn;
OPTIMIZE TABLE inventory;
OPTIMIZE TABLE events;
OPTIMIZE TABLE locations;
OPTIMIZE TABLE users;
ANALYZE TABLE inventory;
ANALYZE TABLE events;
ANALYZE TABLE locations;
ANALYZE TABLE users;
"
```

#### Index Monitoring:
```bash
# Check slow queries
mysql -u inventaris_user -p -e "
SHOW GLOBAL STATUS LIKE 'Slow_queries';
SHOW PROCESSLIST;
"
```

### 2. Application Optimization

#### PM2 Cluster Mode:
```bash
# Update ecosystem.config.js
module.exports = {
  apps: [{
    name: 'inventaris-bkn-backend',
    script: 'server.js',
    instances: 'max', # Use all CPU cores
    exec_mode: 'cluster'
  }]
};

pm2 reload ecosystem.config.js
```

#### Static File Caching:
```bash
# Configure nginx (if used)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔒 Security Maintenance

### 1. Regular Updates
```bash
# System updates
sudo apt update && sudo apt upgrade

# Node.js security updates
npm audit
npm audit fix

# MySQL security
mysql_secure_installation
```

### 2. Log Monitoring
```bash
# Check authentication attempts
grep "Failed password" /var/log/auth.log

# Monitor API access
tail -f backend/logs/combined.log | grep "401\|403\|429"

# Check unusual activity
grep -E "(admin|root)" backend/logs/combined.log
```

### 3. Backup Verification
```bash
# Monthly backup test
mysqldump -u inventaris_user -p inventaris_bkn > test_restore.sql
mysql -u inventaris_user -p inventaris_bkn_test < test_restore.sql

# Verify data integrity
mysql -u inventaris_user -p -e "
SELECT COUNT(*) FROM inventaris_bkn.inventory;
SELECT COUNT(*) FROM inventaris_bkn_test.inventory;
"
```

---

## 📋 Maintenance Checklist

### Daily:
- [ ] Check PM2 status
- [ ] Verify application accessibility
- [ ] Check error logs
- [ ] Monitor disk space

### Weekly:
- [ ] Verify backups
- [ ] Check database performance
- [ ] Review user activity logs
- [ ] Update documentation

### Monthly:
- [ ] System security updates
- [ ] Database optimization
- [ ] Backup restoration test
- [ ] Performance analysis
- [ ] Clean old logs and files

### Quarterly:
- [ ] Major security review
- [ ] Capacity planning
- [ ] Disaster recovery test
- [ ] User access audit

---

## 📞 Emergency Contacts

### Quick Recovery Commands:
```bash
# Emergency restart
sudo systemctl restart mysql
pm2 restart all

# Restore from backup
mysql -u inventaris_user -p inventaris_bkn < /var/backups/inventaris/latest_backup.sql

# Reset to stable version
git checkout stable-branch
pm2 restart all
```

### Support Information:
- **System Admin**: [Your Contact]
- **Database Admin**: [Your Contact]
- **Developer**: [Your Contact]
- **Emergency Hotline**: [Your Number]