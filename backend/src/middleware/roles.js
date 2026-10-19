import { HttpError } from '../utils/httpError.js';

export function authorize(...allowedRoles) {
  return (request, _response, next) => {
    if (!request.user) {
      throw new HttpError(401, 'Authentication required');
    }
    if (!allowedRoles.includes(request.user.role)) {
      throw new HttpError(403, 'You do not have permission to perform this action');
    }
    next();
  };
}
