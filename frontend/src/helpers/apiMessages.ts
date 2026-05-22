// src/helpers/apiMessages.ts

const handleCommonMessages = async (response: Response) => {
  const status = response.status;
  
  if (status === 0) {
    return "Gagal terhubung. Silakan periksa koneksi internet Anda.";
  }
  if (status >= 500) {
    return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
  }
  if (status === 429) {
    return "Terlalu banyak permintaan. Silakan tunggu sebentar.";
  }
  if (status === 403) {
    return "Akses ditolak: Anda tidak memiliki izin untuk melakukan tindakan ini.";
  }
  if (status === 401) {
    return "Sesi berakhir: Silakan masuk kembali.";
  }
  if (status === 400) {
    const data = await response.clone().json().catch(() => null);
    return data?.error || "Data yang dikirim tidak valid.";
  }
  
  return "";
};

type ApiMessagesType = Record<string, Record<string, (response: Response) => Promise<string>>>

const apiMessages: ApiMessagesType = {
  auth: {
    login: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Berhasil masuk.";
      if (status === 404) return "Pengguna tidak ditemukan.";
      if (status === 401) return "Kata sandi salah.";
      
      return `Gagal masuk (Kode: ${status}).`;
    },
    
    register: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Pendaftaran berhasil.";
      if (status === 409) return "Username atau Email sudah terdaftar."; 
      
      return `Pendaftaran gagal (Kode: ${status}).`;
    },
    
    logout: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      if (response.status === 200) return "Berhasil keluar.";
      return `Gagal keluar (Kode: ${response.status}).`;
    }
  },
  
  users: {
    getMe: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Profil berhasil dimuat.";
      if (status === 404) return "Profil tidak ditemukan.";
      
      return `Gagal memuat profil (Kode: ${status}).`;
    },
  },

  products: {
    getAll: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Produk berhasil dimuat.";
      
      return `Gagal memuat produk (Kode: ${status}).`;
    },

    create: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Berhasil menambah produk.";
      if (status === 400) return "Data produk tidak valid.";
      
      return `Gagal menambah produk (Kode: ${status}).`;
    },
  },

  consignment: {
    getAll: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Data titipan berhasil dimuat.";
      
      return `Gagal memuat data titipan (Kode: ${status}).`;
    },

    create: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Berhasil menambah data titipan.";
      if (status === 400) return "Data titipan tidak valid.";
      
      return `Gagal menambah data titipan (Kode: ${status}).`;
    },
  }
};

export default apiMessages;
