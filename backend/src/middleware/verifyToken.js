import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * Middleware to verify JWT token
 * Extracts and verifies the token without attaching user to request
 * Useful for routes that only need token verification without user data
 */
export const verifyToken = (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      // eslint-disable-next-line no-undef
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
      jwt.verify(token, secret);
      
      // Token is valid, proceed
      next();
    } catch {
      return next(new ErrorResponse('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to extract token payload without verification
 * Useful for routes that need token data but don't require verification
 */
export const extractTokenPayload = (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse('No token provided', 401));
    }

    try {
      // Decode token without verification
      const decoded = jwt.decode(token);
      
      if (!decoded) {
        return next(new ErrorResponse('Invalid token format', 401));
      }
      
      // Add decoded token to request
      req.tokenPayload = decoded;
      next();
    } catch {
      return next(new ErrorResponse('Invalid token format', 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if token is about to expire
 * Useful for refreshing tokens before they expire
 */
export const checkTokenExpiration = (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next();
    }

    try {
      // Decode token without verification
      const decoded = jwt.decode(token);
      
      if (!decoded || !decoded.exp) {
        return next();
      }
      
      // Check if token is about to expire (within 5 minutes)
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (expirationTime - currentTime < fiveMinutes) {
        // Token is about to expire, add flag to request
        req.tokenExpiringSoon = true;
      }
      
      next();
    } catch {
      return next();
    }
  } catch (error) {
    next(error);
  }
}; 