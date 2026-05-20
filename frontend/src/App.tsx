import React, { useState, useEffect } from 'react';
import { 
  Store, PackageSearch, CheckSquare, Clock, 
  BarChart3, MessageCircle, Menu, X, ArrowRight, 
  ChevronRight, Activity, Zap, BookOpen, 
  MapPin, PackagePlus, Wallet, Wrench, Star,
  AlertCircle
} from 'lucide-react';

/* ==========================================================================
   TYPES
   ========================================================================== */

type User = {
  username: string;
  email?: string;
};

type AuthMode = 'login' | 'register' | null;

interface Release {
  version: string;
  date: string;
  title: string;
  isMajor: boolean;
  items: string[];
}

/* ==========================================================================
   MAIN APP
   ========================================================================== */

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<AuthMode>(null); 

  const handleAuthSuccess = (userData: User) => {
    setCurrentUser(userData);
    setAuthModal(null);
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      <Navbar onLogin={() => setAuthModal('login')} onRegister={() => setAuthModal('register')} />
      <main>
        <HeroSection onRegister={() => setAuthModal('register')} />
        <CurrentFeaturesSection />
        <GuidebookSection />
        <UpcomingFeaturesSection />
        <ChangelogSection />
        <CtaSection onRegister={() => setAuthModal('register')} />
      </main>
      <Footer />
      
      {authModal && (
        <AuthModal 
          initialMode={authModal} 
          onClose={() => setAuthModal(null)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
}

/* ==========================================================================
   DASHBOARD PLACEHOLDER
   ========================================================================== */

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-sm w-full">
        <Store className="h-12 w-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Dashboard</h2>
        <p className="text-gray-500 mb-6">Halo, {user.username}! Dashboard tidak disertakan di file ini sesuai instruksi.</p>
        <button 
          onClick={onLogout}
          className="w-full py-3 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-bold rounded-xl transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODAL AUTENTIKASI 
   ========================================================================== */

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (userData: User) => void;
}

type AuthFormData = {
  identifier?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type AuthErrors = Partial<AuthFormData>;

function AuthModal({ initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode); 
  const [formData, setFormData] = useState<AuthFormData>({ identifier: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<AuthErrors>({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AuthErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: AuthErrors = {};

    if (mode === 'register') {
      if (!formData.username) newErrors.username = "Wajib diisi.";
      else if (formData.username.length > 20) newErrors.username = "Maksimal 20 karakter.";

      if (formData.email && formData.email.length > 255) newErrors.email = "Maksimal 255 karakter.";

      if (!formData.password) newErrors.password = "Wajib diisi.";
      else if (formData.password.length < 6) newErrors.password = "Minimal 6 karakter.";
      else if (formData.password.length > 255) newErrors.password = "Maksimal 255 karakter.";

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Tidak cocok.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      onSuccess({ username: formData.username || '', email: formData.email });

    } else {
      if (!formData.identifier) newErrors.identifier = "Wajib diisi.";
      else if (formData.identifier.length > 255) newErrors.identifier = "Melebihi batas.";

      if (!formData.password) newErrors.password = "Wajib diisi.";
      else if (formData.password.length < 6) newErrors.password = "Minimal 6 karakter.";
      else if (formData.password.length > 255) newErrors.password = "Maksimal 255 karakter.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      onSuccess({ username: formData.identifier || '', email: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 sm:mb-6 text-center">
          <div className="mx-auto bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-4">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Gratis'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {mode === 'login' ? 'Kelola kembali catatan warung Anda.' : 'Mulai sistematiskan usaha titip Anda hari ini.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'login' ? (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Username / Email</label>
                <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} placeholder="Masukkan username atau email" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.identifier && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.identifier}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.password && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Username <span className="text-rose-500">*</span></label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Maks 20 karakter" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.username && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.username}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.email && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Password <span className="text-rose-500">*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.password && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Konfirmasi Password <span className="text-rose-500">*</span></label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Ulangi password" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.confirmPassword && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <button type="submit" className="w-full h-10 sm:h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-sm sm:text-base transition-colors shadow-md mt-4 sm:mt-6">
            {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm font-medium text-gray-500">
          {mode === 'login' ? (
            <>Belum punya akun? <button type="button" onClick={() => setMode('register')} className="text-rose-600 hover:underline">Daftar di sini</button></>
          ) : (
            <>Sudah punya akun? <button type="button" onClick={() => setMode('login')} className="text-rose-600 hover:underline">Masuk</button></>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   LANDING PAGE COMPONENTS 
   ========================================================================== */

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
}

function Navbar({ onLogin, onRegister }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <div className="text-rose-600"><Store className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.5} /></div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-rose-600">JuraganTitip</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#fitur" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Fitur</a>
            <a href="#panduan" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Panduan</a>
            <a href="#roadmap" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Roadmap</a>
            <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors ml-4">Masuk</button>
            <button onClick={onRegister} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">Mulai Gratis</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-rose-600 p-2 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 shadow-lg">
          <a href="#fitur" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Fitur</a>
          <a href="#panduan" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Panduan</a>
          <a href="#roadmap" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Roadmap</a>
          <hr className="border-gray-100 my-2" />
          <button onClick={onLogin} className="w-full text-left px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Masuk</button>
          <button onClick={onRegister} className="w-full mt-2 bg-rose-600 text-white px-4 py-3.5 rounded-full text-base font-semibold text-center shadow-sm">Mulai Gratis</button>
        </div>
      )}
    </nav>
  );
}

interface HeroSectionProps {
  onRegister: () => void;
}

function HeroSection({ onRegister }: HeroSectionProps) {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Activity className="h-4 w-4" /><span>Sistem Manajemen Titip Warung</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
          Sistematiskan Bisnis <br className="hidden sm:block" /> Titip Barang Anda.
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Catat stok, pantau tagihan lunas/bon, dan hitung keuntungan per warung dalam satu layar yang ringkas dan bebas pusing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRegister} className="w-full sm:w-auto h-12 md:h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            Mulai Pencatatan <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#panduan" className="w-full sm:w-auto h-12 md:h-14 px-8 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 rounded-full font-bold text-base transition-colors flex items-center justify-center">
            Baca Panduan
          </a>
        </div>
      </div>
    </section>
  );
}

function CurrentFeaturesSection() {
  const features = [
    { icon: <PackageSearch />, title: "Data Produk & Pemetaan Warung", desc: "Kelola daftar produk beserta rincian jumlah stoknya, serta pantau di warung mana saja barang tersebut didistribusikan dalam satu database terpusat." },
    { icon: <CheckSquare />, title: "Tagihan Piutang & Kalkulasi Laba", desc: "Tandai otomatis warung yang masih berstatus bon atau sudah lunas. Sistem akan langsung merekap margin keuntungan bersih Anda pada periode tersebut." },
    { icon: <Clock />, title: "Penjadwalan Restock Otomatis", desc: "Tidak ada lagi warung yang terlewat. Atur tanggal pengiriman terakhir dan sistem akan mengingatkan jadwal penarikan barang kadaluarsa atau restock." },
  ];

  return (
    <section id="fitur" className="pt-12 pb-12 md:pb-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">Operasional Lapangan Lebih Terukur</h2>
          <p className="text-base text-gray-600 max-w-2xl">Modul inti yang dirancang seringkas mungkin agar input data bisa dilakukan dengan cepat dari HP saat Anda sedang berada di lapangan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-rose-100 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-rose-100 flex items-center justify-center text-rose-600">{React.cloneElement(feat.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}</div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">{feat.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidebookSection() {
  const steps = [
    { icon: <MapPin />, title: "1. Daftarkan Titik Warung", desc: "Masukkan nama warung dan lokasi. Anda hanya perlu melakukan ini sekali di awal kerja sama." },
    { icon: <PackagePlus />, title: "2. Input Barang Titipan", desc: "Pilih produk, masukkan jumlah yang dititipkan, dan tentukan harga dasar serta harga jual." },
    { icon: <Wallet />, title: "3. Pantau & Tarik Laba", desc: "Saat jadwal restock tiba, perbarui sisa barang. Sistem otomatis menghitung uang yang harus ditagih." }
  ];

  return (
    <section id="panduan" className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full mb-4">
            <BookOpen className="h-4 w-4 text-rose-600" /><span className="text-xs font-bold uppercase tracking-widest text-rose-600">Buku Panduan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">3 Langkah Mudah Memulai</h2>
          <p className="text-base text-gray-600">Tidak butuh waktu lama untuk memindahkan catatan manual Anda. Prosesnya kami buat sesederhana mungkin.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-200">{React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "h-7 w-7" })}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingFeaturesSection() {
  const upcoming = [
    { icon: <BarChart3 />, title: "Analitik Data & Pencarian Lanjutan", desc: "Visualisasi metrik tren performa warung terbaik dan pencarian riwayat data menggunakan kombinasi filter yang spesifik." },
    { icon: <MessageCircle />, title: "Automasi WhatsApp & Export Excel", desc: "Kirim rincian tagihan ke pemilik warung via WA dengan sekali klik, dan unduh rekapitulasi data format XLSX untuk pembukuan eksternal." },
  ];

  return (
    <section id="roadmap" className="py-12 md:py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-3 block">Roadmap Mendatang</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900">Persiapan Skala Besar</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Kami sedang menyiapkan fitur-fitur ini agar aplikasi tidak hanya menjadi buku catatan, tetapi juga asisten bisnis proaktif Anda.</p>
          </div>
          <div className="flex flex-col gap-4">
            {upcoming.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 md:p-6 rounded-3xl border border-gray-100 hover:border-rose-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}</div>
                <div>
                  <h4 className="text-base font-bold mb-2 text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const changelogData: Release[] = [
  { version: "v1.0.0", date: "19 Mei 2026", title: "Rilis Publik Perdana (MVP)", isMajor: true, items: ["Peluncuran resmi sistem untuk wirausaha skala kecil & menengah.", "Penambahan fitur pengingat jadwal penarikan otomatis.", "Perbaikan UI/UX berdasarkan masukan dari tahap Beta."] },
  { version: "v0.9.5", date: "5 Mei 2026", title: "Optimalisasi Kalkulasi & Kecepatan", isMajor: false, items: ["Memperbaiki bug pembulatan desimal pada kalkulasi margin laba.", "Meningkatkan kecepatan muat (loading) data warung hingga 40%.", "Penyesuaian responsivitas layout untuk perangkat layar kecil."] },
  { version: "v0.9.0", date: "15 April 2026", title: "Sistem Keuangan & Tagihan", isMajor: true, items: ["Modul penandaan tagihan (Bon/Lunas) untuk setiap titik warung.", "Kalkulator otomatis untuk menghitung laba kotor & bersih.", "Penambahan ringkasan kas (summary) di dashboard utama."] },
  { version: "v0.8.5", date: "28 Maret 2026", title: "Dukungan Mode Cache", isMajor: false, items: ["Sistem kini menyimpan data sementara (cache) agar tetap bisa dibuka meski sinyal internet lemah di lapangan.", "Memperbaiki isu gagal simpan koordinat map warung."] },
  { version: "v0.8.0", date: "10 Maret 2026", title: "Versi Beta Internal", isMajor: true, items: ["Pembuatan modul awal: database pendaftaran lokasi warung.", "Manajemen inventaris (input nama, harga, dan kuantitas produk).", "Sinkronisasi data multi-perangkat via Cloud dasar."] }
];

function ChangelogSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const majorReleases = changelogData.filter(release => release.isMajor).slice(0, 3);

  return (
    <section id="changelog" className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Riwayat Pengembangan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {majorReleases.map((release, index) => (
            <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
              <div className="mb-4 pb-4 border-b border-gray-200/60 relative z-10">
                <span className="block text-xs font-semibold text-gray-500 mb-2">{release.date}</span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{release.title}</h3>
              </div>
              <ul className="space-y-2.5 mt-auto relative z-10">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div><span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-10 text-center">
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full font-bold text-sm transition-colors">
            Lihat Seluruh Catatan Rilis <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isModalOpen && <ChangelogModal releases={changelogData} onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}

interface ChangelogModalProps {
  releases: Release[];
  onClose: () => void;
}

function ChangelogModal({ releases, onClose }: ChangelogModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 sm:px-8 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Seluruh Catatan Versi</h3>
            <p className="text-sm text-gray-500 mt-1">Riwayat pembaruan sistem secara lengkap.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8">
          {releases.map((release, index) => (
            <div key={index} className="relative pl-6 sm:pl-8">
              {index !== releases.length - 1 && <div className="absolute left-[7px] sm:left-[11px] top-8 bottom-[-2rem] w-0.5 bg-gray-100"></div>}
              <div className={`absolute left-0 sm:left-1 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${release.isMajor ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg font-bold text-gray-900">{release.version}</span>
                {!release.isMajor && <span className="p-1.5 bg-gray-100 text-gray-500 rounded-md flex items-center" title="Rilis Minor"><Wrench className="h-3.5 w-3.5" /></span>}
                {release.isMajor && <span className="p-1.5 bg-rose-50 text-rose-600 rounded-md flex items-center" title="Rilis Mayor"><Star className="h-3.5 w-3.5" /></span>}
                <span className="text-sm font-medium text-gray-500 ml-auto">{release.date}</span>
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-3">{release.title}</h4>
              <ul className="space-y-2">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></div><span className="text-sm leading-relaxed">{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-[2rem] text-center shrink-0">
          <p className="text-xs text-gray-500 font-medium">Anda sedang melihat riwayat hingga versi v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

interface CtaSectionProps {
  onRegister: () => void;
}

function CtaSection({ onRegister }: CtaSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-rose-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Zap className="h-10 w-10 mx-auto mb-6 text-rose-200" />
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Tinggalkan Cara Manual.</h2>
        <p className="text-lg md:text-xl text-rose-100 mb-8 md:mb-10 max-w-xl mx-auto">Mulai kendalikan penuh distribusi barang Anda sekarang. Pendaftaran gratis dan langsung bisa digunakan.</p>
        <button onClick={onRegister} className="h-14 px-10 bg-white hover:bg-gray-50 text-rose-600 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
          Buat Akun Gratis
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-rose-600" />
          <span className="font-bold text-base tracking-tight text-gray-900">JuraganTitip</span>
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JuraganTitip. Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-500">
          <a href="#" className="hover:text-rose-600 transition-colors">Bantuan</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Privasi</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Syarat Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
