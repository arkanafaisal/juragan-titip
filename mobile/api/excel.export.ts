import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import { db } from '../db';
import { products, stores, visits, visitItems, inventoryLogs } from '../db/schema';
import { useSettingsStore } from './settings.api';
import { RAW_SHEETS, getTableColumnNames } from './excel.constants';

// ==========================================
// 1. KONFIGURASI GLOBAL
// ==========================================
const PASSWORD_LOCK = 'juragan123'; // Sandi untuk membuka gembok sheet

// ==========================================
// 2. HELPER: MEMBUAT SHEET RAW (TERSEMBUNYI)
// ==========================================
const generateHiddenSheets = (workbook: ExcelJS.Workbook, data: any) => {
  // A. Buat Sheet Config (Untuk referensi VLOOKUP kategori)
  const wsConfig = workbook.addWorksheet(RAW_SHEETS.CONFIG, { state: 'hidden' });
  wsConfig.columns = [
    { header: 'ID_Prod', key: 'p_id' }, { header: 'Label_Prod', key: 'p_label' },
    { header: 'ID_Toko', key: 's_id' }, { header: 'Label_Toko', key: 's_label' },
    { header: 'Setting_Key', key: 'set_key' }, { header: 'Setting_Val', key: 'set_val' }
  ];

  const { categoryLabels, storeCategoryLabels, lowStockThreshold, storeOverdueDays } = useSettingsStore.getState();

  const settingsEntries = [
    { key: 'lowStockThreshold', val: lowStockThreshold },
    { key: 'storeOverdueDays', val: storeOverdueDays }
  ];

  for (let i = 1; i <= 5; i++) {
    const id = String(i) as "1" | "2" | "3" | "4" | "5";
    wsConfig.addRow({
      p_id: id, p_label: categoryLabels[id],
      s_id: id, s_label: storeCategoryLabels[id],
      set_key: settingsEntries[i-1]?.key || null,
      set_val: settingsEntries[i-1]?.val ?? null
    });
  }

  // B. Fungsi Penulis Raw Data (Menggunakan header statis agar kolom tidak geser)
  const addRaw = (sheetName: string, rows: any[], explicitHeaders: string[]) => {
    const ws = workbook.addWorksheet(sheetName, { state: 'hidden' });
    ws.addRow(explicitHeaders);
    
    if (rows.length > 0) {
      const mappedRows = rows.map(row => explicitHeaders.map(key => row[key] ?? null));
      ws.addRows(mappedRows);
    }
    return ws;
  };

  // Simpan SELURUH tabel untuk backup yang aman (dengan kolom eksplisit)
  addRaw(RAW_SHEETS.PRODUCTS, data.products, getTableColumnNames(products));
  addRaw(RAW_SHEETS.STORES, data.stores, getTableColumnNames(stores));
  addRaw(RAW_SHEETS.VISITS, data.visits, getTableColumnNames(visits));
  addRaw(RAW_SHEETS.VISIT_ITEMS, data.visitItems, getTableColumnNames(visitItems));
  addRaw(RAW_SHEETS.INVENTORY_LOGS, data.inventoryLogs, getTableColumnNames(inventoryLogs));
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
  rawDataArray: any[],
  reverseOrder: boolean = false
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
    
    // Tentukan referensi baris raw sheet (jika reverseOrder, urutkan dari bawah)
    const rawRowIndex = reverseOrder ? (dataLength - r + 1) : rowIndex;
    const isArchived = rawDataArray[reverseOrder ? (dataLength - r - 1) : r]?.isArchived;

    columnsConfig.forEach((col, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      
      if (col.customValue) {
        const rIndex = rawRowIndex - 2;
        const rowData = rawDataArray[rIndex];
        cell.value = col.customValue(rowData) || "-";
      } else if (col.customFormula) {
        cell.value = { formula: col.customFormula(rawRowIndex) };
      } else if (col.isDate) {
        const rawCell = `${rawSheetName}!${col.rawCol}${rawRowIndex}`;
        // Ekstrak bagian YYYY-MM-DD dan HH:MM:SS dari format ISO/SQL Timestamp dan rakit menjadi Date asli Excel
        const dateFormula = `DATE(VALUE(MID(${rawCell},1,4)), VALUE(MID(${rawCell},6,2)), VALUE(MID(${rawCell},9,2))) + TIME(VALUE(MID(${rawCell},12,2)), VALUE(MID(${rawCell},15,2)), VALUE(MID(${rawCell},18,2)))`;
        cell.value = { formula: `IF(OR(ISBLANK(${rawCell}), ${rawCell}=""), "-", IFERROR(${dateFormula}, "-"))` };
      } else {
        const rawCell = `${rawSheetName}!${col.rawCol}${rawRowIndex}`;
        // Gunakan IF untuk fallback value agar nilai kosong tidak ditampilkan sebagai "0"
        cell.value = { formula: `IF(OR(ISBLANK(${rawCell}), ${rawCell}=""), "-", ${rawCell})` };
      }

      // Format Angka Ribuan
      if (col.isCurrency || col.isNumber) {
        cell.numFmt = '#,##0'; 
      }
      
      // Format Tanggal Indonesia (Human Readable)
      if (col.isDate) {
        cell.numFmt = '[$-id-ID]hh:mm, d mmmm yyyy';
      }
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

    // 3. Pra-proses Data Relasional (Barang Titipan)
    if (onProgress) onProgress('Memproses relasi data barang...');
    
    const productMap = new Map<number, string>();
    rawProducts.forEach(p => productMap.set(p.id, p.name));

    // A. Agregasi untuk Kunjungan
    const visitItemsStrMap = new Map<number, string[]>(); // visitId -> array of string
    const productTotalSoldMap = new Map<number, number>(); // productId -> total laku historis

    rawVisitItems.forEach(vi => {
      const pName = productMap.get(vi.productId) || 'Unknown';
      let details = [];
      if (vi.sold > 0) details.push(`${vi.sold} Laku`);
      if (vi.returned > 0) details.push(`${vi.returned} Retur`);
      if (vi.restocked > 0) details.push(`${vi.restocked} Baru`);
      if (details.length === 0) details.push('Cek Stok');
      
      const str = `${pName} (${details.join(', ')})`;
      const existing = visitItemsStrMap.get(vi.visitId) || [];
      existing.push(str);
      visitItemsStrMap.set(vi.visitId, existing);

      // Kalkulasi total historis barang laku per produk
      const currentSold = productTotalSoldMap.get(vi.productId) || 0;
      productTotalSoldMap.set(vi.productId, currentSold + vi.sold);
    });

    // B. Agregasi untuk Toko (Active Items yang masih dititipkan)
    const storeActiveItemsMap = new Map<number, string>(); 
    const ascVisits = [...rawVisits].sort((a, b) => a.id - b.id);
    const storeLatestState = new Map<number, Map<number, number>>(); 
    
    ascVisits.forEach(v => {
      const sMap = storeLatestState.get(v.storeId) || new Map<number, number>();
      const vItems = rawVisitItems.filter(vi => vi.visitId === v.id);
      vItems.forEach(vi => {
        const remained = (vi.initialStock - vi.sold - vi.returned) + vi.restocked;
        if (remained > 0) {
          sMap.set(vi.productId, remained);
        } else {
          sMap.delete(vi.productId);
        }
      });
      storeLatestState.set(v.storeId, sMap);
    });

    const productActiveConsignedMap = new Map<number, number>(); // productId -> total qty aktif di semua toko

    storeLatestState.forEach((productQuantities, storeId) => {
      const itemsArr: string[] = [];
      productQuantities.forEach((qty, pId) => {
        const pName = productMap.get(pId) || 'Unknown';
        itemsArr.push(`${pName} (${qty})`);
        
        // Kalkulasi total barang aktif yang dititipkan per produk
        const currentQty = productActiveConsignedMap.get(pId) || 0;
        productActiveConsignedMap.set(pId, currentQty + qty);
      });
      storeActiveItemsMap.set(storeId, itemsArr.join(', '));
    });

    // 4. Inisiasi Mesin Excel
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
    generateDisplaySheet(workbook, '1. Produk', RAW_SHEETS.PRODUCTS, [
      { header: 'Nama Produk', rawCol: 'B', width: 30 },
      { header: 'Deskripsi', rawCol: 'J', width: 35 },
      { header: 'Kategori', width: 20, customFormula: (r: number) => `IFERROR(VLOOKUP(${RAW_SHEETS.PRODUCTS}!D${r}, ${RAW_SHEETS.CONFIG}!A:B, 2, FALSE), "-")` },
      { header: 'Stok Gudang', rawCol: 'H', width: 15, align: 'right', isNumber: true },
      { header: 'Stok Retur', rawCol: 'I', width: 15, align: 'right', isNumber: true },
      { header: 'Tersebar di Toko', width: 20, align: 'right', isNumber: true, customValue: (row: any) => productActiveConsignedMap.get(row.id) || 0 },
      { header: 'Total Laku Terjual', width: 22, align: 'right', isNumber: true, customValue: (row: any) => productTotalSoldMap.get(row.id) || 0 },
      { header: 'Harga Modal', rawCol: 'E', width: 18, align: 'right', isCurrency: true },
      { header: 'Harga Grosir', rawCol: 'F', width: 18, align: 'right', isCurrency: true },
      { header: 'Harga Eceran', rawCol: 'G', width: 18, align: 'right', isCurrency: true }
    ], rawProducts.length, rawProducts);

    // 6. Generate Display: Toko
    // Raw Map Stores: A=id, B=name, C=normalized, D=owner, E=phone, F=lat, G=lng, H=notes, I=debt, J=assetValue, K=lastVisit, L=category, M=isArchived, N=createdAt
    generateDisplaySheet(workbook, '2. Toko', RAW_SHEETS.STORES, [
      { header: 'Nama Toko', rawCol: 'B', width: 28 },
      { header: 'Nama Pemilik', rawCol: 'D', width: 20 },
      { header: 'Nomor Telepon', rawCol: 'E', width: 18 },
      { header: 'Catatan Khusus', rawCol: 'H', width: 30 },
      { header: 'Kategori', width: 20, customFormula: (r: number) => `IFERROR(VLOOKUP(${RAW_SHEETS.STORES}!L${r}, ${RAW_SHEETS.CONFIG}!C:D, 2, FALSE), "-")` },
      { header: 'Daftar Barang Titipan', width: 45, customValue: (row: any) => storeActiveItemsMap.get(row.id) },
      { header: 'Nilai Aset Titipan', rawCol: 'J', width: 18, align: 'right', isCurrency: true },
      { header: 'Total Hutang', rawCol: 'I', width: 18, align: 'right', isCurrency: true },
      { header: 'Kunjungan Terakhir', rawCol: 'K', width: 35, isDate: true, align: 'right' },
      { header: 'Google Maps', width: 18, align: 'center', customFormula: (r: number) => `HYPERLINK("https://www.google.com/maps/search/?api=1&query=" & ${RAW_SHEETS.STORES}!F${r} & "," & ${RAW_SHEETS.STORES}!G${r}, "Buka Peta")` }
    ], rawStores.length, rawStores);

    // 7. Generate Display: Kunjungan
    // Raw Map Visits: A=id, B=storeId, C=subtotal, D=amountPaid, E=debt, F=createdAt
    generateDisplaySheet(workbook, '3. Kunjungan', RAW_SHEETS.VISITS, [
      { header: 'Waktu Kunjungan', rawCol: 'F', width: 35, isDate: true, align: 'right' },
      { header: 'Nama Toko', width: 30, customFormula: (r: number) => `IFERROR(VLOOKUP(${RAW_SHEETS.VISITS}!B${r}, ${RAW_SHEETS.STORES}!A:B, 2, FALSE), "-")` },
      { header: 'Rincian Barang', width: 45, customValue: (row: any) => visitItemsStrMap.get(row.id)?.join(', ') },
      { header: 'Total Nilai Laku', rawCol: 'C', width: 20, align: 'right', isCurrency: true },
      { header: 'Tunai Dibayar', rawCol: 'D', width: 20, align: 'right', isCurrency: true },
      { header: 'Sisa Hutang Tercatat', rawCol: 'E', width: 20, align: 'right', isCurrency: true }
    ], rawVisits.length, rawVisits, true);

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
