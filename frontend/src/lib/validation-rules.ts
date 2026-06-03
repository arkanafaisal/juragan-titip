export const VALIDATION_RULES = {
  STORE: {
    NAME_MIN: 3,
    NAME_MAX: 30,
    OWNER_MIN: 3,
    OWNER_MAX: 20,
    ADDRESS_MIN: 6,
    ADDRESS_MAX: 60,
    NOTES_MAX: 200,
  },

  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 13,
    REGEX: /^0[0-9]{9,12}$/, 
  },
  GENERAL: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN: 6,
  },
  SETTINGS: {
    CATEGORY_MIN: 3,
    CATEGORY_MAX: 20,
    STOCK_THRESHOLD_MIN: 1,
    STOCK_THRESHOLD_MAX: 1000,
    OVERDUE_DAYS_MIN: 1,
    OVERDUE_DAYS_MAX: 300,
  }
};