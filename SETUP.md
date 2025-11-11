# Backend Setup Instructions

## Quick Start

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Create/Update `.env` file** with required variables:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Email (ZeptoMail)
ZEPTOMAIL_API_KEY=your_zeptomail_api_key
ZEPTOMAIL_FROM_EMAIL=your_email@domain.com
ZEPTOMAIL_TO_EMAIL=diya.p.shiju@gmail.com

# Server
PORT=4173
```

3. **Create default admin user**:
```bash
node scripts/createAdmin.js admin admin@yatindia.com password
```

4. **Start the server**:
```bash
npm run dev
# or for production
npm start
```

The server will run on `http://localhost:4173`

## Verify Setup

Test the health endpoint:
```bash
curl http://localhost:4173/api/health
```

Test login:
```bash
curl -X POST http://localhost:4173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@yatindia.com","password":"password"}'
```

## Default Admin Credentials

- **Email/Username**: `admin@yatindia.com`
- **Password**: `password`

## Routes

### Public Routes (No Authentication)
- `POST /api/contact` - Submit contact form
- `POST /api/career` - Submit career application
- `POST /api/project` - Submit project inquiry

### Protected Routes (Require Authentication)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current admin
- `GET /api/contact` - Get all contacts
- `GET /api/career` - Get all careers
- `GET /api/project` - Get all projects
- `PUT /api/contact/:id` - Update contact
- `PUT /api/career/:id` - Update career
- `PUT /api/project/:id` - Update project
- All email sending routes
- Resume file serving

