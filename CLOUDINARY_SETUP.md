# Cloudinary Setup Guide

Cloudinary is now integrated for storing PDFs (resumes) and images. This provides better scalability and reliability compared to local file storage.

## Setup Instructions

### 1. Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. Go to your Dashboard
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Add Environment Variables

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Cloudinary Logo URL (if you upload logo to Cloudinary)
CLOUDINARY_LOGO_URL=https://res.cloudinary.com/your_cloud_name/image/upload/v1/yatindia/logo.png
```

### 3. Upload Logo to Cloudinary (Optional)

If you want to use Cloudinary for the logo in emails:

1. Upload `YAT INDIA LOGO UPDATED.png` to Cloudinary
2. Copy the secure URL
3. Set `CLOUDINARY_LOGO_URL` in your `.env` file

Or set `LOGO_URL` directly:
```env
LOGO_URL=https://res.cloudinary.com/your_cloud_name/image/upload/v1/yatindia/logo.png
```

## How It Works

### Resume Uploads (PDFs)
- When a career application is submitted with a resume:
  1. File is uploaded to Cloudinary in the `yatindia/resumes` folder
  2. Cloudinary URL is stored in `resumeUrl` field
  3. Public ID is stored in `resumePublicId` for future deletion if needed
  4. Original filename is stored in `resumeFileName`

### Images
- Images can be uploaded to Cloudinary in the `yatindia/images` folder
- Use the same upload middleware for any image uploads

### Fallback Behavior
- If Cloudinary credentials are not configured, the system falls back to local file storage
- Existing local files continue to work
- New uploads will use Cloudinary if configured

## Benefits

1. **Scalability**: No server storage limits
2. **CDN**: Fast global delivery
3. **Reliability**: Cloudinary handles backups and redundancy
4. **Direct Access**: Resume URLs can be accessed directly without backend server
5. **Image Optimization**: Cloudinary can optimize images automatically

## File Structure in Cloudinary

```
yatindia/
  ├── resumes/
  │   ├── candidate_name_2024-01-15_10-30-00.pdf
  │   └── ...
  └── images/
      └── ...
```

## API Changes

### Career Model
- Added `resumeUrl` field (Cloudinary URL)
- Added `resumePublicId` field (for deletion)
- `resumePath` still exists for backward compatibility

### Admin Dashboard
- Resume links now use `resumeUrl` if available
- Falls back to local file route if `resumeUrl` is not present

## Testing

1. Submit a career application with a resume
2. Check the database - you should see `resumeUrl` populated
3. In admin dashboard, click "View Resume" - it should open the Cloudinary URL
4. Verify the PDF opens correctly

## Troubleshooting

### Files not uploading to Cloudinary
- Check that all three Cloudinary environment variables are set
- Verify credentials are correct
- Check Cloudinary dashboard for upload errors

### Logo not showing in emails
- Set `CLOUDINARY_LOGO_URL` or `LOGO_URL` environment variable
- Ensure the URL is publicly accessible
- Test the URL in a browser

### Resume links not working
- Check that `resumeUrl` is populated in the database
- Verify the Cloudinary URL is accessible
- Check browser console for CORS errors (shouldn't happen with Cloudinary)

