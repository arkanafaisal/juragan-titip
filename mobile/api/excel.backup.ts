// mobile/services/excel.service.ts

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { db } from '../db';
import { products, stores, visits, inventoryLogs, visitItems } from '../db/schema';
import { asc } from 'drizzle-orm';

// ==========================================
// 1. CONFIG URUTAN KOLOM & HEADER
// ==========================================
const DISPLAY_CONFIG = {
  products: [
    { header: 'ID', rawKey: 'id', width: 8 },
    { header: 'Nama Produk', rawKey: 'name', width: 30 },
    { header: 'Kategori', rawKey: 'category', width: 15 },
    { header: 'Modal', rawKey: 'costPrice', width: 15 },
    { header: 'Grosir (Toko)', rawKey: 'wholesalePrice', width: 15 },
    { header: 'Eceran', rawKey: 'retailPrice', width: 15 },
    { header: 'Stok Gudang', rawKey: 'warehouseStock', width: 15 },
    { header: 'Stok Retur', rawKey: 'returnedStock', width: 15 },
    { header: 'Deskripsi', rawKey: 'description', width: 30 },
    { header: 'Status Arsip', rawKey: 'isArchived', width: 15 },
  ],
  stores: [
    { header: 'ID', rawKey: 'id', width: 8 },
    { header: 'Nama Toko', rawKey: 'name', width: 30 },
    { header: 'Pemilik', rawKey: 'ownerName', width: 20 },
    { header: 'No WhatsApp', rawKey: 'phone', width: 18 },
    { header: 'Alamat', rawKey: 'address', width: 35 },
    { header: 'Hutang', rawKey: 'debt', width: 15 },
    { header: 'Nilai Aset', rawKey: 'assetValue', width: 15 },
    { header: 'Kunjungan Terakhir', rawKey: 'lastVisitAt', width: 25 },
    { header: 'Catatan', rawKey: 'notes', width: 30 },
    { header: 'Status Arsip', rawKey: 'isArchived', width: 15 },
  ]
};

