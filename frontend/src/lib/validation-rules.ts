export const VALIDATION_RULES = {
  STORE: {
    NAME_MIN: 3,
    NAME_MAX: 50,
    ADDRESS_MIN: 10,
    ADDRESS_MAX: 200,
    NOTES_MAX: 500,
  },
  PRODUCT: {
    NAME_MIN: 3,
    NAME_MAX: 100,
    DESC_MAX: 500,
  },
  PHONE: {
    // Standar WA Indonesia: awalan +62, 62, atau 08
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    REGEX: /^(^\+62|62|^08)(8|9|1|2|3|5)[0-9]{6,11}$/, 
  },
  GENERAL: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN: 8,
  }
};