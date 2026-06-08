import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  ChevronDown, 
  ChevronUp, 
  Package, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Save,
  Store,
  RefreshCw
} from "lucide-react";
import { settingsApi } from "@/services/api/settings";
import { backupApi } from "@/services/api/backup";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { VALIDATION_RULES } from "@/lib/validation-rules";
import { SectionCard } from "@/components/shared/section-card";

export default function SettingsPage() {
  const [searchParams] = useSearchParams();

  // --- ACCORDION STATE ---
  const [openSection, setOpenSection] = useState<string>(searchParams.get("section") || 'tampilan');

  useEffect(() => {
    const section = searchParams.get("section");
    const focusId = searchParams.get("focus");
    if (section) {
      setOpenSection(section);
      // Tunggu DOM merender accordion yang baru terbuka
      setTimeout(() => {
        let elId = `section-${section}`;
        if (focusId) elId = focusId;
        const el = document.getElementById(elId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100; // offset 100px agar judul tab tidak tertutup header
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? '' : section);
  };

  // --- FORM SETTINGS STATE (Local) ---
  // Nantinya bisa Anda hubungkan ke localStorage atau tabel 'settings' di Dexie
  // const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(settingsApi.getLowStockThreshold());
  const [categoryLabels, setCategoryLabels] = useState(settingsApi.getCategoryLabels());
  const [storeCategoryLabels, setStoreCategoryLabels] = useState(settingsApi.getStoreCategoryLabels());
  const [storeOverdueDays, setStoreOverdueDays] = useState<number | string>(settingsApi.getStoreOverdueDays());
  // const [quickPayNominals, setQuickPayNominals] = useState<string>("20000, 50000, 100000");
  // const [waFooterMsg, setWaFooterMsg] = useState<string>("Terima kasih! Pembayaran via transfer bisa ke BCA 12345678 a.n Juragan Titip.");

  // --- MODAL STATE ---
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetSettingsModalOpen, setIsResetSettingsModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS (Mock) ---
  const handleSaveSettings = () => {
    let threshold = Number(lowStockThreshold);
    if (isNaN(threshold) || threshold < VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MIN || threshold > VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MAX) {
      toast.error(`Batas stok menipis harus antara ${VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MIN} - ${VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MAX}`);
      return;
    }

    const isCategoryInvalid = Object.values(categoryLabels).some(val => val.trim().length < VALIDATION_RULES.SETTINGS.CATEGORY_MIN || val.trim().length > VALIDATION_RULES.SETTINGS.CATEGORY_MAX);
    if (isCategoryInvalid) {
      toast.error(`Nama kategori produk harus antara ${VALIDATION_RULES.SETTINGS.CATEGORY_MIN} - ${VALIDATION_RULES.SETTINGS.CATEGORY_MAX} karakter`);
      return;
    }

    const isStoreCategoryInvalid = Object.values(storeCategoryLabels).some(val => val.trim().length < VALIDATION_RULES.SETTINGS.CATEGORY_MIN || val.trim().length > VALIDATION_RULES.SETTINGS.CATEGORY_MAX);
    if (isStoreCategoryInvalid) {
      toast.error(`Nama kategori toko harus antara ${VALIDATION_RULES.SETTINGS.CATEGORY_MIN} - ${VALIDATION_RULES.SETTINGS.CATEGORY_MAX} karakter`);
      return;
    }
    let overdueDays = Number(storeOverdueDays);
    if (isNaN(overdueDays) || overdueDays < VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MIN || overdueDays > VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MAX) {
      toast.error(`Batas hari belum dikunjungi harus antara ${VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MIN} - ${VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MAX}`);
      return;
    }

    settingsApi.updateLowStockThreshold(threshold);
    settingsApi.updateCategoryLabels(categoryLabels);
    settingsApi.updateStoreCategoryLabels(storeCategoryLabels);
    settingsApi.updateStoreOverdueDays(overdueDays);
    setLowStockThreshold(threshold);
    setStoreOverdueDays(overdueDays);
    toast.success("Pengaturan berhasil disimpan!");
  };

  const handleResetSettings = () => {
    setIsResetSettingsModalOpen(true);
  };

  const handleResetSettingsConfirm = () => {
    settingsApi.resetSettings();
    setLowStockThreshold(settingsApi.getLowStockThreshold());
    setCategoryLabels(settingsApi.getCategoryLabels());
    setStoreCategoryLabels(settingsApi.getStoreCategoryLabels());
    setStoreOverdueDays(settingsApi.getStoreOverdueDays());
    toast.success("Pengaturan berhasil dikembalikan ke bawaan!");
    setIsResetSettingsModalOpen(false);
  };

  const handleExportBackup = async () => {
    setIsBackupLoading(true);
    toast.info("Mempersiapkan file Excel...");
    try {
      await backupApi.exportDatabaseExcel();
      toast.success("Backup Excel berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal melakukan backup data.");
    } finally {
      setIsBackupLoading(false);
    }
  };

  /*
  const handleImportBackup = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm("Restore akan MENIMPA semua data saat ini. Apakah Anda yakin?")) {
      setIsBackupLoading(true);
      toast.info("Memproses file backup...");
      try {
        await backupApi.importFromJson(file);
        toast.success("Data berhasil direstore! Memuat ulang...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error("Gagal melakukan restore. Pastikan file backup valid.");
      } finally {
        setIsBackupLoading(false);
      }
    }
    
    // Reset input agar bisa pilih file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  */

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

      <div className="space-y-sm">

        {/* SECTION 1: TAMPILAN APLIKASI */}
        {/* <div id="section-tampilan" className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
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
        </div> */}

        {/* SECTION: PENGATURAN PRODUK */}
        <SectionCard id="section-produk" className="transition-all">
          <button 
            onClick={() => toggleSection('produk')}
            className="w-full flex justify-between items-center bg-surface-container-low hover:bg-surface-bright rounded-xl transition-colors"
          >
            <span className="font-h2 text-h2 font-bold text-text-primary flex items-center gap-sm">
              <Package className="w-5 h-5 text-primary" /> Pengaturan Produk
            </span>
            {openSection === 'produk' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'produk' && (
            <div className="pt-4 mt-4 border-t border-outline-variant space-y-md animate-in slide-in-from-top-2">
              
              <div>
                <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                  Batas Peringatan Stok Menipis (Gudang)
                </label>
                <input 
                  type="number" 
                  min={VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MIN}
                  max={VALIDATION_RULES.SETTINGS.STOCK_THRESHOLD_MAX}
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-3 py-3 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                />
                <p className="font-caption text-caption text-text-secondary mt-1">
                  *Produk dengan stok di bawah angka ini akan ditandai warna merah/kritis.
                </p>
              </div>

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
                        minLength={VALIDATION_RULES.SETTINGS.CATEGORY_MIN}
                        maxLength={VALIDATION_RULES.SETTINGS.CATEGORY_MAX}
                        className="flex-1 px-3 py-2 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <p className="font-caption text-caption text-text-secondary mt-2">
                  *Ubah nama kategori di atas sesuai dengan lini bisnis toko Anda. Nama ini akan muncul di form Produk.
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* SECTION: PENGATURAN TOKO */}
        <SectionCard id="section-toko" className="transition-all">
          <button 
            onClick={() => toggleSection('toko')}
            className="w-full flex justify-between items-center bg-surface-container-low hover:bg-surface-bright rounded-xl transition-colors"
          >
            <span className="font-h2 text-h2 font-bold text-text-primary flex items-center gap-sm">
              <Store className="w-5 h-5 text-primary" /> Pengaturan Toko
            </span>
            {openSection === 'toko' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'toko' && (
            <div className="pt-4 mt-4 border-t border-outline-variant space-y-md animate-in slide-in-from-top-2">
              <div>
                <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                  Batas Peringatan Belum Dikunjungi (Hari)
                </label>
                <input 
                  type="number" 
                  min={VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MIN}
                  max={VALIDATION_RULES.SETTINGS.OVERDUE_DAYS_MAX}
                  value={storeOverdueDays}
                  onChange={(e) => setStoreOverdueDays(e.target.value)}
                  className="w-full px-3 py-3 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                />
                <p className="font-caption text-caption text-text-secondary mt-1">
                  *Toko yang belum dikunjungi lebih dari angka ini (maks 300) bisa difilter di Daftar Toko.
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant">
                <label className="font-body-sm text-body-sm font-bold text-text-primary block mb-3">
                  Label Kategori Toko (1 - 5)
                </label>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex items-center gap-3">
                      <span className="font-mono bg-surface-container-low px-3 py-2 rounded-lg text-text-secondary font-bold w-12 text-center border border-outline-variant">
                        {num}
                      </span>
                      <input 
                        type="text" 
                        value={storeCategoryLabels[num.toString() as keyof typeof storeCategoryLabels]}
                        onChange={(e) => setStoreCategoryLabels(prev => ({...prev, [num.toString()]: e.target.value}))}
                        placeholder={`Kategori Toko ${num}`}
                        minLength={VALIDATION_RULES.SETTINGS.CATEGORY_MIN}
                        maxLength={VALIDATION_RULES.SETTINGS.CATEGORY_MAX}
                        className="flex-1 px-3 py-2 bg-surface border border-outline text-text-primary font-body text-body focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <p className="font-caption text-caption text-text-secondary mt-2">
                  *Ubah nama kategori toko untuk mempermudah filter di daftar toko.
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* SECTION: KASIR & TRANSAKSI */}
        {/* <div id="section-transaksi" className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
          <button 
            onClick={() => toggleSection('transaksi')}
            className="w-full flex justify-between items-center p-md bg-surface-container-low hover:bg-surface-bright transition-colors"
          >
            <span className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-sm">
              <CircleDollarSign className="w-5 h-5 text-primary" /> Kasir & Transaksi
            </span>
            {openSection === 'transaksi' ? <ChevronUp className="w-5 h-5 text-text-secondary"/> : <ChevronDown className="w-5 h-5 text-text-secondary"/>}
          </button>
          
          {openSection === 'transaksi' && (
            <div className="p-md border-t border-outline-variant bg-surface space-y-md animate-in slide-in-from-top-2">
              <div>
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
        </div> */}

        {/* SECTION 3: NOTA & WHATSAPP */}
        {/* <div id="section-whatsapp" className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all">
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
        </div> */}

        {/* TOMBOL SIMPAN PENGATURAN UMUM */}
        <button 
          onClick={handleSaveSettings}
          className="w-full mt-4 bg-primary text-on-primary font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>


        {/* SECTION 4: MANAJEMEN DATA (DANGER ZONE) */}
        <SectionCard className="mt-8">
          <h2 className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-2 mb-md">
            <Database className="w-5 h-5 text-text-secondary" /> Manajemen Data (Offline)
          </h2>
          
          <div className="space-y-sm">
            <button 
              onClick={handleResetSettings}
              className="w-full bg-surface border border-outline-variant text-text-primary hover:bg-surface-container-low font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-4"
            >
              <RefreshCw className="w-5 h-5" /> Kembalikan Pengaturan ke Bawaan
            </button>

            <button 
              onClick={handleExportBackup}
              disabled={isBackupLoading}
              className="w-full bg-surface border border-primary text-primary hover:bg-primary/10 font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" /> Backup Data ke File (Excel)
            </button>
            
            {/*
            <button 
              onClick={handleImportBackup}
              disabled={isBackupLoading}
              className="w-full bg-surface border border-outline-variant text-text-primary hover:bg-surface-container-low font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" /> Pulihkan dari File Backup
            </button>
            <input 
              type="file" 
              accept=".json,application/json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            */}

            {/* ZONA BERBAHAYA */}
            <SectionCard className="!bg-error/10 !border-error/30 mt-md">
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
            </SectionCard>
          </div>
        </SectionCard>

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

      <ConfirmationModal
        isOpen={isResetSettingsModalOpen}
        onClose={() => setIsResetSettingsModalOpen(false)}
        onConfirm={() => handleResetSettingsConfirm()}
        title="Kembalikan Pengaturan"
        description="Apakah Anda yakin ingin mengembalikan semua preferensi dan pengaturan ke nilai bawaan pabrik?"
        confirmText="Ya, Kembalikan"
        isDanger={false}
      />
    </div>
  );
}