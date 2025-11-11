import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Services
  services: {
    type: [String],
    default: [],
  },
  customService: {
    type: String,
    trim: true,
  },
  
  // Industries
  industries: {
    type: [String],
    default: [],
  },
  customIndustry: {
    type: String,
    trim: true,
  },
  
  // Timeline
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
  },
  
  // Contact Information
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
  company: {
    type: String,
    trim: true,
  },
  
  // Project Details
  projectDescription: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
  },
  
  // Additional Information
  additionalQuestions: {
    type: String,
    trim: true,
  },
  howDidYouHear: {
    type: String,
    trim: true,
  },
  previousExperience: {
    type: String,
    trim: true,
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'archived'],
    default: 'new',
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;

