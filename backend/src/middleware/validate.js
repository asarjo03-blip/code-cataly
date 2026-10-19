import { HttpError } from '../utils/httpError.js';

export function validate(schema) {
  return (request, _response, next) => {
    const errors = [];

    for (const [field, rule] of Object.entries(schema)) {
      const source = rule.in || 'body';
      const container = request[source] || {};
      const value = container[field];
      const present = value !== undefined && value !== null && value !== '';

      if (rule.required && !present) {
        errors.push(`${field} is required`);
        continue;
      }

      if (!present) {
        continue;
      }

      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      }
      if (rule.type === 'number' && Number.isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
      }
      if (rule.type === 'number' && rule.min != null && Number(value) < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }
      if (rule.type === 'number' && rule.max != null && Number(value) > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      }
      if (rule.type === 'array' && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
      }
      if (rule.minLength && String(value).length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
      }
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors.push(`${field} is invalid`);
      }
    }

    if (errors.length > 0) {
      throw new HttpError(400, 'Validation failed', errors);
    }

    next();
  };
}
