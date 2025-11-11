import Project from '../models/Project.js';
import { sendProjectEmail, sendLeadEmail } from '../services/emailService.js';

// @desc    Create a new project inquiry
// @route   POST /api/project
// @access  Public
export const createProject = async (req, res) => {
  try {
    const {
      services,
      customService,
      industries,
      customIndustry,
      timeline,
      name,
      email,
      phone,
      company,
      projectDescription,
      additionalQuestions,
      howDidYouHear,
      previousExperience,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !timeline || !projectDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, timeline, and project description',
      });
    }

    if ((!services || services.length === 0) && !customService) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one service or provide a custom service',
      });
    }

    const project = await Project.create({
      services: services || [],
      customService,
      industries: industries || [],
      customIndustry,
      timeline,
      name,
      email,
      phone,
      company,
      projectDescription,
      additionalQuestions,
      howDidYouHear,
      previousExperience,
    });

    // Send email notification (non-blocking)
    sendProjectEmail({
      name,
      email,
      phone,
      company,
      services: services || [],
      customService,
      industries: industries || [],
      customIndustry,
      timeline,
      projectDescription,
      additionalQuestions,
      howDidYouHear,
      previousExperience,
    }).catch(err => {
      console.error('Failed to send project email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Project inquiry submitted successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Get all project inquiries
// @route   GET /api/project
// @access  Public (you may want to add authentication later)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Update project inquiry status and description
// @route   PUT /api/project/:id
// @access  Public (you may want to add authentication later)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project inquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project inquiry updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error updating project inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Send email to admin about a project lead
// @route   POST /api/project/:id/send-email
// @access  Public (you may want to add authentication later)
export const sendProjectLeadEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project inquiry not found',
      });
    }

    await sendLeadEmail(project.toObject(), 'project');

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

