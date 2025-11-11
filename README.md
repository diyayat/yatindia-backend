# YAT India Backend API

Backend API server for handling form submissions from the YAT India website.

## Features

- **Contact Form API**: Handle callback requests
- **Project Inquiry API**: Handle multi-step project inquiry submissions
- **Career Application API**: Handle job application submissions
- **MongoDB Integration**: Store all form submissions in MongoDB
- **RESTful API**: Clean and organized API structure

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/yatindia
FRONTEND_URL=http://localhost:3000
```

For MongoDB Atlas (cloud), use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yatindia?retryWrites=true&w=majority
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the API is running

### Contact Form
- **POST** `/api/contact` - Submit a callback request
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890"
  }
  ```
- **GET** `/api/contact` - Get all contact requests

### Project Inquiry
- **POST** `/api/project` - Submit a project inquiry
  ```json
  {
    "services": ["Website - Static & Dynamic", "Mobile App"],
    "customService": "",
    "industries": ["Healthcare", "Fintech"],
    "customIndustry": "",
    "timeline": "3-4",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890",
    "company": "Example Corp",
    "projectDescription": "I need a mobile app for my business...",
    "additionalQuestions": "Any questions?",
    "howDidYouHear": "google",
    "previousExperience": "Worked with other companies before"
  }
  ```
- **GET** `/api/project` - Get all project inquiries

### Career Application
- **POST** `/api/career` - Submit a career application
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 1234567890",
    "position": "Software Developer",
    "experience": "3-5",
    "message": "I'm interested in joining your team..."
  }
  ```
- **GET** `/api/career` - Get all career applications

## Project Structure

```
yatindia-backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── contactController.js # Contact form logic
│   ├── projectController.js # Project inquiry logic
│   └── careerController.js  # Career application logic
├── models/
│   ├── Contact.js           # Contact model
│   ├── Project.js           # Project model
│   └── Career.js            # Career model
├── routes/
│   ├── contactRoutes.js     # Contact routes
│   ├── projectRoutes.js     # Project routes
│   └── careerRoutes.js      # Career routes
├── server.js                # Main server file
├── package.json
└── README.md
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `CLOUDFLARE_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key (for frontend)
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key (for backend verification)
- `ZOHO_SMTP_USER` - Zoho SMTP username (your Zoho email)
- `ZOHO_SMTP_PASS` - Zoho SMTP password (app password)
- `ZOHO_SMTP_HOST` - Zoho SMTP host (default: smtp.zoho.com)
- `ZOHO_SMTP_PORT` - Zoho SMTP port (default: 587)
- `ZEPTOMAIL_TO_EMAIL` - Email address to receive notifications (default: info@yatindia.com)
- `LOGO_URL` - URL for logo image in emails (optional)

## Frontend Integration

The frontend is already configured to connect to this backend. Make sure to:

1. Set the `NEXT_PUBLIC_API_URL` environment variable in your frontend `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. Set the `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` for CAPTCHA:
   ```env
   NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key_here
   ```

3. For production, update it to your production backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_production_site_key
   ```

The frontend forms will automatically connect to the backend API endpoints.

## Cloudflare Turnstile Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** section
3. Create a new site/widget
4. Copy the **Site Key** and **Secret Key**
5. Add them to your `.env` file:
   - Backend: `CLOUDFLARE_TURNSTILE_SECRET_KEY`
   - Frontend: `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`

**Note:** Cloudflare Turnstile is completely free and privacy-focused!

## Email Setup (Zoho SMTP)

1. Configure Zoho SMTP credentials in your `.env` file:
   ```env
   ZOHO_SMTP_USER=your-zoho-email@yourdomain.com
   ZOHO_SMTP_PASS=your-zoho-app-password
   ZOHO_SMTP_HOST=smtp.zoho.com
   ZOHO_SMTP_PORT=587
   ZEPTOMAIL_TO_EMAIL=info@yatindia.com
   LOGO_URL=https://res.cloudinary.com/dyjdyw646/image/upload/v1724252413/logo_bg_white_kp2jx9.png
   ```

2. **Getting Zoho App Password:**
   - Log in to your Zoho account
   - Go to **Security** → **App Passwords**
   - Generate a new app password for "Mail"
   - Use this password as `ZOHO_SMTP_PASS`

3. **Note:** 
   - The `from` email address must be a verified email in your Zoho account
   - Emails are sent automatically when forms are submitted successfully
   - Email failures won't break form submissions

## File Uploads

- Resume files are stored in the `resumes/` directory
- Files are named: `candidateName_YYYY-MM-DD_HH-MM-SS.extension`
- Supported formats: PDF, JPEG, JPG, PNG, GIF
- Maximum file size: 10MB
- The `resumes/` folder is automatically created on server start

## Notes

- All timestamps are automatically added by MongoDB
- All form submissions include validation and CAPTCHA verification
- Email notifications are sent automatically via ZeptoMail on successful form submissions
- CORS is configured to allow requests from the frontend
- Error handling is implemented for all endpoints
- The API uses ES6 modules (type: "module" in package.json)
- CAPTCHA verification is required for all form submissions
- Email sending is non-blocking - failures won't prevent form submissions

