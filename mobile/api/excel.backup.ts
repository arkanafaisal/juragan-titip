import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import { db } from '../db';
import { products, stores, visits, visitItems, inventoryLogs } from '../db/schema';
import { useSettingsStore } from './settings.api';

// ==========================================
// 1. KONFIGURASI GLOBAL
// ==========================================
const PASSWORD_LOCK = 'juragan123'; // Sandi untuk membuka gembok sheet

// ==========================================
// 2. HELPER: MEMBUAT SHEET RAW (TERSEMBUNYI)
// ==========================================
const generateHiddenSheets = (workbook: ExcelJS.Workbook, data: any) => {
  // A. Buat Sheet Config (Untuk referensi VLOOKUP kategori)
  const wsConfig = workbook.addWorksheet('_Config', { state: 'hidden' });
  wsConfig.columns = [
    { header: 'ID_Prod', key: 'p_id' }, { header: 'Label_Prod', key: 'p_label' },
    { header: 'ID_Toko', key: 's_id' }, { header: 'Label_Toko', key: 's_label' }
  ];

  const { categoryLabels, storeCategoryLabels } = useSettingsStore.getState();

  for (let i = 1; i <= 5; i++) {
    const id = String(i) as "1" | "2" | "3" | "4" | "5";
    wsConfig.addRow({
      p_id: id, p_label: categoryLabels[id],
      s_id: id, s_label: storeCategoryLabels[id]
    });
  }

  // B. Fungsi Penulis Raw Data 100% (Menjaga agar nama key sama dengan DB)
  const addRaw = (sheetName: string, rows: any[]) => {
    const ws = workbook.addWorksheet(sheetName, { state: 'hidden' });
    if (rows.length === 0) return ws;
    
    // Tulis Header menggunakan Object Keys dari baris pertama
    const headers = Object.keys(rows[0]);
    ws.addRow(headers);
    
    // Tulis Data
    rows.forEach(row => {
      ws.addRow(headers.map(key => row[key]));
    });
    return ws;
  };

  // Simpan SELURUH tabel untuk backup yang aman
  addRaw('_Raw_Products', data.products);
  addRaw('_Raw_Stores', data.stores);
  addRaw('_Raw_Visits', data.visits);
  addRaw('_Raw_VisitItems', data.visitItems);
  addRaw('_Raw_InventoryLogs', data.inventoryLogs);
};

// ==========================================
// 3. HELPER: MEMBUAT SHEET DISPLAY (TAMPILAN)
// ==========================================
const generateDisplaySheet = (
  workbook: ExcelJS.Workbook,
  sheetName: string,
  rawSheetName: string,
  columnsConfig: any[],
  dataLength: number,
  rawDataArray: any[]
) => {
  // Aktifkan Freeze Panes pada baris pertama
  const ws = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }] 
  });

  // Setup Header dan Lebar Kolom
  ws.columns = columnsConfig.map(col => ({
    header: col.header,
    width: col.width,
    style: { alignment: { horizontal: col.align || 'left', vertical: 'middle' } }
  }));

  // Styling Visual Header (Background Biru, Font Putih, Bold)
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Generate Data Menggunakan Rumus yang Mengambil dari Sheet Raw
  for (let r = 0; r < dataLength; r++) {
    const rowIndex = r + 2; 
    const row = ws.getRow(rowIndex);
    const isArchived = rawDataArray[r]?.isArchived;

    columnsConfig.forEach((col, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      
      if (col.customFormula) {
        cell.value = { formula: col.customFormula(rowIndex) };
      } else if (col.isDate) {
        // Tampilkan raw date string sebagai teks biasa agar aman dibaca
        cell.value = { formula: `${rawSheetName}!${col.rawCol}${rowIndex}` }; 
      } else {
        cell.value = { formula: `${rawSheetName}!${col.rawCol}${rowIndex}` };
      }

      // Format Angka Ribuan
      if (col.isCurrency || col.isNumber) cell.numFmt = '#,##0'; 
    });

    // Terapkan Gaya "Arsip" (Abu-abu & Coret) jika isArchived = true
    if (isArchived) {
      row.eachCell({ includeEmpty: true }, (c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
        c.font = { strike: true, color: { argb: 'FF888888' } };
      });
    }
  }

  // Kunci Sheet (Protect) - Hanya mengizinkan Copy/Select Text
  ws.protect(PASSWORD_LOCK, {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatColumns: true, // Izinkan pengguna menyesuaikan lebar kolom secara manual jika mau
    spinCount: 1
  });
};

