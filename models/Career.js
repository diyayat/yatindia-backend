import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  resumePath: {
    type: String,
    trim: true,
  },
  resumeFileName: {
    type: String,
    trim: true,
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'new',
  },
}, {
  timestamps: true,
});

const Career = mongoose.model('Career', careerSchema);

export default Career;

