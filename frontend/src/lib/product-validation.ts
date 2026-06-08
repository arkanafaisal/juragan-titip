import { validateRequired, validateLength, validateGreaterThanZero, validatePriceMargin } from "./validations";

export const PRODUCT_VALIDATION_RULES = {
  NAME_MIN: 3,
  NAME_MAX: 24,
  DESC_MAX: 200,
  STOCK_MAX: 10000,
  PRICE_MAX: 100000,
};

export const validateProductEditFields = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!validateRequired(data.name)) {
    errors.name = "Nama produk wajib diisi";
  } else if (!validateLength(data.name, PRODUCT_VALIDATION_RULES.NAME_MIN, PRODUCT_VALIDATION_RULES.NAME_MAX)) {
    errors.name = `Nama produk harus antara ${PRODUCT_VALIDATION_RULES.NAME_MIN}-${PRODUCT_VALIDATION_RULES.NAME_MAX} karakter`;
  }

  if (!validateRequired(data.category)) {
    errors.category = "Kategori produk wajib dipilih";
  }

  if (!validateGreaterThanZero(data.costPrice) || data.costPrice > PRODUCT_VALIDATION_RULES.PRICE_MAX) {
    errors.costPrice = `Harga modal tidak valid (max ${PRODUCT_VALIDATION_RULES.PRICE_MAX})`;
  }

  if (!validateGreaterThanZero(data.wholesalePrice) || data.wholesalePrice > PRODUCT_VALIDATION_RULES.PRICE_MAX) {
    errors.wholesalePrice = `Harga jual tidak valid (max ${PRODUCT_VALIDATION_RULES.PRICE_MAX})`;
  } else if (data.costPrice && data.wholesalePrice && !validatePriceMargin(data.costPrice, data.wholesalePrice)) {
    errors.wholesalePrice = "Harga jual harus lebih besar dari modal";
  }

  if (data.retailPrice && (!validateGreaterThanZero(data.retailPrice) || data.retailPrice > PRODUCT_VALIDATION_RULES.PRICE_MAX)) {
    errors.retailPrice = `Harga eceran tidak valid (max ${PRODUCT_VALIDATION_RULES.PRICE_MAX})`;
  }

  if (data.description && data.description.length > PRODUCT_VALIDATION_RULES.DESC_MAX) {
    errors.description = `Deskripsi maksimal ${PRODUCT_VALIDATION_RULES.DESC_MAX} karakter`;
  }

  return errors;
};