// ==========================================
// 4. FUNGSI UTAMA EXPORT (BACKUP)
// ==========================================
export const exportDatabaseToExcel = async (onProgress?: (msg: string) => void) => {
  try {
    if (onProgress) onProgress('Mengambil data dari database...');
    // 1. Ambil Seluruh Data Utuh dari Database
    const rawProducts = await db.select().from(products);
    const rawStores = await db.select().from(stores);
    const rawVisits = await db.select().from(visits);
    const rawVisitItems = await db.select().from(visitItems);
    const rawInventoryLogs = await db.select().from(inventoryLogs);

    // 2. Logika Sorting (A-Z, lalu Arsip diletakkan di paling bawah)
    const sortByArchivedAndName = (a: any, b: any) => {
      if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
      if (a.name && b.name) return a.name.localeCompare(b.name);
      return 0;
    };
    rawProducts.sort(sortByArchivedAndName);
    rawStores.sort(sortByArchivedAndName);

    // 3. Inisiasi Mesin Excel
    if (onProgress) onProgress('Menyusun format Excel...');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Juragan Titip App';

    // 4. Generate Hidden Raw Sheets (Menampung ke-5 Tabel)
    generateHiddenSheets(workbook, { 
      products: rawProducts, stores: rawStores, visits: rawVisits, 
      visitItems: rawVisitItems, inventoryLogs: rawInventoryLogs 
    });

    // 5. Generate Display: Produk
    // Raw Map Products: A=id, B=name, C=normalized, D=category, E=cost, F=wholesale, G=retail, H=warehouseStock, I=returnedStock, J=desc, K=isArchived, L=createdAt
    generateDisplaySheet(workbook, '1. Produk', '_Raw_Products', [
      { header: 'Nama Produk', rawCol: 'B', width: 30 },
      { header: 'Deskripsi', rawCol: 'J', width: 35 },
      { header: 'Kategori', width: 20, customFormula: (r: number) => `VLOOKUP(_Raw_Products!D${r}, _Config!A:B, 2, FALSE)` },
      { header: 'Stok Gudang', rawCol: 'H', width: 15, align: 'right', isNumber: true },
      { header: 'Stok Retur', rawCol: 'I', width: 15, align: 'right', isNumber: true },
      { header: 'Harga Modal', rawCol: 'E', width: 18, align: 'right', isCurrency: true },
      { header: 'Harga Grosir', rawCol: 'F', width: 18, align: 'right', isCurrency: true },
      { header: 'Harga Eceran', rawCol: 'G', width: 18, align: 'right', isCurrency: true },
      { header: 'Status Arsip', width: 15, align: 'center', customFormula: (r: number) => `IF(_Raw_Products!K${r}=1, "Diarsipkan", "Aktif")` }
    ], rawProducts.length, rawProducts);

    // 6. Generate Display: Toko
    // Raw Map Stores: A=id, B=name, C=normalized, D=owner, E=phone, F=address, G=lat, H=lng, I=notes, J=debt, K=assetValue, L=lastVisit, M=category, N=isArchived, O=createdAt
    generateDisplaySheet(workbook, '2. Toko', '_Raw_Stores', [
      { header: 'Nama Toko', rawCol: 'B', width: 28 },
      { header: 'Nama Pemilik', rawCol: 'D', width: 20 },
      { header: 'Nomor Telepon', rawCol: 'E', width: 18 },
      { header: 'Alamat Lengkap', rawCol: 'F', width: 40 },
      { header: 'Catatan Khusus', rawCol: 'I', width: 30 },
      { header: 'Kategori', width: 20, customFormula: (r: number) => `VLOOKUP(_Raw_Stores!M${r}, _Config!C:D, 2, FALSE)` },
      { header: 'Total Hutang', rawCol: 'J', width: 18, align: 'right', isCurrency: true },
      { header: 'Nilai Aset Titipan', rawCol: 'K', width: 18, align: 'right', isCurrency: true },
      { header: 'Kunjungan Terakhir', rawCol: 'L', width: 22, isDate: true, align: 'right' },
      { header: 'Google Maps', width: 18, align: 'center', customFormula: (r: number) => `HYPERLINK("https://www.google.com/maps/search/?api=1&query=" & _Raw_Stores!G${r} & "," & _Raw_Stores!H${r}, "Buka Peta")` },
      { header: 'Status Arsip', width: 15, align: 'center', customFormula: (r: number) => `IF(_Raw_Stores!N${r}=1, "Diarsipkan", "Aktif")` }
    ], rawStores.length, rawStores);

    // 7. Generate Display: Kunjungan (Header Nota Utama)
    // Raw Map Visits: A=id, B=storeId, C=subtotal, D=amountPaid, E=debt, F=createdAt
    generateDisplaySheet(workbook, '3. Kunjungan', '_Raw_Visits', [
      { header: 'ID Nota', rawCol: 'A', width: 12, align: 'center' },
      { header: 'Total Nilai Laku', rawCol: 'C', width: 20, align: 'right', isCurrency: true },
      { header: 'Tunai Dibayar', rawCol: 'D', width: 20, align: 'right', isCurrency: true },
      { header: 'Sisa Hutang Tercatat', rawCol: 'E', width: 20, align: 'right', isCurrency: true },
      { header: 'Waktu Transaksi', rawCol: 'F', width: 25, isDate: true, align: 'right' }
    ], rawVisits.length, rawVisits);

    // 8. Tulis Buffer dan Bagikan
    const buffer = await workbook.xlsx.writeBuffer();
    const base64Data = Buffer.from(buffer).toString('base64'); 

    const dateStr = new Date().toISOString().split('T')[0];
    const fileUri = `${FileSystem.documentDirectory}Laporan_JuraganTitip_${dateStr}.xlsx`;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
    
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Bagikan Laporan Excel'
      });
    }

    return true;
  } catch (error) {
    console.error("Gagal melakukan export ExcelJS:", error);
    throw error;
  }
};

