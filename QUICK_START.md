# Quick Start Guide

## Start the Backend Server

1. **Navigate to backend directory**:
```bash
cd yatindia-backend
```

2. **Start the server**:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The server will start on `http://localhost:4173`

## Verify It's Working

Open a new terminal and test:
```bash
curl http://localhost:4173/api/health
```

You should see:
```json
{
  "success": true,
  "message": "YAT India Backend API is running",
  "timestamp": "..."
}
```

## Login Credentials

- **Email/Username**: `admin@yatindia.com`
- **Password**: `password`

## Troubleshooting

If you get "Route not found" errors:
1. Make sure the backend server is running
2. Check that it's running on port 4173
3. Restart the server if you just added new routes

