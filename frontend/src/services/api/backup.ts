import { db } from "@/lib/db";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { settingsApi } from "./settings";

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

  const categoryLabels = settingsApi.getCategoryLabels();
  const storeCategoryLabels = settingsApi.getStoreCategoryLabels();

  for (let i = 1; i <= 5; i++) {
    const id = String(i) as "1" | "2" | "3" | "4" | "5";
    wsConfig.addRow({
      p_id: id, p_label: categoryLabels[id],
      s_id: id, s_label: storeCategoryLabels[id]
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
  addRaw('_Raw_Products', data.products, [
    'id', 'name', 'normalizedName', 'category', 'costPrice', 'wholesalePrice', 
    'retailPrice', 'warehouseStock', 'returnedStock', 'description', 'isArchived', 'createdAt'
  ]);
  
  addRaw('_Raw_Stores', data.stores, [
    'id', 'name', 'normalizedName', 'ownerName', 'phone', 'latitude', 'longitude', 
    'notes', 'debt', 'assetValue', 'lastVisitAt', 'category', 'isArchived', 'createdAt'
  ]);
  
  addRaw('_Raw_Visits', data.visits, [
    'id', 'storeId', 'storeName', 'amountPaid', 'currentDebt', 'createdAt'
  ]);
  
  addRaw('_Raw_VisitItems', data.visitItems, [
    'visitId', 'productId', 'storeName', 'sold', 'returned', 'costPrice', 
    'wholesalePrice', 'productName', 'remained'
  ]);
  
  addRaw('_Raw_InventoryLogs', data.inventoryLogs, [
    'id', 'productId', 'type', 'quantity', 'storeId', 'storeName', 'notes', 'createdAt'
  ]);
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
      } else {
        const rawCell = `${rawSheetName}!${col.rawCol}${rowIndex}`;
        // Gunakan IF untuk fallback value agar nilai kosong tidak ditampilkan sebagai "0"
        cell.value = { formula: `IF(OR(ISBLANK(${rawCell}), ${rawCell}=""), "-", ${rawCell})` };
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
export const backupApi = {
  exportInteractiveExcel: async (): Promise<boolean> => {
    try {
      // 1. Ambil Seluruh Data Utuh dari Database
      const rawProducts = await db.products.toArray();
      const rawStores = await db.stores.toArray();
      const rawVisits = await db.visits.toArray();
      const rawInventoryLogs = await db.inventoryLogs.toArray();

      // Ekstraksi Visit Items (Dalam Dexie web, items bersarang di visit.items)
      // Kita pecah menjadi array terpisah mirip di mobile (tabel visitItems DB relational)
      const rawVisitItems = rawVisits.flatMap(visit => 
        Array.isArray(visit.items) ? visit.items.map(item => ({
          visitId: visit.id,
          productId: item.productId,
          storeName: visit.storeName,
          sold: Number(item.sold) || 0,
          returned: Number(item.returned) || 0,
          costPrice: Number(item.costPrice) || 0,
          wholesalePrice: Number(item.wholesalePrice) || 0,
          productName: item.productName,
          remained: Number(item.remained) || 0
        })) : []
      );

      // Jangan mengekspor items yang bersarang ke sheet raw visits agar lebih rapi
      const sanitizedVisitsForRaw = rawVisits.map((v: any) => {
        const { items, ...rest } = v;
        return rest;
      });

      // 2. Logika Sorting (A-Z, lalu Arsip diletakkan di paling bawah)
      const sortByArchivedAndName = (a: any, b: any) => {
        if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
        if (a.name && b.name) return a.name.localeCompare(b.name);
        return 0;
      };
      rawProducts.sort(sortByArchivedAndName);
      rawStores.sort(sortByArchivedAndName);

      // 3. Inisiasi Mesin Excel
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Juragan Titip App';

      // 4. Generate Hidden Raw Sheets (Menampung ke-5 Tabel)
      generateHiddenSheets(workbook, { 
        products: rawProducts, 
        stores: rawStores, 
        visits: sanitizedVisitsForRaw, 
        visitItems: rawVisitItems, 
        inventoryLogs: rawInventoryLogs 
      });

      // 5. Generate Display: Produk
      // Raw Map Products: A=id, B=name, C=normalized, D=category, E=cost, F=wholesale, G=retail, H=warehouseStock, I=returnedStock, J=desc, K=isArchived, L=createdAt
      generateDisplaySheet(workbook, '1. Produk', '_Raw_Products', [
        { header: 'Nama Produk', rawCol: 'B', width: 30 },
        { header: 'Deskripsi', rawCol: 'J', width: 35 },
        { header: 'Kategori', width: 20, customFormula: (r: number) => `IFERROR(VLOOKUP(_Raw_Products!D${r}, _Config!A:B, 2, FALSE), "-")` },
        { header: 'Stok Gudang', rawCol: 'H', width: 15, align: 'right', isNumber: true },
        { header: 'Stok Retur', rawCol: 'I', width: 15, align: 'right', isNumber: true },
        { header: 'Harga Modal', rawCol: 'E', width: 18, align: 'right', isCurrency: true },
        { header: 'Harga Grosir', rawCol: 'F', width: 18, align: 'right', isCurrency: true },
        { header: 'Harga Eceran', rawCol: 'G', width: 18, align: 'right', isCurrency: true },
        { header: 'Status Arsip', width: 15, align: 'center', customFormula: (r: number) => `IF(_Raw_Products!K${r}=1, "Diarsipkan", "Aktif")` }
      ], rawProducts.length, rawProducts);

      // 6. Generate Display: Toko
      // Raw Map Stores: A=id, B=name, C=normalized, D=owner, E=phone, F=lat, G=lng, H=notes, I=debt, J=assetValue, K=lastVisit, L=category, M=isArchived, N=createdAt
      generateDisplaySheet(workbook, '2. Toko', '_Raw_Stores', [
        { header: 'Nama Toko', rawCol: 'B', width: 28 },
        { header: 'Nama Pemilik', rawCol: 'D', width: 20 },
        { header: 'Nomor Telepon', rawCol: 'E', width: 18 },
        { header: 'Catatan Khusus', rawCol: 'H', width: 30 },
        { header: 'Kategori', width: 20, customFormula: (r: number) => `IFERROR(VLOOKUP(_Raw_Stores!L${r}, _Config!C:D, 2, FALSE), "-")` },
        { header: 'Total Hutang', rawCol: 'I', width: 18, align: 'right', isCurrency: true },
        { header: 'Nilai Aset Titipan', rawCol: 'J', width: 18, align: 'right', isCurrency: true },
        { header: 'Kunjungan Terakhir', rawCol: 'K', width: 22, isDate: true, align: 'right' },
        { header: 'Google Maps', width: 18, align: 'center', customFormula: (r: number) => `HYPERLINK("https://www.google.com/maps/search/?api=1&query=" & _Raw_Stores!F${r} & "," & _Raw_Stores!G${r}, "Buka Peta")` },
        { header: 'Status Arsip', width: 15, align: 'center', customFormula: (r: number) => `IF(_Raw_Stores!M${r}=1, "Diarsipkan", "Aktif")` }
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

      // 8. Tulis Buffer dan Download ke web browser
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const dateStr = new Date().toISOString().split('T')[0];
      saveAs(blob, `Laporan_JuraganTitip_${dateStr}.xlsx`);

      return true;
    } catch (error) {
      console.error("Gagal melakukan export ExcelJS:", error);
      return false;
    }
  },

  importFromExcel: async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          if (!buffer) throw new Error("File kosong");

          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);

          // Tarik seluruh 5 sheet raw yang tersembunyi
          const rawProductsSheet = workbook.getWorksheet('_Raw_Products');
          const rawStoresSheet = workbook.getWorksheet('_Raw_Stores');
          const rawVisitsSheet = workbook.getWorksheet('_Raw_Visits');
          const rawVisitItemsSheet = workbook.getWorksheet('_Raw_VisitItems');
          const rawLogsSheet = workbook.getWorksheet('_Raw_InventoryLogs');

          if (!rawProductsSheet || !rawStoresSheet || !rawVisitsSheet) {
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

          // Parse Data & Normalisasi Boolean
          const mapBooleans = (item: any) => ({
            ...item,
            isArchived: item.isArchived === 'true' || item.isArchived === true || item.isArchived === 1,
          });

          const finalProducts = parseSheet(rawProductsSheet).map(mapBooleans);
          const finalStores = parseSheet(rawStoresSheet).map(mapBooleans);
          let finalVisits = parseSheet(rawVisitsSheet);
          const finalVisitItems = parseSheet(rawVisitItemsSheet);
          const finalLogs = parseSheet(rawLogsSheet);

          // REHYDRATE VISIT ITEMS INTO VISITS FOR DEXIE (WEB-SPECIFIC LOGIC)
          const visitItemsMap: Record<number, any[]> = {};
          finalVisitItems.forEach(item => {
            if (!visitItemsMap[item.visitId]) {
              visitItemsMap[item.visitId] = [];
            }
            visitItemsMap[item.visitId].push(item);
          });

          finalVisits = finalVisits.map(visit => ({
            ...visit,
            items: visitItemsMap[visit.id] || []
          }));

          // Eksekusi Restore dalam DB Transaction Dexie
          await db.transaction('rw', db.products, db.stores, db.visits, db.inventoryLogs, async () => {
            await db.products.clear();
            await db.stores.clear();
            await db.visits.clear();
            await db.inventoryLogs.clear();

            if (finalProducts.length > 0) await db.products.bulkAdd(finalProducts);
            if (finalStores.length > 0) await db.stores.bulkAdd(finalStores);
            if (finalVisits.length > 0) await db.visits.bulkAdd(finalVisits);
            if (finalLogs.length > 0) await db.inventoryLogs.bulkAdd(finalLogs);
          });

          resolve();
        } catch (error) {
          console.error("Gagal melakukan import ExcelJS:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Gagal membaca file backup Excel"));
      };

      reader.readAsArrayBuffer(file);
    });
  }
};
