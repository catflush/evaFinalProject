import Workshop from '../models/Workshop.js';
import Joi from 'joi';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base uploads directory
const BASE_UPLOADS_DIR = path.join(__dirname, '../../uploads');
const WORKSHOPS_UPLOADS_DIR = path.join(BASE_UPLOADS_DIR, 'workshops');

// Create uploads directories if they don't exist
if (!fs.existsSync(BASE_UPLOADS_DIR)) {
  fs.mkdirSync(BASE_UPLOADS_DIR, { recursive: true });
  console.log('Created base uploads directory:', BASE_UPLOADS_DIR);
}

if (!fs.existsSync(WORKSHOPS_UPLOADS_DIR)) {
  fs.mkdirSync(WORKSHOPS_UPLOADS_DIR, { recursive: true });
  console.log('Created workshops uploads directory:', WORKSHOPS_UPLOADS_DIR);
}

// Helper function to process attachments
const processAttachments = (files) => {
  if (!files || files.length === 0) return [];
  
  return files.map(file => ({
    filename: file.originalname,
    path: `workshops/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size
  }));
};

// Helper function to delete attachments
const deleteAttachments = async (attachments) => {
  if (!attachments || attachments.length === 0) return;
  
  for (const attachment of attachments) {
    const filePath = path.join(BASE_UPLOADS_DIR, attachment.path);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
};

// Validation schemas
const workshopValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  date: Joi.date().required().messages({
    'date.base': 'Valid date is required',
    'any.required': 'Date is required'
  }),
  time: Joi.string().required().messages({
    'string.empty': 'Time is required',
    'any.required': 'Time is required'
  }),
  duration: Joi.string().required().messages({
    'string.empty': 'Duration is required',
    'any.required': 'Duration is required'
  }),
  maxParticipants: Joi.number().min(1).required().messages({
    'number.min': 'Maximum participants must be at least 1',
    'any.required': 'Maximum participants is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required'
  }),
  level: Joi.string().valid('beginner', 'intermediate', 'expert').default('beginner'),
  categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow('', null).messages({
    'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId'
  }),
  requirements: Joi.array().items(Joi.string()),
  learningOutcomes: Joi.array().items(Joi.string()),
  location: Joi.string(),
  equipment: Joi.array().items(Joi.string()),
  materials: Joi.array().items(Joi.string())
});

// Separate validation schema for updates where fields are optional
const workshopUpdateValidationSchema = Joi.object({
  title: Joi.string().allow('').optional().messages({
    'string.empty': 'Title cannot be empty if provided'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.empty': 'Description cannot be empty if provided'
  }),
  date: Joi.date().optional().messages({
    'date.base': 'Valid date is required if provided'
  }),
  time: Joi.string().allow('').optional().messages({
    'string.empty': 'Time cannot be empty if provided'
  }),
  duration: Joi.string().allow('').optional().messages({
    'string.empty': 'Duration cannot be empty if provided'
  }),
  maxParticipants: Joi.number().min(1).optional().messages({
    'number.min': 'Maximum participants must be at least 1'
  }),
  price: Joi.number().min(0).optional().messages({
    'number.min': 'Price cannot be negative'
  }),
  level: Joi.string().valid('beginner', 'intermediate', 'expert').optional(),
  categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow('', null).optional().messages({
    'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId'
  }),
  requirements: Joi.array().items(Joi.string()).optional(),
  learningOutcomes: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().allow('').optional(),
  equipment: Joi.array().items(Joi.string()).optional(),
  materials: Joi.array().items(Joi.string()).optional(),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      path: Joi.string().required(),
      mimetype: Joi.string().required(),
      size: Joi.number().required()
    })
  ).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Get all workshops with optional category filter
export const getAllWorkshops = async (req, res) => {
  try {
    const { categoryId, search, page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc' } = req.query;
    
    // Build query
    const query = {};
    if (categoryId) {
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        query.categoryId = categoryId;
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID format'
        });
      }
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const workshops = await Workshop.find(query)
      .populate('instructor', 'firstName lastName')
      .populate('participants', 'firstName lastName')
      .populate('categoryId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Workshop.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workshops.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: workshops
    });
  } catch (err) {
    console.error('Error fetching workshops:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get upcoming workshops
export const getUpcomingWorkshops = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const workshops = await Workshop.find({
      date: { $gte: currentDate },
      status: 'upcoming'
    })
      .populate('instructor', 'firstName lastName')
      .populate('categoryId', 'name')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops
    });
  } catch (err) {
    console.error('Error fetching upcoming workshops:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get workshops hosted by instructor
export const getHostedWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ instructor: req.user.id })
      .populate('instructor', 'firstName lastName')
      .populate('participants', 'firstName lastName')
      .populate('categoryId', 'name')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops
    });
  } catch (err) {
    console.error('Error fetching hosted workshops:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single workshop
export const getWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('instructor', 'firstName lastName')
      .populate('participants', 'firstName lastName')
      .populate('categoryId', 'name');
    
    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workshop
    });
  } catch (err) {
    console.error('Error fetching workshop:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new workshop
export const createWorkshop = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = workshopValidationSchema.validate(req.body);
    if (error) {
      // If there are files uploaded, delete them before returning error
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
      }
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Process attachments
    const attachments = processAttachments(req.files);

    // Create workshop with attachments
    const workshop = await Workshop.create({
      ...value,
      instructor: req.user._id,
      attachments
    });

    // Populate the response data
    const populatedWorkshop = await Workshop.findById(workshop._id)
      .populate('instructor', 'firstName lastName')
      .populate('categoryId', 'name');

    res.status(201).json({
      success: true,
      data: populatedWorkshop
    });
  } catch (err) {
    console.error('Error creating workshop:', err);
    // If there are files uploaded and an error occurs, delete them
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update workshop
export const updateWorkshop = async (req, res) => {
  try {
    // Find the existing workshop
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      // Delete uploaded files if workshop not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
      }
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Check if user is the instructor
    if (workshop.instructor.toString() !== req.user._id.toString()) {
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
      }
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this workshop'
      });
    }

    // Validate request body using the update schema
    const { error, value } = workshopUpdateValidationSchema.validate(req.body);
    if (error) {
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
      }
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Process new attachments
    const newAttachments = processAttachments(req.files);

    // Delete old attachments if new ones are provided
    if (newAttachments.length > 0) {
      await deleteAttachments(workshop.attachments);
    }

    // Update workshop with only the fields that were provided
    const updateData = {
      ...Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== undefined)
      ),
      attachments: newAttachments.length > 0 ? newAttachments : workshop.attachments
    };

    // Update workshop
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('instructor', 'firstName lastName')
      .populate('categoryId', 'name');

    res.status(200).json({
      success: true,
      data: updatedWorkshop
    });
  } catch (err) {
    console.error('Error updating workshop:', err);
    // If there are files uploaded and an error occurs, delete them
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map(file => fs.promises.unlink(file.path)));
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete workshop
export const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Check if user is the instructor
    if (workshop.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this workshop'
      });
    }

    // Delete attachments
    await deleteAttachments(workshop.attachments);

    // Delete workshop
    await workshop.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting workshop:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Register for workshop
export const registerForWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Check if workshop is full
    if (workshop.participants.length >= workshop.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Workshop is full'
      });
    }

    // Check if user is already registered
    if (workshop.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this workshop'
      });
    }

    // Check if workshop is upcoming
    if (workshop.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        error: 'Cannot register for a workshop that is not upcoming'
      });
    }

    workshop.participants.push(req.user.id);
    await workshop.save();

    res.status(200).json({
      success: true,
      data: workshop
    });
  } catch (err) {
    console.error('Error registering for workshop:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Cancel workshop registration
export const cancelRegistration = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Check if user is registered
    if (!workshop.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Not registered for this workshop'
      });
    }

    // Check if workshop is upcoming
    if (workshop.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel registration for a workshop that is not upcoming'
      });
    }

    workshop.participants = workshop.participants.filter(
      participant => participant.toString() !== req.user.id
    );
    await workshop.save();

    res.status(200).json({
      success: true,
      data: workshop
    });
  } catch (err) {
    console.error('Error canceling workshop registration:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 