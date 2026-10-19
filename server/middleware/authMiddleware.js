import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getToken = (req) => {
  const h = req.headers.authorization;
  return h && h.startsWith('Bearer ') ? h.split(' ')[1] : null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (e) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Attaches req.user if a valid token exists, but never blocks (guest checkout)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      /* ignore invalid token for guests */
    }
  }
  next();
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  next(new Error('Admin access only'));
};
