import { visitApi } from "@/services/api/visits";
import { ArrowLeft, MessageCircle, Printer, Store, Receipt } from "lucide-react";
import { storeApi } from "@/services/api/stores";
import type { Visit } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { profileService } from "@/services/profile";


interface InvoiceDetailProps {
  id: number;
  onBack: () => void;
}

export function InvoiceDetail({ id, onBack }: InvoiceDetailProps) {
    const [visit, setVisit] = useState<Visit | null>(null);
    const [storePhoneNumber, setStorePhoneNumber] = useState<string>("");
    
    const currentUser = profileService.getProfile();

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!id) return;
            
            const res = await visitApi.getById(Number(id));
            if (res.data && isMounted) {
                setVisit(res.data);
                const phoneRes = await storeApi.getPhoneNumber(res.data.storeId);
                if (isMounted && phoneRes.success && phoneRes.data) {
                    setStorePhoneNumber(phoneRes.data);
                }
            }
        };
        
        loadData();
        
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (!currentUser?.name) {
            toast.info("Silakan atur nama usaha Anda di pengaturan profil.");
        }
    }, [currentUser?.name]);

    if (!visit) return null;

    // 1. VARIABEL NAMA USAHA
    const BUSINESS_NAME = currentUser?.name ? currentUser.name.toUpperCase() : "NAMA USAHA ANDA"; 

    // 2. KEAJAIBAN MATEMATIKA (Zero Knowledge dari tabel Visit)
    const subtotalLaku = visit.items.reduce((sum, item) => sum + (item.sold * item.wholesalePrice), 0);
    const totalTagihan = visit.amountPaid + visit.currentDebt; 
    const piutangLama = totalTagihan - subtotalLaku;
    const isLunas = visit.currentDebt === 0;

    // Helper Formatter
    const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;
    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // 3. GENERATOR TEKS WA (Format Linear + Emoji agar tidak hancur di layar kecil)
    const handleSendWA = () => {
        if(!visit){return}
        const lakuItemsText = visit.items
        .filter(i => i.sold > 0)
        .map(i => `• *${i.productName}*\n   ${i.sold} x ${i.wholesalePrice.toLocaleString('id-ID')} = ${formatRp(i.sold * i.wholesalePrice)}`)
        .join('\n');

        const stokItemsText = visit.items
        .filter(i => i.remained > 0)
        .map(i => `• ${i.productName}: ${i.remained} pcs`)
        .join('\n');

        const waText = 
    `🧾 *NOTA ${BUSINESS_NAME}*
    Toko: ${visit.storeName}
    Tgl: ${formatDate(visit.createdAt)}
    Nota: #${visit.id}
    ➖➖➖➖➖➖➖➖

    📦 *RINCIAN LAKU:*
    ${lakuItemsText || 'Tidak ada barang laku.'}
    _Subtotal: ${formatRp(subtotalLaku)}_

    📝 *TAGIHAN:*
    Subtotal Laku : ${formatRp(subtotalLaku)}
    Hutang Lama   : ${formatRp(piutangLama)}
    *TOTAL TAGIHAN: ${formatRp(totalTagihan)}*
    *DIBAYAR TUNAI: ${formatRp(visit.amountPaid)}*
    ➖➖➖➖➖➖➖➖
    ${isLunas ? '✅ *STATUS : LUNAS (Rp 0)*' : `🔴 *SISA HUTANG: ${formatRp(visit.currentDebt)}*`}
    ➖➖➖➖➖➖➖➖

    📋 *INFO STOK DI TOKO SAAT INI:*
    (Sisa barang di etalase)
    ${stokItemsText || 'Tidak ada sisa barang.'}

    Terima kasih atas kerjasamanya! 🙏`;

        // Kita menggunakan wa.me/ kosong agar sistem membuka WA dan meminta user memilih kontak
        // (Karena dari data Visit kita tidak punya nomor WA toko secara instan)
        const waUrl = `https://wa.me/${storePhoneNumber || ""}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
    };

    return (
        // DINDING HITAM (Letterbox untuk Tablet/PC)
        <div className="min-h-dvh bg-neutral-900 flex justify-center sm:py-8 sm:px-4">
        
        {/* KERTAS STRUK (Lebar maksimal untuk meniru struk nyata) */}
        <div className="w-full max-w-[484px] bg-surface text-text-primary flex flex-col relative sm:rounded-2xl shadow-2xl overflow-hidden min-h-dvh sm:min-h-0">
            
            {/* HEADER */}
            <div className="bg-surface-container-low px-4 py-4 border-b border-outline-variant flex items-center justify-between sticky top-0 z-10">
            <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full transition-colors text-text-secondary hover:text-text-primary">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 hover:bg-surface-container rounded-full transition-colors text-text-secondary hover:text-text-primary" title="Cetak (Print)">
                <Printer className="w-5 h-5" />
                </button>
            </div>
            </div>

            {/* ISI NOTA */}
            <div className="p-6 flex-1 bg-white" id="printable-receipt">
            {/* KOP NOTA */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-h2 text-h2 font-bold text-text-primary uppercase tracking-wider">{BUSINESS_NAME}</h1>
                <p className="font-caption text-caption text-text-secondary mt-1">Nota Kunjungan Konsinyasi</p>
            </div>

            {/* INFO NOTA */}
            <div className="flex justify-between font-body-sm text-body-sm border-y-2 border-dashed border-gray-300 py-3 mb-6">
                <div>
                <p className="text-text-secondary">No. Nota:</p>
                <p className="font-bold text-text-primary font-mono mt-0.5">#{visit.id}</p>
                </div>
                <div className="text-right">
                <p className="text-text-secondary">Tanggal:</p>
                <p className="font-medium text-text-primary mt-0.5">{formatDate(visit.createdAt)}</p>
                </div>
            </div>

            <div className="mb-6 flex items-start gap-2">
                <Store className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                <div>
                <p className="font-body-sm text-body-sm text-text-secondary">Kepada Yth:</p>
                <p className="font-body text-body font-bold text-text-primary">{visit.storeName}</p>
                </div>
            </div>

            {/* BARANG LAKU */}
            <div className="mb-6">
                <h3 className="font-body-sm text-body-sm font-bold text-text-primary border-b border-outline-variant pb-2 mb-3">Rincian Barang Laku</h3>
                <div className="space-y-3">
                {visit.items.filter(i => i.sold > 0).map((item) => (
                    <div key={item.productId} className="flex justify-between font-body-sm text-body-sm">
                    <div>
                        <p className="font-medium text-text-primary">{item.productName}</p>
                        <p className="text-text-secondary">{item.sold} x {item.wholesalePrice.toLocaleString('id-ID')}</p>
                    </div>
                    <p className="font-medium text-text-primary font-mono">{formatRp(item.sold * item.wholesalePrice)}</p>
                    </div>
                ))}
                {visit.items.filter(i => i.sold > 0).length === 0 && (
                    <p className="text-text-secondary font-body-sm text-body-sm italic">Tidak ada barang laku kunjungan ini.</p>
                )}
                </div>
            </div>

            {/* RINGKASAN KEUANGAN */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-6 space-y-2">
                <div className="flex justify-between font-body-sm text-body-sm text-text-secondary">
                <span>Subtotal Laku:</span>
                <span className="font-mono">{formatRp(subtotalLaku)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-text-secondary">
                <span>Hutang Lama:</span>
                <span className="font-mono">{formatRp(piutangLama)}</span>
                </div>
                
                <div className="flex justify-between font-body text-body font-bold text-text-primary pt-2">
                <span>TOTAL TAGIHAN:</span>
                <span className="font-mono">{formatRp(totalTagihan)}</span>
                </div>
                <div className="flex justify-between font-body text-body text-text-primary">
                <span>Dibayar (Tunai):</span>
                <span className="font-mono">{formatRp(visit.amountPaid)}</span>
                </div>

                <div className={`flex justify-between font-h3 text-h3 font-bold pt-3 pb-1 border-t border-outline-variant mt-2 ${isLunas ? 'text-success' : 'text-error'}`}>
                <span>{isLunas ? 'LUNAS' : 'SISA HUTANG:'}</span>
                <span className="font-mono">{formatRp(visit.currentDebt)}</span>
                </div>
            </div>

            {/* SISA STOK DI TOKO */}
            <div className="bg-surface-container-low p-4 rounded-xl">
                <h3 className="font-body-sm text-body-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                📦 Sisa Stok Aktif (Di Toko)
                </h3>
                <ul className="space-y-1">
                {visit.items.filter(i => i.remained > 0).map((item) => (
                    <li key={item.productId} className="flex justify-between font-caption text-caption">
                    <span className="text-text-secondary">{item.productName}</span>
                    <span className="font-medium text-text-primary font-mono">{item.remained} pcs</span>
                    </li>
                ))}
                {visit.items.filter(i => i.remained > 0).length === 0 && (
                    <li className="text-text-secondary font-caption text-caption italic">Tidak ada stok dititipkan.</li>
                )}
                </ul>
            </div>
            </div>

            {/* FOOTER ACTION (Sticky Bottom) */}
            <div className="bg-surface border-t border-outline-variant p-4 sticky bottom-0 z-10">
            <button 
                onClick={handleSendWA}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-body text-body py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
                <MessageCircle className="w-5 h-5 fill-current" />
                Kirim Nota via WhatsApp
            </button>
            </div>

        </div>

        {/* Style khusus untuk Media Print agar background hitam tidak ikut tercetak */}
        <style dangerouslySetInnerHTML={{__html: `
            @media print {
            body * { visibility: hidden; }
            #printable-receipt, #printable-receipt * { visibility: visible; }
            #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; }
            }
        `}} />

        </div>
    );
}