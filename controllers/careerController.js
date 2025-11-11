import Career from '../models/Career.js';
import { sendCareerEmail, sendLeadEmail } from '../services/emailService.js';

// @desc    Create a new career application
// @route   POST /api/career
// @access  Public
export const createCareer = async (req, res) => {
  try {
    const { name, email, phone, position, experience, message } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and message',
      });
    }

    // Handle file upload
    let resumePath = null;
    let resumeFileName = null;
    if (req.file) {
      resumePath = req.file.path;
      resumeFileName = req.file.filename;
    }

    const career = await Career.create({
      name,
      email,
      phone,
      position,
      experience,
      message,
      resumePath,
      resumeFileName,
    });

    // Send email notification (non-blocking)
    sendCareerEmail({
      name,
      email,
      phone,
      position,
      experience,
      message,
      resumeFileName,
    }, resumePath).catch(err => {
      console.error('Failed to send career email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Career application submitted successfully',
      data: career,
    });
  } catch (error) {
    console.error('Error creating career application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Get all career applications
// @route   GET /api/career
// @access  Public (you may want to add authentication later)
export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers,
    });
  } catch (error) {
    console.error('Error fetching career applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Update career application status and description
// @route   PUT /api/career/:id
// @access  Public (you may want to add authentication later)
export const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const career = await Career.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career application updated successfully',
      data: career,
    });
  } catch (error) {
    console.error('Error updating career application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Send email to admin about a career lead
// @route   POST /api/career/:id/send-email
// @access  Public (you may want to add authentication later)
export const sendCareerLeadEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career application not found',
      });
    }

    await sendLeadEmail(career.toObject(), 'career');

    res.status(200).json({
      success: true,
      message: 'Email sent successfully to admin',
    });
  } catch (error) {
    console.error('Error sending lead email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: error.message,
    });
  }
};

