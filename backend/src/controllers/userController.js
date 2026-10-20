import { ROLES } from '../config/constants.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const PROFILE_FIELDS = ['name', 'phone', 'region', 'village', 'crops', 'farmSizeHectares', 'farmingType', 'language'];

export const getMyProfile = asyncHandler(async (request, response) => {
  response.json({ success: true, data: { user: request.user.toJSON() } });
});

export const updateMyProfile = asyncHandler(async (request, response) => {
  for (const field of PROFILE_FIELDS) {
    if (request.body[field] !== undefined) {
      request.user[field] = request.body[field];
    }
  }
  if (
    request.body.privacy &&
    typeof request.body.privacy === 'object' &&
    typeof request.body.privacy.showPhoneOnListings === 'boolean'
  ) {
    request.user.set('privacy.showPhoneOnListings', request.body.privacy.showPhoneOnListings);
  }
  await request.user.save();
  response.json({ success: true, data: { user: request.user.toJSON() } });
});

export const listUsers = asyncHandler(async (request, response) => {
  const filter = {};
  if (request.query.role) {
    filter.role = request.query.role;
  }
  if (request.query.region) {
    filter.region = request.query.region;
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(100);
  response.json({ success: true, data: { users } });
});

export const updateUserRole = asyncHandler(async (request, response) => {
  const { role } = request.body;
  if (!Object.values(ROLES).includes(role)) {
    throw new HttpError(400, 'Invalid role');
  }
  const user = await User.findById(request.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  user.role = role;
  await user.save();
  response.json({ success: true, data: { user: user.toJSON() } });
});
