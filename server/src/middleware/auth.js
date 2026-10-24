import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) return res.status(401).json({ message: 'Account not found.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or expired. Please log in again.' });
  }
}
export function requireAdmin(req, res, next) {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (!adminEmail || req.user.email !== adminEmail) return res.status(403).json({ message: 'Admin access required.' });
  next();
}
