import dbConnect from '../../../lib/db';
import cookie from 'cookie';
import { verifyToken } from '../../../utils/auth';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie || '') : {};
  const token = cookies[process.env.COOKIE_NAME || 'token'];
  if (!token) return res.status(200).json({ user: null });
  const data = verifyToken(token);
  if (!data) return res.status(200).json({ user: null });
  const user = await User.findById(data.id).select('-password');
  return res.status(200).json({ user });
}
