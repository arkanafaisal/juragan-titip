import { VALIDATION_RULES } from "./validation-rules";

export const validateLength = (value: string, min: number, max: number): boolean => {
  const len = value.trim().length;
  return len >= min && len <= max;
};

export const validateRegex = (value: string, regex: RegExp): boolean => {
  return regex.test(value.trim());
};

export const validateGreaterThanZero = (value: number): boolean => {
  return value > 0;
};

export const validateWhatsApp = (
  phone: string, 
  rules: { MIN_LENGTH: number; MAX_LENGTH: number; REGEX: RegExp }
): boolean => {
  if (/[^0-9]/.test(phone)) return false; 
  if (!phone.startsWith("0")) return false; 
  if (phone.length < rules.MIN_LENGTH || phone.length > rules.MAX_LENGTH) {
    return false;
  }
  return rules.REGEX.test(phone);
};

export const validatePriceMargin = (costPrice: number, sellingPrice: number): boolean => {
  return costPrice < sellingPrice;
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === "string") return value.trim().length > 0;
  if (value === null || value === undefined) return false;
  return true;
};



export const validateLoginForm = (data: any): string | null => {
  if (!validateRequired(data.email)) return "Email tidak boleh kosong";
  if (!validateRegex(data.email, VALIDATION_RULES.GENERAL.EMAIL_REGEX)) return "Format email tidak valid";
  if (!validateRequired(data.password)) return "Password tidak boleh kosong";
  return null;
};

export const validateRegisterForm = (data: any): string | null => {
  if (!validateRequired(data.name)) return "Nama lengkap tidak boleh kosong";
  if (!validateRequired(data.email) || !validateRegex(data.email, VALIDATION_RULES.GENERAL.EMAIL_REGEX)) return "Format email tidak valid";
  if (!validateRequired(data.password) || data.password.length < VALIDATION_RULES.GENERAL.PASSWORD_MIN) return `Password minimal harus ${VALIDATION_RULES.GENERAL.PASSWORD_MIN} karakter`;
  if (data.password !== data.confirmPassword) return "Password dan Konfirmasi Password tidak cocok";
  return null;
};

export const validateStoreForm = (data: any): string | null => {
  if (!validateRequired(data.name) || !validateLength(data.name, VALIDATION_RULES.STORE.NAME_MIN, VALIDATION_RULES.STORE.NAME_MAX)) return `Nama toko harus antara ${VALIDATION_RULES.STORE.NAME_MIN}-${VALIDATION_RULES.STORE.NAME_MAX} karakter.`;
  if (!validateRequired(data.ownerName) || !validateLength(data.ownerName, VALIDATION_RULES.STORE.OWNER_MIN, VALIDATION_RULES.STORE.OWNER_MAX)) return `Nama pemilik harus antara ${VALIDATION_RULES.STORE.OWNER_MIN}-${VALIDATION_RULES.STORE.OWNER_MAX} karakter.`;
  if (!validateWhatsApp(data.phone, VALIDATION_RULES.PHONE)) return "Format nomor telepon tidak valid (Harus diawali 0, full angka, tanpa spasi/+, min 10 digit).";
  if (!validateRequired(data.address) || !validateLength(data.address, VALIDATION_RULES.STORE.ADDRESS_MIN, VALIDATION_RULES.STORE.ADDRESS_MAX)) return `Alamat harus antara ${VALIDATION_RULES.STORE.ADDRESS_MIN}-${VALIDATION_RULES.STORE.ADDRESS_MAX} karakter.`;
  if (data.notes && data.notes.length > VALIDATION_RULES.STORE.NOTES_MAX) return `Catatan maksimal ${VALIDATION_RULES.STORE.NOTES_MAX} karakter.`;
  return null;
};

export const validateProductForm = (data: any): string | null => {
  if (!validateRequired(data.name) || !validateLength(data.name, VALIDATION_RULES.PRODUCT.NAME_MIN, VALIDATION_RULES.PRODUCT.NAME_MAX)) return `Nama produk harus antara ${VALIDATION_RULES.PRODUCT.NAME_MIN}-${VALIDATION_RULES.PRODUCT.NAME_MAX} karakter.`;
  if (!validateRequired(data.category)) return "Kategori produk wajib dipilih.";
  if (data.warehouseStock < 0 || data.warehouseStock > VALIDATION_RULES.PRODUCT.STOCK_MAX) return `Stok gudang harus antara 0-${VALIDATION_RULES.PRODUCT.STOCK_MAX}.`;
  if (!validateGreaterThanZero(data.costPrice) || data.costPrice > VALIDATION_RULES.PRODUCT.PRICE_MAX) return `Harga modal harus lebih besar dari 0 dan maksimal ${VALIDATION_RULES.PRODUCT.PRICE_MAX}.`;
  if (!validateGreaterThanZero(data.wholesalePrice) || data.wholesalePrice > VALIDATION_RULES.PRODUCT.PRICE_MAX) return `Harga grosir/setor harus lebih besar dari 0 dan maksimal ${VALIDATION_RULES.PRODUCT.PRICE_MAX}.`;
  if (data.retailPrice && (!validateGreaterThanZero(data.retailPrice) || data.retailPrice > VALIDATION_RULES.PRODUCT.PRICE_MAX)) return `Harga eceran/jual (jika ada) harus lebih besar dari 0 dan maksimal ${VALIDATION_RULES.PRODUCT.PRICE_MAX}.`;
  if (!validatePriceMargin(data.costPrice, data.wholesalePrice)) return "Harga modal tidak boleh sama atau lebih besar dari harga setor.";
  if (data.description && data.description.length > VALIDATION_RULES.PRODUCT.DESC_MAX) return `Deskripsi maksimal ${VALIDATION_RULES.PRODUCT.DESC_MAX} karakter.`;
  return null;
};