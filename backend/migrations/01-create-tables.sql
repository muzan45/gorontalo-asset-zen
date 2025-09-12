-- ================================================
-- SISTEM INVENTARIS BKN - DATABASE MIGRATION
-- File: 01-create-tables.sql
-- Deskripsi: Membuat semua tabel yang diperlukan
-- ================================================

-- Pastikan menggunakan database yang benar
USE inventaris_bkn;

-- ================================================
-- TABLE: users - Tabel pengguna sistem
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'supervisor', 'staff', 'operator') NOT NULL DEFAULT 'staff',
    phone VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- ================================================
-- TABLE: locations - Tabel lokasi/ruangan
-- ================================================
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    building VARCHAR(100) NULL,
    floor VARCHAR(10) NULL,
    room_number VARCHAR(20) NULL,
    capacity INT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_building (building),
    INDEX idx_active (is_active)
);

-- ================================================
-- TABLE: inventory - Tabel inventaris barang
-- ================================================
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('Furniture', 'Electronics', 'Tools', 'Vehicles', 'Books', 'Equipment', 'Others') NOT NULL,
    specification TEXT NULL,
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    serial_number VARCHAR(100) NULL,
    purchase_date DATE NULL,
    purchase_price DECIMAL(15,2) NULL,
    quantity INT NOT NULL DEFAULT 1,
    condition_status ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang') NOT NULL DEFAULT 'Baik',
    location_id INT NULL,
    responsible VARCHAR(255) NULL,
    notes TEXT NULL,
    image_url VARCHAR(500) NULL,
    qr_code VARCHAR(255) NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_condition (condition_status),
    INDEX idx_location (location_id),
    INDEX idx_created_by (created_by),
    INDEX idx_serial (serial_number),
    
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ================================================
-- TABLE: events - Tabel kegiatan/acara
-- ================================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    event_type ENUM('maintenance', 'relocation', 'inspection', 'training', 'meeting', 'other') NOT NULL,
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'planned',
    start_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    location_id INT NULL,
    responsible_person VARCHAR(255) NOT NULL,
    participants INT DEFAULT 0,
    budget DECIMAL(15,2) NULL,
    notes TEXT NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (event_type),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_location (location_id),
    INDEX idx_responsible (responsible_person),
    INDEX idx_created_by (created_by),
    
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ================================================
-- TABLE: event_items - Tabel relasi kegiatan dengan inventaris
-- ================================================
CREATE TABLE IF NOT EXISTS event_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity_used INT NOT NULL DEFAULT 1,
    condition_before ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang') NOT NULL,
    condition_after ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang') NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_event (event_id),
    INDEX idx_inventory (inventory_id),
    UNIQUE KEY unique_event_item (event_id, inventory_id),
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