// ==========================================
// 2. HELPER BUILDER SHEET DISPLAY (GET FORMULA)
// ==========================================
function buildDisplaySheet(data: any[], config: any[], rawSheetName: string) {
  // Jika kosong, hanya buat headernya
  if (data.length === 0) return XLSX.utils.aoa_to_sheet([config.map(c => c.header)]);
  
  const rawKeys = Object.keys(data[0]);
  const wsData: any[][] = [config.map(c => c.header)];
  
  for (let r = 0; r < data.length; r++) {
    const rowData = [];
    const isArchived = data[r].isArchived;
    
    for (let c = 0; c < config.length; c++) {
      const rawColIdx = rawKeys.indexOf(config[c].rawKey);
      
      if (rawColIdx === -1) {
        rowData.push(''); // Skip jika key tidak ditemukan di raw
        continue;
      }
      
      // GET dari raw sheet. Contoh: '_raw_products'!B2
      const rawCellRef = `'${rawSheetName}'!${XLSX.utils.encode_col(rawColIdx)}${r + 2}`;
      const cell: any = { f: rawCellRef };
      
      // Styling warna abu-abu & cetak miring untuk row yang Diarsipkan
      // Note: Hanya dirender oleh Excel jika menggunakan xlsx-js-style
      if (isArchived) {
        cell.s = { 
          fill: { fgColor: { rgb: "FFF2F2F2" } }, 
          font: { italic: true, color: { rgb: "FF888888" } } 
        };
      }
      
      rowData.push(cell);
    }
    wsData.push(rowData);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set Lebar Kolom
  ws['!cols'] = config.map(c => ({ wch: c.width }));
  
  // Set Fitur Sort & Filter di Table Header
  const endColRef = XLSX.utils.encode_col(config.length - 1);
  ws['!autofilter'] = { ref: `A1:${endColRef}${data.length + 1}` };
  
  return ws;
}

// ==========================================
// 3. EXPORT / BACKUP (GENERATE XLSX)
// ==========================================
export const exportDatabaseToExcel = async () => {
  try {
    // Ambil Data Utuh, Default Sort A-Z
    const productsData = await db.select().from(products).orderBy(asc(products.name));
    const storesData = await db.select().from(stores).orderBy(asc(stores.name));
    const visitsData = await db.select().from(visits);
    const visitItemsData = await db.select().from(visitItems);
    const logsData = await db.select().from(inventoryLogs);

    const wb = XLSX.utils.book_new();

    // --- A. BUAT SHEET RAW (UTUH & MENTAH) ---
    const rawProductsWs = XLSX.utils.json_to_sheet(productsData);
    const rawStoresWs = XLSX.utils.json_to_sheet(storesData);
    const rawVisitsWs = XLSX.utils.json_to_sheet(visitsData);
    const rawVisitItemsWs = XLSX.utils.json_to_sheet(visitItemsData);
    const rawLogsWs = XLSX.utils.json_to_sheet(logsData);

    // Sembunyikan Raw Sheets (Hidden)
    // Catatan: Beberapa aplikasi Excel di HP mengabaikan properti ini.
    rawProductsWs['!SheetProps'] = { hidden: 1 };
    rawStoresWs['!SheetProps'] = { hidden: 1 };
    rawVisitsWs['!SheetProps'] = { hidden: 1 };
    rawVisitItemsWs['!SheetProps'] = { hidden: 1 };
    rawLogsWs['!SheetProps'] = { hidden: 1 };

    XLSX.utils.book_append_sheet(wb, rawProductsWs, '_raw_products');
    XLSX.utils.book_append_sheet(wb, rawStoresWs, '_raw_stores');
    XLSX.utils.book_append_sheet(wb, rawVisitsWs, '_raw_visits');
    XLSX.utils.book_append_sheet(wb, rawVisitItemsWs, '_raw_visit_items');
    XLSX.utils.book_append_sheet(wb, rawLogsWs, '_raw_logs');

    // --- B. BUAT SHEET DISPLAY (BERISI FORMULA GET) ---
    const displayProductsWs = buildDisplaySheet(productsData, DISPLAY_CONFIG.products, '_raw_products');
    const displayStoresWs = buildDisplaySheet(storesData, DISPLAY_CONFIG.stores, '_raw_stores');

    // Buat Sheet Display Kunjungan secara Manual (karena butuh agregasi item)
    const displayVisitsData = [['ID Nota', 'Nama Toko', 'Tanggal', 'Subtotal Laku', 'Dibayar', 'Sisa Hutang', 'Detail Barang (Bawa, Laku, Retur)']];
    
    visitsData.forEach(v => {
      const store = storesData.find(s => s.id === v.storeId);
      const items = visitItemsData.filter(vi => vi.visitId === v.id);
      
      const itemsString = items.map(i => {
        const prod = productsData.find(p => p.id === i.productId);
        const name = prod ? prod.name : `Produk ID ${i.productId}`;
        return `- ${name} (Bawa: ${i.restocked}, Laku: ${i.sold}, Retur: ${i.returned})`;
      }).join('\n');

      displayVisitsData.push([
        v.id,
        store ? store.name : `Toko ID ${v.storeId}`,
        v.createdAt,
        v.subtotal,
        v.amountPaid,
        v.debt,
        itemsString || '-'
      ]);
    });

    const displayVisitsWs = XLSX.utils.aoa_to_sheet(displayVisitsData);
    displayVisitsWs['!cols'] = [
      { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 60 }
    ];
    // Terapkan Wrap Text pada kolom Detail Barang
    for (let r = 1; r < displayVisitsData.length; r++) {
       const cellAddress = XLSX.utils.encode_cell({ c: 6, r: r });
       if (displayVisitsWs[cellAddress]) {
           displayVisitsWs[cellAddress].s = { alignment: { wrapText: true } };
       }
    }

    XLSX.utils.book_append_sheet(wb, displayProductsWs, 'Daftar Produk');
    XLSX.utils.book_append_sheet(wb, displayStoresWs, 'Daftar Toko');
    XLSX.utils.book_append_sheet(wb, displayVisitsWs, 'Daftar Kunjungan');

    // --- C. WRITE DAN SHARE ---
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    
    // Penamaan file dengan timestamp
    const dateStr = new Date().toISOString().split('T')[0];
    const uri = `${FileSystem.documentDirectory}Backup_JuraganTitip_${dateStr}.xlsx`;
    
    await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    return true;
  } catch (error) {
    console.error("Gagal melakukan export Excel:", error);
    throw error;
  }
};

// ==========================================
// 4. IMPORT / REVERSE / RESTORE (PARSE DARI RAW)
// ==========================================
export const importDatabaseFromExcel = async (fileUri: string) => {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const wb = XLSX.read(fileBase64, { type: 'base64' });

    // 1. Validasi Keberadaan Sheet Raw
    const rawProductsSheet = wb.Sheets['_raw_products'];
    const rawStoresSheet = wb.Sheets['_raw_stores'];
    const rawVisitsSheet = wb.Sheets['_raw_visits'];
    const rawVisitItemsSheet = wb.Sheets['_raw_visit_items'];
    const rawLogsSheet = wb.Sheets['_raw_logs'];

    if (!rawProductsSheet || !rawStoresSheet) {
      throw new Error("File tidak valid. Tidak ditemukan data '_raw' di dalam file backup ini.");
    }

    // 2. Parse Raw JSON
    const parsedProducts = XLSX.utils.sheet_to_json(rawProductsSheet);
    const parsedStores = XLSX.utils.sheet_to_json(rawStoresSheet);
    const parsedVisits = rawVisitsSheet ? XLSX.utils.sheet_to_json(rawVisitsSheet) : [];
    const parsedVisitItems = rawVisitItemsSheet ? XLSX.utils.sheet_to_json(rawVisitItemsSheet) : [];
    const parsedLogs = rawLogsSheet ? XLSX.utils.sheet_to_json(rawLogsSheet) : [];

    // 3. Normalisasi Format Tipe Data Boolean (karena Excel kadang mengubah true/false jadi string)
    const mapBooleans = (item: any) => ({
      ...item,
      isArchived: item.isArchived === 'true' || item.isArchived === true,
    });

    const finalProducts = parsedProducts.map(mapBooleans);
    const finalStores = parsedStores.map(mapBooleans);

    // 4. Eksekusi Restore dalam Transaction
    await db.transaction(async (tx) => {
      // Hapus data lama (Mulai dari child ke parent untuk menghindari Error Foreign Key)
      await tx.delete(visitItems);
      await tx.delete(inventoryLogs);
      await tx.delete(visits);
      await tx.delete(products);
      await tx.delete(stores);

      // Insert data baru hasil parse excel
      if (finalStores.length > 0) await tx.insert(stores).values(finalStores as any);
      if (finalProducts.length > 0) await tx.insert(products).values(finalProducts as any);
      if (parsedVisits.length > 0) await tx.insert(visits).values(parsedVisits as any);
      if (parsedVisitItems.length > 0) await tx.insert(visitItems).values(parsedVisitItems as any);
      if (parsedLogs.length > 0) await tx.insert(inventoryLogs).values(parsedLogs as any);
    });

    return { success: true, message: "Restore data berhasil!" };
  } catch (error) {
    console.error("Gagal melakukan import Excel:", error);
    throw error;
  }
};