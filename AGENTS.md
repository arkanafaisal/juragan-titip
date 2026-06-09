# AI Agent Rules & Project Guidelines (React Native)

## 1. PROJECT CONTEXT & MINDSET
- **Web-to-Mobile Conversion:** Proyek ini adalah konversi aplikasi *mobile* dari prototipe web (berada di referensi folder `frontend`).
- **Do NOT 1-to-1 Copy:** Jangan menyalin kode React DOM/Web secara mentah. Pola di web (seperti manipulasi DOM, tag HTML, atau web storage/IndexedDB) seringkali tidak efisien atau tidak didukung di *mobile*. Adaptasikan logika web menjadi *best practice* ekosistem React Native.
- **Mobile First Performance:** Utamakan performa *mobile*. Gunakan 60fps *animations* di *UI thread*, hindari *re-renders* tidak perlu, dan gunakan penyimpanan *native*.

## 2. TECH STACK USAGE (Kapan, Kenapa, Bagaimana)

- **Expo Router**
  - **Kapan:** Setiap penambahan layar (*screen*) baru atau alur navigasi.
  - **Kenapa:** Menstandarkan navigasi menjadi berbasis file (*file-based routing*), menghindari kerumitan konfigurasi rute manual.
  - **Bagaimana:** Buat file di dalam folder `app/`. Gunakan `Link` dari `expo-router` untuk navigasi deklaratif, atau `router.push()` untuk navigasi imperatif.

- **NativeWind v4**
  - **Kapan:** Menata letak (*layouting*) dan memberikan gaya (styling) pada semua komponen visual.
  - **Kenapa:** Menjaga konsistensi gaya dengan versi prototipe web yang menggunakan Tailwind.
  - **Bagaimana:** Gunakan atribut `className` pada komponen React Native (View, Text, Pressable). Jangan gunakan `StyleSheet.create` kecuali untuk kasus *edge-case* animasi tingkat rendah.

- **React-Native-Reusables & Lucide Icons**
  - **Kapan:** Membutuhkan komponen *UI primitif* (Button, Input, Modal, Sheet) atau ikon.
  - **Kenapa:** Mencegah pembuatan komponen dasar dari nol dan memastikan aksesibilitas (A11y) serta konsistensi desain standar.
  - **Bagaimana:** Panggil komponen dari folder `components/ui/`. Jangan modifikasi file internal komponen ini kecuali diminta.

- **TanStack Query (@tanstack/react-query)**
  - **Kapan:** Melakukan *fetch*, *post*, sinkronisasi, dan memperbarui *Server State* (data dari API).
  - **Kenapa:** Mengelola *caching*, status *loading/error*, dan *deduplication* secara otomatis tanpa `useState` dan `useEffect` yang bertele-tele.
  - **Bagaimana:** Buat *custom hooks* (misal: `useGetProducts`) di layer Controller/API. Jangan pernah melakukan `fetch` API langsung di dalam file komponen View UI.

- **Zustand**
  - **Kapan:** Mengelola *Client State* global (misal: status *sidebar*, preferensi filter *user* sementara).
  - **Kenapa:** Ringan, minim *boilerplate*, dan tidak menyebabkan *wrapper hell* seperti React Context.
  - **Bagaimana:** Buat *store* kecil yang spesifik per fitur (misal: `useCartStore`). Jangan masukkan data API ke dalam Zustand.

- **React Hook Form + Zod**
  - **Kapan:** Menangani semua input formulir (*form*) dari *user*.
  - **Kenapa:** Mencegah *re-render* pada setiap ketikan (RHF) dan memastikan validasi struktur data ketat/aman sebelum dikirim atau disimpan (Zod).
  - **Bagaimana:** Definisikan skema Zod di layer Model. Gunakan `useForm` bersama `@hookform/resolvers/zod` di layer Controller/View.

- **Expo SQLite + Drizzle ORM & MMKV**
  - **Kapan:** Menyimpan data secara lokal. 
  - **Kenapa:** MMKV sangat cepat untuk data *key-value* sinkron (token, tema). SQLite+Drizzle digunakan untuk data relasional/terstruktur sebagai pengganti IndexedDB/Dexie dari versi web.
  - **Bagaimana:** Gunakan MMKV untuk preferensi ringan. Gunakan Drizzle (dengan skema yang di-define di layer Model) untuk melakukan *query* ke SQLite.

