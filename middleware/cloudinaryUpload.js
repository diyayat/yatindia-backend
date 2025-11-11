import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

// Configure multer storage based on Cloudinary availability
let storage;
if (useCloudinary) {
  // Use memory storage for Cloudinary uploads
  storage = multer.memoryStorage();
} else {
  // Use disk storage for local file storage
  const resumeDir = path.join(__dirname, '../resumes');
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resumeDir);
    },
    filename: (req, file, cb) => {
      const candidateName = req.body.name
        ? req.body.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        : 'candidate';
      const date = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const ext = path.extname(file.originalname);
      const filename = `${candidateName}_${date}_${time}${ext}`;
      cb(null, filename);
    },
  });
}

// File filter - only allow PDF and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and image files (JPEG, JPG, PNG, GIF) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Middleware to upload file to Cloudinary after multer processes it
 * Falls back to local storage if Cloudinary is not configured
 */
export const uploadToCloudinaryMiddleware = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('Cloudinary not configured, using local storage');
    // Fall back to local storage - multer will handle it
    return next();
  }

  try {
    // Determine resource type based on file mimetype
    const isPDF = req.file.mimetype === 'application/pdf';
    const resourceType = isPDF ? 'raw' : 'image';

    // Determine folder based on file type
    const folder = isPDF ? 'yatindia/resumes' : 'yatindia/images';

    // Upload to Cloudinary
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      folder,
      resourceType
    );

    // Attach Cloudinary info to request
    req.cloudinaryResult = {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
    };

    console.log('✅ File uploaded to Cloudinary:', result.secure_url);
    next();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Don't fail the request - fall back to local storage
    console.log('Falling back to local storage');
    return next();
  }
};

export default upload;

