import { useState } from "react";
import { toast } from "sonner";
import { 
  Settings as GearIcon, 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  Package, 
  MessageCircle, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Save
} from "lucide-react";
import { settingsApi } from "@/services/api/settings";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

export default function SettingsPage() {
  // --- ACCORDION STATE ---
  const [openSection, setOpenSection] = useState<string>('tampilan');

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? '' : section);
  };

  // --- FORM SETTINGS STATE (Local) ---
  // Nantinya bisa Anda hubungkan ke localStorage atau tabel 'settings' di Dexie
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(settingsApi.getLowStockThreshold());
  const [categoryLabels, setCategoryLabels] = useState(settingsApi.getCategoryLabels());
  const [quickPayNominals, setQuickPayNominals] = useState<string>("20000, 50000, 100000");
  const [waFooterMsg, setWaFooterMsg] = useState<string>("Terima kasih! Pembayaran via transfer bisa ke BCA 12345678 a.n Juragan Titip.");

  // --- MODAL STATE ---
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // --- HANDLERS (Mock) ---
  const handleSaveSettings = () => {
    let threshold = Number(lowStockThreshold);
    if (isNaN(threshold) || threshold < 0) {
      threshold = 0;
    }
    settingsApi.updateLowStockThreshold(threshold);
    settingsApi.updateCategoryLabels(categoryLabels);
    setLowStockThreshold(threshold);
    toast.success("Pengaturan berhasil disimpan!");
  };

  const handleExportBackup = () => {
    toast.info("Mendownload file backup.csv...");
  };

  const handleImportBackup = () => {
    toast.info("Membuka file picker untuk restore...");
  };

  const handleResetDataClick = () => {
    setIsResetModalOpen(true);
  };

  const handleResetDataConfirm = async () => {
    setIsResetting(true);
    try {
      await settingsApi.clearAllData();
      toast.success("Semua data berhasil dihapus permanen");
      setIsResetModalOpen(false);
    } catch (error) {
      console.error("Gagal mereset data:", error);
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      {/* HEADER */}
      <div className="mb-md">
        <h1 className="font-h1 text-h1 font-bold text-text-primary flex items-center gap-xs">
          <GearIcon className="w-6 h-6 text-primary" /> Pengaturan
        </h1>
        <p className="font-body text-body text-text-secondary mt-1">
          Sesuaikan aplikasi Juragan Titip dengan gaya kerja Anda.
        </p>
      </div>

      <div className="space-y-sm">

        {/* SECTION 1: TAMPILAN APLIKASI */}
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
          <button 
            onClick={() => toggleSection('tampilan')}
            className="w-full flex justify-between items-center p-md bg-surface-container-low hover:bg-surface-bright transition-colors"
          >
            <span className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-sm">
              <Palette className="w-5 h-5 text-primary" /> Tema Tampilan
            </span>
            {openSection === 'tampilan' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'tampilan' && (
            <div className="p-md border-t border-outline-variant bg-surface animate-in slide-in-from-top-2">
              <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-2">
                Pilih Tema:
              </label>
              {/* Segmented Control untuk Radio Button */}
              <div className="flex p-1 bg-surface-container-low rounded-lg border border-outline-variant">
                {['terang', 'gelap', 'sistem'].map((mode) => {
                  const val = mode === 'terang' ? 'light' : mode === 'gelap' ? 'dark' : 'system';
                  const isActive = theme === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setTheme(val)}
                      className={`flex-1 font-body text-body py-2 rounded-md font-medium transition-all ${
                        isActive 
                          ? 'bg-surface shadow-sm text-text-primary border border-outline-variant' 
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: OPERASIONAL & STOK */}
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
          <button 
            onClick={() => toggleSection('operasional')}
            className="w-full flex justify-between items-center p-md bg-surface-container-low hover:bg-surface-bright transition-colors"
          >
            <span className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-sm">
              <Package className="w-5 h-5 text-primary" /> Operasional & Stok
            </span>
            {openSection === 'operasional' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'operasional' && (
            <div className="p-md border-t border-outline-variant bg-surface space-y-md animate-in slide-in-from-top-2">
              
              {/* Input: Number */}
              <div>
                <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                  Batas Peringatan Stok Menipis (Gudang)
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-3 py-3 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                />
                <p className="font-caption text-caption text-text-secondary mt-1">
                  *Produk dengan stok di bawah angka ini akan ditandai warna merah/kritis.
                </p>
              </div>

              {/* Input: Category Labels */}
              <div className="pt-2 border-t border-outline-variant">
                <label className="font-body-sm text-body-sm font-bold text-text-primary block mb-3">
                  Label Kategori Produk (1 - 5)
                </label>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex items-center gap-3">
                      <span className="font-mono bg-surface-container-low px-3 py-2 rounded-lg text-text-secondary font-bold w-12 text-center border border-outline-variant">
                        {num}
                      </span>
                      <input 
                        type="text" 
                        value={categoryLabels[num.toString() as keyof typeof categoryLabels]}
                        onChange={(e) => setCategoryLabels(prev => ({...prev, [num.toString()]: e.target.value}))}
                        placeholder={`Kategori ${num}`}
                        className="flex-1 px-3 py-2 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <p className="font-caption text-caption text-text-secondary mt-2">
                  *Ubah nama kategori di atas sesuai dengan lini bisnis toko Anda. Nama ini akan muncul di form Produk.
                </p>
              </div>

              {/* Input: String (Comma Separated) */}
              <div className="pt-2 border-t border-outline-variant">
                <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                  Saran Nominal Cepat (Pisahkan dengan koma)
                </label>
                <input 
                  type="text" 
                  value={quickPayNominals}
                  onChange={(e) => setQuickPayNominals(e.target.value)}
                  placeholder="Contoh: 10000, 20000, 50000"
                  className="w-full px-3 py-3 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                />
                <p className="font-caption text-caption text-text-secondary mt-1">
                  *Akan muncul sebagai tombol bantuan saat Checkout Tagihan.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* SECTION 3: NOTA & WHATSAPP */}
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
          <button 
            onClick={() => toggleSection('whatsapp')}
            className="w-full flex justify-between items-center p-md bg-surface-container-low hover:bg-surface-bright transition-colors"
          >
            <span className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-sm">
              <MessageCircle className="w-5 h-5 text-success" /> Nota & WhatsApp
            </span>
            {openSection === 'whatsapp' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'whatsapp' && (
            <div className="p-md border-t border-outline-variant bg-surface animate-in slide-in-from-top-2">
              {/* Input: Textarea */}
              <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                Pesan Penutup Struk WA
              </label>
              <textarea 
                rows={3}
                value={waFooterMsg}
                onChange={(e) => setWaFooterMsg(e.target.value)}
                placeholder="Tulis ucapan terima kasih atau info rekening bank di sini..."
                className="w-full px-3 py-3 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all resize-none"
              />
              <p className="font-caption text-caption text-text-secondary mt-1">
                *Otomatis disisipkan di bagian bawah pesan WhatsApp Anda.
              </p>
            </div>
          )}
        </div>

        {/* TOMBOL SIMPAN PENGATURAN UMUM */}
        <button 
          onClick={handleSaveSettings}
          className="w-full mt-4 bg-primary text-on-primary font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>


        {/* SECTION 4: MANAJEMEN DATA (DANGER ZONE) */}
        <div className="mt-xl pt-lg border-t-2 border-dashed border-outline-variant">
          <h2 className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-2 mb-md">
            <Database className="w-5 h-5 text-text-secondary" /> Manajemen Data (Offline)
          </h2>
          
          <div className="space-y-sm">
            <button 
              onClick={handleExportBackup}
              className="w-full bg-surface border border-primary text-primary hover:bg-primary/10 font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" /> Backup Data ke File (CSV)
            </button>
            
            <button 
              onClick={handleImportBackup}
              className="w-full bg-surface border border-outline-variant text-text-primary hover:bg-surface-container-low font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" /> Restore dari File Backup
            </button>

            {/* ZONA BERBAHAYA */}
            <div className="bg-error/10 border border-error/30 rounded-xl p-md mt-md">
              <h3 className="font-body text-body font-bold text-error mb-1">Zona Berbahaya</h3>
              <p className="font-caption text-caption text-error/80 mb-3">
                Aksi ini akan menghapus permanen seluruh riwayat toko, hutang, dan produk dari HP ini. Pastikan Anda sudah melakukan Backup.
              </p>
              <button 
                onClick={handleResetDataClick}
                className="w-full bg-surface border border-error text-error hover:bg-error hover:text-on-error font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-5 h-5" /> Reset & Hapus Semua Data
              </button>
            </div>
          </div>
        </div>

      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => handleResetDataConfirm()}
        title="Reset & Hapus Semua Data"
        description="Peringatan keras! Tindakan ini akan menghapus PERMANEN seluruh riwayat toko, hutang, produk, dan riwayat kunjungan dari perangkat ini. Pastikan Anda sudah membackup data Anda."
        isDanger={true}
        confirmText="Ya, Hapus Semua"
        isLoading={isResetting}
        verificationText="SAYA YAKIN HAPUS SEMUA DATA"
        verificationLabel={
          <>Ketik persis <span className="font-bold text-text-primary select-none">SAYA YAKIN HAPUS SEMUA DATA</span> untuk konfirmasi hapus total:</>
        }
      />
    </div>
  );
}