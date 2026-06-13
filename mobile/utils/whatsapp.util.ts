import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { formatRupiah, formatDate } from './formatter.util';

interface SendVisitReceiptParams {
  visit: any;
  businessName: string;
  subtotalLaku: number;
  totalTagihan: number;
  piutangLama: number;
  isLunas: boolean;
  targetPhone?: string;
}

export const sendVisitReceiptWA = ({
  visit,
  businessName,
  subtotalLaku,
  totalTagihan,
  piutangLama,
  isLunas,
  targetPhone
}: SendVisitReceiptParams) => {
  if (!visit) return;

  const lakuItemsText = visit.items
    .filter((i: any) => i.sold > 0)
    .map((i: any) => `• *${i.productName}*\n   ${i.sold} x ${i.wholesalePrice.toLocaleString('id-ID')} = ${formatRupiah(i.sold * i.wholesalePrice)}`)
    .join('\n');

  const stokItemsText = visit.items
    .filter((i: any) => i.remained > 0)
    .map((i: any) => `• ${i.productName}: ${i.remained} pcs`)
    .join('\n');

  const waText = 
`🧾 *NOTA ${businessName}*
Toko: ${visit.storeName}
Tgl: ${formatDate(visit.createdAt)}
Nota: #${visit.id}
➖➖➖➖➖➖➖➖

📦 *RINCIAN LAKU:*
${lakuItemsText || 'Tidak ada barang laku.'}
_Subtotal: ${formatRupiah(subtotalLaku)}_

📝 *TAGIHAN:*
Subtotal Laku : ${formatRupiah(subtotalLaku)}
Hutang Lama   : ${formatRupiah(piutangLama)}
*TOTAL TAGIHAN: ${formatRupiah(totalTagihan)}*
*DIBAYAR TUNAI: ${formatRupiah(visit.amountPaid)}*
➖➖➖➖➖➖➖➖
${isLunas ? '✅ *STATUS : LUNAS (Rp 0)*' : `🔴 *SISA HUTANG: ${formatRupiah(visit.currentDebt)}*`}
➖➖➖➖➖➖➖➖

📋 *INFO STOK DI TOKO SAAT INI:*
(Sisa barang di etalase)
${stokItemsText || 'Tidak ada sisa barang.'}

Terima kasih atas kerjasamanya! 🙏`;

  let phone = targetPhone !== undefined ? targetPhone : (visit.storePhone || "");
  phone = phone.replace(/\D/g, "");
  if (phone.startsWith("0")) {
    phone = "62" + phone.substring(1);
  }
  
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
  Linking.openURL(waUrl).catch(() => {
      Toast.show({
          type: 'error',
          text1: 'Gagal Membuka WhatsApp',
          text2: 'Pastikan aplikasi WhatsApp sudah terinstal di perangkat Anda.'
      });
  });
};
