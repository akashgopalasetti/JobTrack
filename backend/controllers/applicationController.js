import mongoose from 'mongoose';
import Application, { STATUS_ENUM } from '../models/Application.js';
import { checkDatabaseStatus } from '../config/db.js';

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
export const getHealth = (req, res) => {
  const isDbConnected = checkDatabaseStatus();
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'JobTrack API server is healthy and running',
    database: {
      connected: isDbConnected,
      status: isDbConnected ? 'Connected to MongoDB Atlas' : 'Disconnected / Connecting'
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Public
export const getAllApplications = async (req, res, next) => {
  try {
    if (!checkDatabaseStatus()) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: 'Database connection is not ready. Please verify MONGODB_URI in backend/.env.'
      });
    }

    const { status, search, sort = 'desc' } = req.query;
    let query = {};

    // Filter by status if specified
    if (status && status !== 'All') {
      if (STATUS_ENUM.includes(status)) {
        query.status = status;
      }
    }

    // Search by companyName or jobTitle if specified
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { jobTitle: searchRegex }
      ];
    }

    // Sort order: default appliedDate descending (newest first)
    const sortOrder = sort === 'asc' ? 1 : -1;
    const applications = await Application.find(query).sort({
      appliedDate: sortOrder,
      createdAt: sortOrder
    });

    res.status(200).json({
      success: true,
      status: 200,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Public
export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid ID format: '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }

    if (!checkDatabaseStatus()) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: 'Database connection is not ready. Please verify MONGODB_URI in backend/.env.'
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: `Job application with ID '${id}' not found.`
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new application
// @route   POST /api/applications
// @access  Public
export const createApplication = async (req, res, next) => {
  try {
    if (!checkDatabaseStatus()) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: 'Database connection is not ready. Please verify MONGODB_URI in backend/.env.'
      });
    }

    const {
      companyName,
      jobTitle,
      status = 'Applied',
      location,
      appliedDate,
      jobPostingUrl,
      resumeName,
      resumeLink,
      appliedEmail,
      recruiterName,
      followUpDate,
      notes
    } = req.body;

    // Validate required fields
    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Company Name is required.'
      });
    }

    if (!jobTitle || jobTitle.trim() === '') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Job Title is required.'
      });
    }

    if (status && !STATUS_ENUM.includes(status)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid status: '${status}'. Allowed statuses: ${STATUS_ENUM.join(', ')}`
      });
    }

    const application = await Application.create({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      status: status || 'Applied',
      location: location ? location.trim() : '',
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      jobPostingUrl: jobPostingUrl ? jobPostingUrl.trim() : '',
      resumeName: resumeName ? resumeName.trim() : '',
      resumeLink: resumeLink ? resumeLink.trim() : '',
      appliedEmail: appliedEmail ? appliedEmail.trim() : '',
      recruiterName: recruiterName ? recruiterName.trim() : '',
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Job application created successfully.',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing application
// @route   PUT /api/applications/:id
// @access  Public
export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid ID format: '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }

    if (!checkDatabaseStatus()) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: 'Database connection is not ready. Please verify MONGODB_URI in backend/.env.'
      });
    }

    const {
      companyName,
      jobTitle,
      status,
      location,
      appliedDate,
      jobPostingUrl,
      resumeName,
      resumeLink,
      appliedEmail,
      recruiterName,
      followUpDate,
      notes
    } = req.body;

    // Check required fields if present in update payload
    if (companyName !== undefined && companyName.trim() === '') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Company Name cannot be empty.'
      });
    }

    if (jobTitle !== undefined && jobTitle.trim() === '') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Job Title cannot be empty.'
      });
    }

    if (status && !STATUS_ENUM.includes(status)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid status: '${status}'. Allowed statuses: ${STATUS_ENUM.join(', ')}`
      });
    }

    const updatePayload = {
      ...(companyName !== undefined && { companyName: companyName.trim() }),
      ...(jobTitle !== undefined && { jobTitle: jobTitle.trim() }),
      ...(status !== undefined && { status }),
      ...(location !== undefined && { location: location.trim() }),
      ...(appliedDate !== undefined && { appliedDate: appliedDate ? new Date(appliedDate) : null }),
      ...(jobPostingUrl !== undefined && { jobPostingUrl: jobPostingUrl.trim() }),
      ...(resumeName !== undefined && { resumeName: resumeName.trim() }),
      ...(resumeLink !== undefined && { resumeLink: resumeLink.trim() }),
      ...(appliedEmail !== undefined && { appliedEmail: appliedEmail.trim() }),
      ...(recruiterName !== undefined && { recruiterName: recruiterName.trim() }),
      ...(followUpDate !== undefined && { followUpDate: followUpDate ? new Date(followUpDate) : null }),
      ...(notes !== undefined && { notes: notes.trim() })
    };

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: `Job application with ID '${id}' not found.`
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Job application updated successfully.',
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Public
export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid ID format: '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }

    if (!checkDatabaseStatus()) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: 'Database connection is not ready. Please verify MONGODB_URI in backend/.env.'
      });
    }

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: `Job application with ID '${id}' not found.`
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Job application deleted successfully.',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
