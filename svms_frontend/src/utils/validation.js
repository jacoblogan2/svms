/**
 * Validation and Sanitization Utilities for SVMS
 */

/**
 * Strips any non-numeric characters instantly.
 * Used for National ID and Phone fields.
 */
export const sanitizeDigits = (val) => {
  return val.replace(/\D/g, '');
};

/**
 * Strips numbers and special characters. Allows letters and spaces only.
 * Used for First Name and Last Name fields.
 */
export const sanitizeName = (val) => {
  return val.replace(/[^a-zA-Z\s]/g, '');
};

/**
 * Strips HTML tags and dangerous characters to prevent XSS/SQL injection.
 * Used for general text fields like description, occupation, etc.
 */
export const sanitize = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[;'"\\]/g, '')   // Strip SQL-sensitive characters
    .replace(/--/g, '');       // Strip SQL comments
};

/**
 * Validates email format.
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates National ID (NID).
 * Must be exactly 10 digits.
 */
export const validateNID = (nid) => {
  return /^\d{10}$/.test(nid);
};

/**
 * Validates Phone number.
 * Must be exactly 10 digits.
 */
export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

/**
 * Validates Password.
 * Minimum 8 characters.
 */
export const validatePassword = (password) => {
  return password.length >= 8;
};