-- ================================================
-- TABLE: activity_logs - Tabel log aktivitas sistem
-- ================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created (created_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ================================================
-- INSERT DATA AWAL
-- ================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (full_name, username, email, password, role) VALUES 
('Administrator', 'admin', 'admin@bkn.go.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample locations
INSERT INTO locations (name, description, building, floor, room_number) VALUES 
('Ruang Kepala Kantor', 'Ruang kerja kepala kantor', 'Gedung Utama', '2', '201'),
('Ruang Rapat Utama', 'Ruang rapat untuk meeting besar', 'Gedung Utama', '1', '101'),
('Ruang TI', 'Ruang teknologi informasi', 'Gedung Utama', '1', '105'),
('Gudang Umum', 'Gudang penyimpanan barang', 'Gedung Belakang', '1', 'G01');

-- Insert sample inventory categories for better data structure
-- (Data inventaris akan diinput melalui aplikasi)

-- ================================================
-- CREATE VIEWS untuk reporting
-- ================================================

-- View untuk statistik inventaris per lokasi
CREATE VIEW v_inventory_by_location AS
SELECT 
    l.id as location_id,
    l.name as location_name,
    l.building,
    COUNT(i.id) as total_items,
    SUM(CASE WHEN i.condition_status = 'Baik' THEN 1 ELSE 0 END) as good_condition,
    SUM(CASE WHEN i.condition_status = 'Rusak Ringan' THEN 1 ELSE 0 END) as minor_damage,
    SUM(CASE WHEN i.condition_status = 'Rusak Berat' THEN 1 ELSE 0 END) as major_damage,
    SUM(CASE WHEN i.condition_status = 'Hilang' THEN 1 ELSE 0 END) as missing
FROM locations l
LEFT JOIN inventory i ON l.id = i.location_id
WHERE l.is_active = TRUE
GROUP BY l.id, l.name, l.building;

-- View untuk statistik inventaris per kategori
CREATE VIEW v_inventory_by_category AS
SELECT 
    category,
    COUNT(*) as total_items,
    SUM(CASE WHEN condition_status = 'Baik' THEN 1 ELSE 0 END) as good_condition,
    SUM(CASE WHEN condition_status = 'Rusak Ringan' THEN 1 ELSE 0 END) as minor_damage,
    SUM(CASE WHEN condition_status = 'Rusak Berat' THEN 1 ELSE 0 END) as major_damage,
    SUM(CASE WHEN condition_status = 'Hilang' THEN 1 ELSE 0 END) as missing,
    AVG(purchase_price) as avg_price,
    SUM(purchase_price * quantity) as total_value
FROM inventory
GROUP BY category;

-- ================================================
-- STORED PROCEDURES untuk operasi umum
-- ================================================

DELIMITER //

-- Procedure untuk membuat QR Code unik
CREATE PROCEDURE generate_qr_code(IN item_id INT)
BEGIN
    DECLARE qr_text VARCHAR(255);
    SET qr_text = CONCAT('INV-', LPAD(item_id, 6, '0'), '-', YEAR(NOW()));
    UPDATE inventory SET qr_code = qr_text WHERE id = item_id;
END //

-- Procedure untuk log aktivitas otomatis
CREATE PROCEDURE log_activity(
    IN p_user_id INT,
    IN p_action VARCHAR(100),
    IN p_table_name VARCHAR(50),
    IN p_record_id INT,
    IN p_old_values JSON,
    IN p_new_values JSON
)
BEGIN
    INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (p_user_id, p_action, p_table_name, p_record_id, p_old_values, p_new_values);
END //

DELIMITER ;

-- ================================================
-- TRIGGERS untuk audit trail
-- ================================================

DELIMITER //

-- Trigger untuk inventory insert
CREATE TRIGGER tr_inventory_after_insert
AFTER INSERT ON inventory
FOR EACH ROW
BEGIN
    CALL generate_qr_code(NEW.id);
END //

-- Trigger untuk inventory update
CREATE TRIGGER tr_inventory_after_update
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        NEW.created_by, 
        'UPDATE', 
        'inventory', 
        NEW.id,
        JSON_OBJECT('condition', OLD.condition_status, 'location_id', OLD.location_id),
        JSON_OBJECT('condition', NEW.condition_status, 'location_id', NEW.location_id)
    );
END //

DELIMITER ;

-- ================================================
-- GRANTS untuk user aplikasi
-- ================================================

-- Grant permissions untuk user aplikasi
-- (Akan dijalankan setelah user dibuat)

GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.users TO 'inventaris_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.locations TO 'inventaris_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.inventory TO 'inventaris_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.events TO 'inventaris_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.event_items TO 'inventaris_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaris_bkn.activity_logs TO 'inventaris_user'@'localhost';

-- Grant akses ke views
GRANT SELECT ON inventaris_bkn.v_inventory_by_location TO 'inventaris_user'@'localhost';
GRANT SELECT ON inventaris_bkn.v_inventory_by_category TO 'inventaris_user'@'localhost';

-- Grant execute untuk stored procedures
GRANT EXECUTE ON PROCEDURE inventaris_bkn.generate_qr_code TO 'inventaris_user'@'localhost';
GRANT EXECUTE ON PROCEDURE inventaris_bkn.log_activity TO 'inventaris_user'@'localhost';

-- ================================================
-- OPTIMIZE tables
-- ================================================
OPTIMIZE TABLE users, locations, inventory, events, event_items, activity_logs;

-- ================================================
-- SELESAI - Database siap digunakan!
-- ================================================