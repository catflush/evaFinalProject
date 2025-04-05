import express from 'express';
import { register, login } from '../controllers/userController.js';
import validateJOI from '../middleware/validateJOI.js';
import { registerSchema, loginSchema } from '../validation/userValidation.js';
import { verifyToken, extractTokenPayload } from '../middleware/verifyToken.js';
import { generateToken } from '../utils/tokenUtils.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateJOI(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post('/login', validateJOI(loginSchema), login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (with valid refresh token)
 */
router.post('/refresh-token', extractTokenPayload, (req, res) => {
  try {
    // Check if token payload exists
    if (!req.tokenPayload || !req.tokenPayload.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Generate new token
    const newToken = generateToken(req.tokenPayload.id);

    res.json({
      token: newToken,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Public (with valid token)
 */
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid' });
});

export default router; 