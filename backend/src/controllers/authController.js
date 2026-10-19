import bcrypt from 'bcryptjs';
import { PUBLIC_REGISTER_ROLES, ROLES } from '../config/constants.js';
import { signToken } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

function authPayload(user) {
  return {
    token: signToken(user),
    user: user.toJSON(),
  };
}

export const register = asyncHandler(async (request, response) => {
  const {
    name,
    email,
    password,
    role = ROLES.FARMER,
    phone,
    region,
    village,
    crops,
    farmSizeHectares,
    farmingType,
    language,
  } = request.body;

  if (!PUBLIC_REGISTER_ROLES.includes(role)) {
    throw new HttpError(403, 'That role cannot be self-assigned');
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    throw new HttpError(409, 'An account with that email already exists');
  }
  if (phone) {
    const phoneTaken = await User.findOne({ phone });
    if (phoneTaken) {
      throw new HttpError(409, 'An account with that phone number already exists');
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    phone,
    region,
    village,
    crops: crops || [],
    farmSizeHectares,
    farmingType,
    language,
  });

  response.status(201).json({ success: true, data: authPayload(user) });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new HttpError(401, 'Invalid email or password');
  }

  response.json({ success: true, data: authPayload(user) });
});

export const me = asyncHandler(async (request, response) => {
  response.json({ success: true, data: { user: request.user.toJSON() } });
});
