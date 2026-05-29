export const VALIDATION_RULES = {
  STORE: {
    NAME_MIN: 3,
    NAME_MAX: 30,
    OWNER_MIN: 3,
    OWNER_MAX: 20,
    ADDRESS_MIN: 10,
    ADDRESS_MAX: 60,
    NOTES_MAX: 200,
  },
  PRODUCT: {
    NAME_MIN: 3,
    NAME_MAX: 24,
    DESC_MAX: 200,
    STOCK_MAX: 10000,
    PRICE_MAX: 100000,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    REGEX: /^0[0-9]{9,14}$/, 
  },
  GENERAL: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN: 6,
  }
};