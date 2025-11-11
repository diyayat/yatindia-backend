import Contact from '../models/Contact.js';
import { sendContactEmail, sendLeadEmail } from '../services/emailService.js';

// @desc    Create a new contact callback request
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and phone',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
    });

    // Send email notification (non-blocking)
    sendContactEmail({ name, email, phone }).catch(err => {
      console.error('Failed to send contact email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Callback request submitted successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Get all contact requests
// @route   GET /api/contact
// @access  Public (you may want to add authentication later)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Update contact request status and description
// @route   PUT /api/contact/:id
// @access  Public (you may want to add authentication later)
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact request updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

// @desc    Send email to admin about a contact lead
// @route   POST /api/contact/:id/send-email
// @access  Public (you may want to add authentication later)
export const sendContactLeadEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found',
      });
    }

    await sendLeadEmail(contact.toObject(), 'contact');

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

