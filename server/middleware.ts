import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development/demo
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development for static assets
    return process.env.NODE_ENV === 'development' && (
      req.path.startsWith('/uploads/') ||
      req.path.startsWith('/assets/') ||
      req.path.includes('.')
    );
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const fileUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 file uploads per windowMs
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      ...(process.env.NODE_ENV === 'production' && { upgradeInsecureRequests: [] }),
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS middleware
export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200,
});

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potential XSS and SQL injection patterns
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// File validation middleware
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File too large. Maximum size is 5MB.' 
    });
  }

  // Additional security: check file header
  const fileHeader = req.file.buffer?.slice(0, 8);
  if (fileHeader) {
    const jpegHeader = [0xFF, 0xD8, 0xFF];
    const pngHeader = [0x89, 0x50, 0x4E, 0x47];
    const gifHeader = [0x47, 0x49, 0x46];
    const webpHeader = [0x52, 0x49, 0x46, 0x46];

    const headerMatches = (header: number[]) => 
      header.every((byte, index) => fileHeader[index] === byte);

    const isValidImage = headerMatches(jpegHeader) || 
                        headerMatches(pngHeader) || 
                        headerMatches(gifHeader) || 
                        headerMatches(webpHeader);

    if (!isValidImage) {
      return res.status(400).json({ 
        error: 'Invalid file format. File appears to be corrupted or not a valid image.' 
      });
    }
  }

  next();
};

// Email verification required middleware
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = req.user as any;
  if (!user.isEmailVerified) {
    return res.status(403).json({ 
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

// Admin required middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = req.user as any;
  if (!user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

// Store owner middleware
export const requireStoreOwner = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = req.user as any;
  const storeId = parseInt(req.params.storeId);

  if (user.isAdmin) {
    return next(); // Admins can access all stores
  }

  // Check if user owns the store (this would need to be implemented in storage)
  // For now, we'll just check if user is authenticated
  next();
};

// Error handling middleware
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  // Validation errors
  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors
    });
  }

  // Database errors
  if (error.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      message: 'Resource already exists'
    });
  }

  if (error.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      message: 'Invalid reference'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message || 'Internal server error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};