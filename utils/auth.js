import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const TOKEN_EXPIRES = 60 * 60 * 24 * 7; // 7 days

if (!JWT_SECRET) throw new Error('Please define JWT_SECRET in .env.local');

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function setTokenCookie(res, token) {
  const serialized = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_EXPIRES,
  });
  res.setHeader('Set-Cookie', serialized);
}

export function removeTokenCookie(res) {
  const serialized = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', serialized);
}
