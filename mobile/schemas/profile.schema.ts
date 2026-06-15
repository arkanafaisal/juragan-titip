import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string()
    .max(50, "Nama usaha maksimal 50 karakter")
    .refine(val => !val || val.length >= 3, { 
      message: "Nama usaha minimal 3 karakter" 
    })
    .optional(),
  phone: z.string()
    .refine(val => !val || /^0\d{9,14}$/.test(val), { 
      message: "Nomor WhatsApp harus diawali '0' dan berisi 10-15 angka" 
    })
    .optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
