import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@yatindia.com';
    const password = process.argv[4] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingAdmin) {
      console.log('Admin already exists with this username or email');
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
    });

    console.log('Admin created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

