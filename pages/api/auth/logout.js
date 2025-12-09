import { removeTokenCookie } from '../../../utils/auth';
export default function handler(req, res) {
  removeTokenCookie(res);
  return res.status(200).json({ message: 'Logged out' });
}
