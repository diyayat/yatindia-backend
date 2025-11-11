import { uploadToCloudinary } from '../config/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to upload YAT INDIA LOGO UPDATED.png to Cloudinary
 * Run with: node scripts/uploadLogo.js
 */
async function uploadLogo() {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials not found in environment variables.');
      console.error('Please add the following to your .env file:');
      console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
      console.error('  CLOUDINARY_API_KEY=your_api_key');
      console.error('  CLOUDINARY_API_SECRET=your_api_secret');
      process.exit(1);
    }

    // Path to the logo file
    const logoPath = path.join(__dirname, '../public/YAT INDIA LOGO UPDATED.png');

    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      console.error(`❌ Logo file not found at: ${logoPath}`);
      console.error('Please make sure the file exists in the public folder.');
      process.exit(1);
    }

    console.log('📤 Uploading logo to Cloudinary...');
    console.log(`   File: ${logoPath}`);

    // Upload to Cloudinary in the yatindia/images folder
    const result = await uploadToCloudinary(
      logoPath,
      'yatindia/images',
      'image'
    );

    console.log('\n✅ Logo uploaded successfully!');
    console.log('\n📋 Add this to your .env file:');
    console.log(`   CLOUDINARY_LOGO_URL=${result.secure_url}`);
    console.log('\nOr use:');
    console.log(`   LOGO_URL=${result.secure_url}`);
    console.log('\n📊 Upload Details:');
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   Format: ${result.format}`);
    console.log(`   Size: ${(result.bytes / 1024).toFixed(2)} KB`);
    console.log(`   Width: ${result.width}px`);
    console.log(`   Height: ${result.height}px`);
    console.log(`   URL: ${result.secure_url}`);

  } catch (error) {
    console.error('❌ Error uploading logo:', error.message);
    if (error.http_code) {
      console.error(`   HTTP Code: ${error.http_code}`);
    }
    process.exit(1);
  }
}

// Run the script
uploadLogo();

