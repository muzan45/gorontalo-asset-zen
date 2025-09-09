# Inventaris Sarana dan Prasarana Digital - Backend API

Backend API untuk Sistem Inventaris Sarana dan Prasarana Digital UPT BKN Gorontalo.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi & Express-Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS

## 📋 Prerequisites

- Node.js (>= 16.0.0)
- MySQL (>= 8.0)
- npm or yarn

## 🛠️ Installation

1. Clone the repository and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inventaris_bkn
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
```

5. Create MySQL database:
```sql
CREATE DATABASE inventaris_bkn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Run database migrations (auto-sync on first run):
```bash
npm run dev
```

## 🚦 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Run Tests
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff",
  "phone": "081234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Inventory Endpoints

#### Get All Inventory
```http
GET /api/inventory?page=1&limit=10&search=laptop&category=Electronics
Authorization: Bearer {token}
```

#### Get Single Inventory Item
```http
GET /api/inventory/{id}
Authorization: Bearer {token}
```

#### Create Inventory Item
```http
POST /api/inventory
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop Dell Inspiron",
  "category": "Electronics",
  "specification": "Intel i5, 8GB RAM, 256GB SSD",
  "brand": "Dell",
  "model": "Inspiron 15",
  "quantity": 5,
  "condition": "Baik",
  "acquisitionDate": "2024-01-15",
  "acquisitionValue": 8500000,
  "responsible": "IT Department",
  "locationId": 1
}
```

#### Update Inventory Item
```http
PUT /api/inventory/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "condition": "Rusak Ringan",
  "quantity": 4
}
```

#### Delete Inventory Item
```http
DELETE /api/inventory/{id}
Authorization: Bearer {token}
```

### Event (Kegiatan) Endpoints

#### Get All Events
```http
GET /api/events?page=1&limit=10&type=ujian&status=active
Authorization: Bearer {token}
```

#### Create Event
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Ujian CAT CPNS 2024",
  "type": "ujian",
  "description": "Computer Assisted Test untuk CPNS",
  "startDate": "2024-03-15T08:00:00Z",
  "endDate": "2024-03-17T17:00:00Z",
  "participants": 150,
  "responsible": "Dr. Ahmad Ridwan",
  "locationId": 1
}
```

#### Assign Inventory to Event
```http
POST /api/events/{id}/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "inventoryId": 1,
  "quantityUsed": 50,
  "conditionBefore": "Baik",
  "notes": "Laptop untuk peserta ujian"
}
```

#### Update Item Condition After Event
```http
PUT /api/events/{id}/items/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "conditionAfter": "Baik",
  "returnedDate": "2024-03-17T17:00:00Z",
  "notes": "Dikembalikan dalam kondisi baik"
}
```

### Location Endpoints

#### Get All Locations
```http
GET /api/locations?page=1&limit=10
Authorization: Bearer {token}
```

#### Create Location
```http
POST /api/locations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Lab Komputer 1",
  "description": "Laboratorium komputer lantai 2",
  "building": "Gedung A",
  "floor": "2",
  "roomNumber": "A201",
  "capacity": 50
}
```

### Report Endpoints

#### Get Inventory Report
```http
GET /api/reports/inventory?startDate=2024-01-01&endDate=2024-12-31&category=Electronics
Authorization: Bearer {token}
```

#### Get Events Report
```http
GET /api/reports/events?startDate=2024-01-01&endDate=2024-12-31&type=ujian
Authorization: Bearer {token}
```

#### Export Inventory Report (PDF)
```http
GET /api/reports/inventory/export/pdf?category=Electronics
Authorization: Bearer {token}
```

#### Export Inventory Report (Excel)
```http
GET /api/reports/inventory/export/excel?category=Electronics
Authorization: Bearer {token}
```

#### Export Events Report (PDF)
```http
GET /api/reports/events/export/pdf?type=ujian
Authorization: Bearer {token}
```

#### Export Events Report (Excel)
```http
GET /api/reports/events/export/excel?type=ujian
Authorization: Bear  {token}
```

### Backup & Restore

#### Create Database Backup
```http
POST /api/backup
Authorization: Bearer {admin_token}
```

#### Restore Database
```http
POST /api/restore
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "fileName": "inventaris_bkn_backup_2024-03-01.sql"
}
```

## 🔐 Security Features

- JWT Authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 👥 User Roles

- **Admin**: Full access to all features
- **Supervisor**: Can manage inventory and events
- **Staff**: Can view and create basic records
- **Operator**: Limited access for data entry

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── index.js            # Model associations
│   ├── User.js             # User model
│   ├── Inventory.js        # Inventory model
│   ├── Location.js         # Location model
│   ├── Event.js            # Event model
│   └── EventItem.js        # Event-Inventory relation
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── inventory.js        # Inventory routes
│   ├── kegiatan.js         # Event routes
│   ├── location.js         # Location routes
│   └── report.js           # Report and export routes
├── uploads/                # File uploads directory
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── server.js              # Main application file
└── README.md              # This file
```

## 🐛 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors array (if applicable)
}
```

## 📝 Logging

Application logs include:
- API requests (Morgan)
- Database queries (Sequelize)
- Error tracking
- Authentication attempts

## 🚀 Deployment

1. Set production environment variables
2. Install production dependencies: `npm ci --production`
3. Start the server: `npm start`
4. Use PM2 for process management: `pm2 start server.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email admin@bkn-gorontalo.go.id or contact the IT Department.