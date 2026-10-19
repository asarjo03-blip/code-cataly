import { HttpError } from '../utils/httpError.js';

export function notFound(_request, _response, next) {
  next(new HttpError(404, 'Route not found'));
}

export function errorHandler(error, _request, response, _next) {
  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: 'Validation failed',
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    return response.status(409).json({
      success: false,
      message: 'A record with those unique fields already exists',
    });
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message,
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    payload.debug = error.message;
  }

  return response.status(statusCode).json(payload);
}
