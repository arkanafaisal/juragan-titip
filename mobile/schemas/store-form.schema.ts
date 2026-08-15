import { z } from 'zod';

export const STORE_VALIDATION_RULES = {
  NAME_MIN: 3,
  NAME_MAX: 30,
  OWNER_MIN: 3,
  OWNER_MAX: 20,

  NOTES_MAX: 200,
  PHONE_MIN: 10,
  PHONE_MAX: 13,
};


export const storeFormSchema = z.object({
  name: z.string()
    .min(STORE_VALIDATION_RULES.NAME_MIN, `Nama toko minimal ${STORE_VALIDATION_RULES.NAME_MIN} karakter`)
    .max(STORE_VALIDATION_RULES.NAME_MAX, `Nama toko maksimal ${STORE_VALIDATION_RULES.NAME_MAX} karakter`),
  
  ownerName: z.string()
    .max(STORE_VALIDATION_RULES.OWNER_MAX, `Nama pemilik maksimal ${STORE_VALIDATION_RULES.OWNER_MAX} karakter`)
    .optional()
    .or(z.literal('')),
  
  // Karena nomor HP opsional, tapi kalau diisi harus valid
  phone: z.string()
    .regex(new RegExp(`^0[0-9]{${STORE_VALIDATION_RULES.PHONE_MIN - 1},${STORE_VALIDATION_RULES.PHONE_MAX - 1}}$`),
    `Nomor HP harus diawali angka 0 dan berisi ${STORE_VALIDATION_RULES.PHONE_MIN}-${STORE_VALIDATION_RULES.PHONE_MAX} digit angka`)
    .optional()
    .or(z.literal('')),
    


  // Karena di schema database wajib diisi
  latitude: z.number({
    message: "Koordinat latitude tidak valid atau belum diisi"
  })
    .min(-90, "Latitude tidak boleh kurang dari -90")
    .max(90, "Latitude tidak boleh lebih dari 90")
    .refine(val => val !== 0, "Koordinat latitude wajib diisi via GPS/Peta"),
  
  longitude: z.number({
    message: "Koordinat longitude tidak valid atau belum diisi"
  })
    .min(-180, "Longitude tidak boleh kurang dari -180")
    .max(180, "Longitude tidak boleh lebih dari 180")
    .refine(val => val !== 0, "Koordinat longitude wajib diisi via GPS/Peta"),
  
  category: z.enum(["1", "2", "3", "4", "5"], {
    error: "Kategori toko wajib dipilih",
  }),
  
  notes: z.string()
    .max(STORE_VALIDATION_RULES.NOTES_MAX, `Catatan maksimal ${STORE_VALIDATION_RULES.NOTES_MAX} karakter`)
    .optional()
    .or(z.literal('')),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;