## 3. ARCHITECTURE: MVC FOR REACT NATIVE (Feature-Sliced)
Arsitektur menggunakan pola Model-View-Controller (MVC) yang diadaptasi ke dalam struktur folder *mobile*:

- **M - Models (`schemas/`, `types/`, `db/`)**
  - **Fungsi:** Sumber kebenaran struktur data.
  - **Isi:** Skema validasi Zod, skema *database* Drizzle, antarmuka (*interface*) TypeScript untuk balasan API.
  
- **C - Controllers (`hooks/`, `api/`, `store/`)**
  - **Fungsi:** Menangani logika bisnis, jembatan antara View dan Model/Data.
  - **Isi:** *Custom hooks* (TanStack Query), logika formulir RHF, fungsi pembantu (*utils*), status *Zustand*, dan eksekusi rute API.
  - **Aturan:** View tidak boleh memiliki logika kompleks. Logika harus diekstraksi ke layer Controller ini.

- **V - Views (`app/`, `components/`)**
  - **Fungsi:** Presentasi visual.
  - **Isi:** Layar navigasi di `app/` dan komponen terisolasi di `components/`.
  - **Aturan:** *Dumb components*. Hanya menerima *props*, merender UI, dan memanggil fungsi *action* dari Controller.

## 4. AGENT CODING RULES & BEHAVIORS

- **Direct File Editing Only:** Semua modifikasi, penambahan, atau penghapusan isi kode harus dilakukan dengan mengedit file secara langsung menggunakan kapabilitas internal *agent*.
- **No Terminal Code Manipulation:** Dilarang keras menggunakan perintah terminal (seperti `sed`, `awk`, `echo`, atau *bulk replace*) untuk memanipulasi kode. Terminal HANYA boleh digunakan untuk menjalankan *scripts* (misal: `npm run`, `npx`), menginstal *package*, atau membuat *file/folder* baru.
- **No Comments Rule:** Jangan PERNAH menambahkan, menghapus, atau memodifikasi komentar dalam baris kode (*inline/block comments*) kecuali diminta secara eksplisit. Tulis kode yang cukup ekspresif (*self-documenting*).
- **Format Output & Diff:** Kembalikan perubahan kode dalam format Git Diff. Jika hanya memodifikasi blok tertentu, sertakan kode *surrounding* yang cukup (misal keseluruhan *parent block* seperti fungsi, struktur tag HTML/JSX secara lengkap, dsb) untuk menunjukkan konteks struktural tanpa menulis ulang seluruh file secara utuh. Gabungkan modifikasi terdekat menjadi satu blok *diff* jika memungkinkan. Jangan mengubah *whitespace* atau karakter yang tidak relevan dengan konteks perbaikan.
- **Intent-based Spacing (Blank Lines):** Gunakan satu baris kosong (ENTER) untuk memisahkan blok logika yang memiliki *intent* (tujuan) berbeda di dalam fungsi. Contoh: Pisahkan blok destrukturisasi variabel, blok inisialisasi *hooks*, blok kondisi penjaga (*guard clauses*), dan blok *return*.
- **Line Breaking Rules:** - Gunakan *1-line* (satu baris) hanya untuk kondisi sederhana (misal: *early return* tanpa *wrapper*, fungsi satu baris, atau objek dengan maksimum 2 properti pendek).
  - Paksa menjadi *multi-line* untuk objek kompleks, tag JSX dengan lebih dari 2 atribut (*props*), atau pemanggilan fungsi dengan parameter panjang, guna menjaga keterbacaan (hindari *horizontal scrolling*).
- **Abort on Missing Context:** Hentikan atau batalkan instruksi secepatnya dan laporkan, jika *file*, dependensi, atau *input* yang dibutuhkan untuk mengeksekusi logika ternyata tidak tersedia secara utuh dalam konteks. Jangan pernah mengasumsikan atau melanjutkan dengan data parsial.