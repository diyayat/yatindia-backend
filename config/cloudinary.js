import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @param {string} resourceType - 'image', 'raw' (for PDFs), or 'auto'
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'yatindia', resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload file buffer to Cloudinary (for multer memory storage)
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @param {string} resourceType - 'image', 'raw' (for PDFs), or 'auto'
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadBufferToCloudinary = async (buffer, originalName, folder = 'yatindia', resourceType = 'auto') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
          public_id: originalName.replace(/\.[^/.]+$/, ''), // Remove extension
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error uploading buffer to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file in Cloudinary
 * @param {string} resourceType - 'image', 'raw', or 'auto'
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;

