# 📦 Sales & Store Management System (Web & Mobile)

> Sistem manajemen penjualan, inventaris konsinyasi, dan pelacakan rute kunjungan toko (journey) berbasis monorepo.

Repositori ini berisi *source code* yang terbagi menjadi dua platform utama: **Frontend (Web)** yang berstatus sebagai *prototype*, dan **Mobile (App)** untuk operasional lapangan yang lebih stabil.

## 🔌 Arsitektur & Konektivitas (Penting)

Kedua platform ini dirancang dengan pendekatan **Local-First (Tanpa Backend Server Terpusat)**. Semua data operasional disimpan langsung di penyimpanan lokal perangkat masing-masing. Namun, terdapat perbedaan karakteristik dependensi internet sebagai berikut:

* **Frontend (Web):** **Membutuhkan koneksi internet**. Karena berjalan di *browser*, internet diperlukan untuk memuat aset situs serta merender modul peta interaktif (*map picker* & routing).
* **Mobile (App):** **Mendukung fungsionalitas Offline**. Aplikasi dapat berjalan tanpa internet untuk input data harian. Koneksi internet hanya *optional* (diperlukan untuk memuat visual peta pada *map picker*). Jika jaringan terputus dan peta gagal termuat, aplikasi **tetap dapat mendeteksi dan menyimpan koordinat lokasi Anda** ke database lokal.

---

## 📂 Struktur Repositori

* `/frontend` - Aplikasi Web berbasis React (Purwarupa/Prototype).
* `/mobile` - Aplikasi *Mobile* berbasis React Native (Expo) untuk mobilitas lapangan.

---

## 💻 Frontend (Web) - *Prototype*

Aplikasi web pada awalnya dirancang sebagai **purwarupa (prototype)** untuk antarmuka *dashboard* administratif, manajemen data, dan analisis keuangan. 

> ⚠️ **PERINGATAN RISIKO KEHILANGAN DATA:** > Versi web sepenuhnya bergantung pada **Dexie (IndexedDB)** yang merupakan penyimpanan lokal bawaan *browser*. Membersihkan data/cache *browser*, menggunakan mode *Incognito/Private*, atau instalasi ulang *browser* akan menyebabkan **seluruh data operasional Anda terhapus permanen**.  
> *Jika Anda memutuskan untuk tetap menggunakan versi web ini, sangat disarankan untuk melakukan ekspor/backup data JSON secara rutin melalui menu Settings.*

### 🛠️ Tech Stack
* **Core:** React v19, TypeScript, Vite
* **Routing:** React Router v7
* **Styling & UI:** Tailwind CSS v4, Radix UI Primitives, Lucide React (Shadcn UI Architecture)
* **Storage:** Dexie (IndexedDB) - *Local browser storage*
* **Data Viz & Maps:** Recharts, Leaflet (React-Leaflet - *Membutuhkan internet*)
* **Utilities:** `date-fns`, `exceljs`, `file-saver`, `sonner`

### 🌟 Fitur Utama
* **📊 Dashboard:** Metrik bisnis, grafik total kunjungan, margin pendapatan 7 hari, dan riwayat kunjungan.
* **🗺️ Journey:** Peta interaktif dengan deteksi GPS otomatis untuk rute kunjungan toko.
* **📦 Produk (`/products`):** Manajemen stok gudang, barang retur, log aktivitas 30 hari, dan sistem *pricing* berjenjang (modal, grosir, eceran).
* **🏪 Toko (`/stores`):** Pencatatan data toko, deteksi lokasi GPS, status hutang, dan **Visit Wizard** 3 langkah (Opname -> Restock -> Checkout).
* **💰 Finance (`/finance`):** Laporan interaktif (Pendapatan, Piutang, Aset), ringkasan margin, dan pelacakan pembayaran.
* **⚙️ Settings:** Manajemen data *offline* (*backup/restore* JSON).

---

## 📱 Mobile (App)

Aplikasi *mobile* adalah versi yang difokuskan untuk mobilitas, performa tinggi, dan pencatatan riil di lokasi toko. Versi ini jauh lebih aman untuk operasional lapangan karena menggunakan database relasional lokal yang tangguh.

### 🛠️ Tech Stack
* **Core:** React Native, Expo (Expo Router)
* **Styling & UI:** NativeWind v4, Custom UI Primitives (*Shadcn-style*), Lucide React Native
* **State & Data:** TanStack Query, Zustand
* **Forms:** React Hook Form, Zod
* **Storage:** Expo SQLite + Drizzle ORM (Penyimpanan lokal relasional), MMKV

### 🌟 Fitur Utama
* **📈 Dashboard:** Peringatan toko *overdue*, peringatan stok kritis, dan tren grafik kunjungan.
* **🗺️ Journey (Live Map):** Peta *full-screen* dengan pelacakan GPS dinamis untuk memantau toko *overdue*.
* **📦 Produk (`/product-list`):** Pencarian katalog dan manajemen stok (gudang & retur) dengan *infinite scrolling*.
* **🏪 Operasional Toko (`/store-list`):** Detail aset konsinyasi aktif, riwayat *invoice*, dan **Visit Wizard** komprehensif (tetap bisa simpan lokasi meski offline).
* **📄 Visit Invoice:** Cetak struk via **Bluetooth Printer** dan pengiriman *invoice* digital via **WhatsApp**.
* **💰 Finance:** Agregasi keuangan interaktif (Margin, Piutang, Aset konsinyasi) dengan *date range picker*.
* **⚙️ Settings:** Ekspor/Impor *database* via Excel dan kustomisasi parameter operasional.

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Persiapan
Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di sistem Anda.
```bash
git clone <url-repositori-anda>
cd <nama-folder-repositori>
```

### 2. Menjalankan Frontend (Web)
```bash
cd frontend
npm install
npm run dev
```

### 3. Menjalankan Mobile (App)
```bash
cd mobile
npm install
npx expo start
```