import { AppError } from "../../utils/AppError.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createValidator = (validateFn) => (req, res, next) => {
  try {
    validateFn(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const ensureString = (value, fieldName, { min = 1, max = 255 } = {}) => {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
    throw new AppError(`${fieldName} must be a string between ${min} and ${max} characters`, 400);
  }
};

export const ensureOptionalString = (value, fieldName, options = {}) => {
  if (value === undefined || value === null || value === "") return;
  ensureString(value, fieldName, options);
};

export const ensureEmail = (value, fieldName) => {
  if (typeof value !== "string" || !EMAIL_REGEX.test(value.trim())) {
    throw new AppError(`${fieldName} must be a valid email address`, 400);
  }
};

export const ensureUuid = (value, fieldName) => {
  if (typeof value !== "string" || !UUID_REGEX.test(value.trim())) {
    throw new AppError(`${fieldName} must be a valid UUID`, 400);
  }
};

export const ensureEnum = (value, fieldName, allowedValues) => {
  if (!allowedValues.includes(value)) {
    throw new AppError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`,
      400
    );
  }
};

export const ensureNumber = (value, fieldName, { min, max } = {}) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new AppError(`${fieldName} must be a valid number`, 400);
  }
  if (min !== undefined && num < min) {
    throw new AppError(`${fieldName} must be at least ${min}`, 400);
  }
  if (max !== undefined && num > max) {
    throw new AppError(`${fieldName} must be at most ${max}`, 400);
  }
};

export const ensureDate = (value, fieldName) => {
  if (isNaN(Date.parse(value))) {
    throw new AppError(`${fieldName} must be a valid date`, 400);
  }
};