// ==========================================
// 5. FUNGSI UTAMA IMPORT (RESTORE DATA)
// ==========================================
export const importDatabaseFromExcel = async (fileUri: string) => {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const buffer = Buffer.from(fileBase64, 'base64');

    const workbook = new ExcelJS.Workbook();
    // Gunakan 'as any' untuk membungkam error tipe TypeScript terkait polyfill Buffer
    await workbook.xlsx.load(buffer as any);

    // Tarik seluruh 5 sheet raw yang tersembunyi
    const rawProductsSheet = workbook.getWorksheet('_Raw_Products');
    const rawStoresSheet = workbook.getWorksheet('_Raw_Stores');
    const rawVisitsSheet = workbook.getWorksheet('_Raw_Visits');
    const rawVisitItemsSheet = workbook.getWorksheet('_Raw_VisitItems');
    const rawLogsSheet = workbook.getWorksheet('_Raw_InventoryLogs');

    if (!rawProductsSheet || !rawStoresSheet) {
      throw new Error("File tidak valid. Tidak ditemukan data utuh '_Raw' di dalam file backup ini.");
    }

    // Helper Parser dari Sheet ExcelJS ke Array of Objects JSON
    const parseSheet = (sheet: ExcelJS.Worksheet | undefined) => {
      const data: any[] = [];
      if (!sheet) return data;

      let keys: string[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell, colNumber) => {
            keys[colNumber] = cell.value?.toString() || '';
          });
        } else {
          const rowData: any = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const key = keys[colNumber];
            // Format cell.value kadang mengembalikan object untuk formula, ambil hasil valuenya.
            let cellValue = cell.value;
            if (cellValue && typeof cellValue === 'object' && 'result' in cellValue) {
              cellValue = (cellValue as any).result;
            }
            if (key) rowData[key] = cellValue;
          });
          data.push(rowData);
        }
      });
      return data;
    };

    // Parse Data & Normalisasi Boolean (karena tipe bolean SQLite sering berubah saat melewati Excel)
    const mapBooleans = (item: any) => ({
      ...item,
      isArchived: item.isArchived === 'true' || item.isArchived === true || item.isArchived === 1,
    });

    const finalProducts = parseSheet(rawProductsSheet).map(mapBooleans);
    const finalStores = parseSheet(rawStoresSheet).map(mapBooleans);
    const finalVisits = parseSheet(rawVisitsSheet);
    const finalVisitItems = parseSheet(rawVisitItemsSheet);
    const finalLogs = parseSheet(rawLogsSheet);

    // Eksekusi Restore dalam DB Transaction Drizzle
    await db.transaction(async (tx) => {
      // Hapus berurutan dari tabel paling anak (Child) ke tabel induk (Parent)
      // Ini WAJIB untuk menghindari error "FOREIGN KEY constraint failed"
      await tx.delete(visitItems);
      await tx.delete(inventoryLogs);
      await tx.delete(visits);
      await tx.delete(products);
      await tx.delete(stores);

      // Insert ulang data secara berurutan dari Induk ke Anak
      if (finalStores.length > 0) await tx.insert(stores).values(finalStores as any);
      if (finalProducts.length > 0) await tx.insert(products).values(finalProducts as any);
      if (finalVisits.length > 0) await tx.insert(visits).values(finalVisits as any);
      if (finalVisitItems.length > 0) await tx.insert(visitItems).values(finalVisitItems as any);
      if (finalLogs.length > 0) await tx.insert(inventoryLogs).values(finalLogs as any);
    });

    return { success: true, message: "Restore data berhasil!" };
  } catch (error) {
    console.error("Gagal melakukan import ExcelJS:", error);
    throw error;
  }
};