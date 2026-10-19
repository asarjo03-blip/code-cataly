import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const authenticate = asyncHandler(async (request, _response, next) => {
  const header = request.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, 'Account no longer exists');
  }

  request.user = user;
  next();
});
