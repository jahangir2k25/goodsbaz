import { randomBytes } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const googleClient = new OAuth2Client();

const userPayload = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  address: u.address,
  role: u.role,
  token: generateToken(u._id),
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }
  // role is never taken from the request body
  const user = await User.create({ name, email, password, phone });
  res.status(201).json(userPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password || ''))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json(userPayload(user));
});

export const loginWithGoogle = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(503);
    throw new Error('Google login is not configured on the server');
  }

  const { credential } = req.body;
  if (typeof credential !== 'string' || !credential) {
    res.status(400);
    throw new Error('Google credential is required');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    res.status(401);
    throw new Error('Invalid Google credential');
  }

  if (!payload?.email || !payload.email_verified) {
    res.status(401);
    throw new Error('A verified Google email is required');
  }

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: payload.name || email,
      email,
      password: randomBytes(32).toString('hex'),
    });
  }

  res.json(userPayload(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.phone = req.body.phone ?? user.phone;
  user.address = req.body.address ?? user.address;
  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    user.password = req.body.password;
  }
  await user.save();
  res.json(userPayload(user));
});
