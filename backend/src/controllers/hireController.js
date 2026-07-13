const Hire = require('../models/hire');
const validator = require('email-validator');

// Create a new inquiry (Public)
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, company, message, budget } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const newInquiry = await Hire.create({
      name,
      email,
      company: company || null,
      message,
      budget: budget || null,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
    });
  } catch (error) {
    console.error('Error submitting hire inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Get all inquiries (Admin)
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Hire.find().select('-__v -updatedAt').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update inquiry status (Admin)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const updatedInquiry = await Hire.findByIdAndUpdate(
      id,
      { isRead },
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated.',
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Delete an inquiry (Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedInquiry = await Hire.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
