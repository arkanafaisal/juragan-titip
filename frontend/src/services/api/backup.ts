import { db } from "@/lib/db";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { settingsApi } from "./settings";

// ==========================================
// UTILITY: AUTO SIZE COLUMNS
// ==========================================
const autoSizeColumns = (worksheet: ExcelJS.Worksheet) => {
  worksheet.columns.forEach((column) => {
    if (!column || typeof column.eachCell !== 'function') return;

    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value && typeof cell.value === 'string' && cell.value.includes('\n')) {
        cell.alignment = { wrapText: true, vertical: 'top' };
      }
      const columnLength = cell.value ? cell.toString().length : 0;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    
    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
  });
};

// ==========================================
// HELPER 1: GENERATE TABEL KIRI (MASTER PRODUK)
// ==========================================
const generateLeftSection = (wsReport: ExcelJS.Worksheet, products: any[]) => {
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  const categoryLabels = settingsApi.getCategoryLabels();
  const categoryMap: Record<number, string> = {
    1: categoryLabels['1'], 2: categoryLabels['2'], 3: categoryLabels['3'], 
    4: categoryLabels['4'], 5: categoryLabels['5']
  };

  wsReport.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nama Produk', key: 'name' },
    { header: 'Deskripsi', key: 'description' },
    { header: 'Kategori', key: 'category' },
    { header: 'Stok', key: 'stock' },
    { header: 'Retur Belum Olah', key: 'returnedStock' },
    { header: 'Hrg Modal', key: 'costPrice' },
    { header: 'Hrg Grosir', key: 'wholesalePrice' },
    { header: 'Hrg Ecer', key: 'retailPrice' },
  ];

  sortedProducts.forEach(p => {
    const row = wsReport.addRow({
      id: p.id,
      name: p.name,
      description: p.description || '',
      category: categoryMap[Number(p.category)] || p.category,
      stock: p.warehouseStock,
      returnedStock: p.returnedStock,
      costPrice: p.costPrice,
      wholesalePrice: p.wholesalePrice,
      retailPrice: p.retailPrice
    });

    if (p.isArchived) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };
        cell.font = { strike: true };
      });
    }
  });

  wsReport.autoFilter = 'A1:I1'; // AutoFilter untuk tabel kiri
};

// ==========================================
// HELPER 2: GENERATE PANEL KANAN (ANALISIS PRODUK)
// ==========================================
const generateRightSection = (wsReport: ExcelJS.Worksheet, stores: any[], visitItemsData: any[]) => {
  wsReport.getCell('K1').value = "🔍 PILIH PRODUK :";
  wsReport.getCell('K1').font = { bold: true };
  
  // Perbaikan Dropdown (Referensi sheet yang sama dengan "=")
  wsReport.getCell('K2').dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['=$B$2:$B$10000']
  };
  wsReport.getCell('K2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };

  wsReport.getCell('L2').value = { formula: 'INDEX(A2:A10000, MATCH(K2, B2:B10000, 0))' };
  wsReport.getCell('L2').numFmt = ';;;'; // Hide ID secara rapi

  wsReport.getCell('K4').value = "Total Laku:";
  wsReport.getCell('L4').value = { formula: 'SUMIFS(DB_Visit_Items!D2:D10000, DB_Visit_Items!B2:B10000, L2)' };
  
  wsReport.getCell('K5').value = "Total Retur:";
  wsReport.getCell('L5').value = { formula: 'SUMIFS(DB_Visit_Items!E2:E10000, DB_Visit_Items!B2:B10000, L2)' };

  wsReport.getCell('K6').value = "Total Aktif Dititip:";
  wsReport.getCell('L6').value = { formula: 'SUM(N10:N10000)' }; // Menjumlahkan kolom aktif di bawahnya

  // Label Baru Sebelum Tabel
  wsReport.getCell('K8').value = "🏪 PERSEBARAN PRODUK DI TOKO";
  wsReport.getCell('K8').font = { bold: true };

  wsReport.getCell('K9').value = "NAMA TOKO";
  wsReport.getCell('L9').value = "LAKU";
  wsReport.getCell('M9').value = "RETUR";
  wsReport.getCell('N9').value = "AKTIF DITITIP";
  wsReport.getRow(9).font = { bold: true };

  // Algoritma Pintar: Menghitung toko paling aktif agar yang "0" tenggelam ke bawah
  const storeActivity: Record<string, number> = {};
  visitItemsData.forEach(item => {
    storeActivity[item.storeName] = (storeActivity[item.storeName] || 0) + item.sold + item.returned + item.remained;
  });

  const uniqueStores = Array.from(new Set(stores.map(s => s.name.trim())))
    .sort((a, b) => {
      const actA = storeActivity[a] || 0;
      const actB = storeActivity[b] || 0;
      if (actB !== actA) return actB - actA; // Urutkan aktivitas tertinggi ke atas
      return a.localeCompare(b);
    });

  uniqueStores.forEach((storeName, index) => {
    const rowNum = 10 + index;
    
    wsReport.getCell(`K${rowNum}`).value = storeName;
    
    // Total Laku
    wsReport.getCell(`L${rowNum}`).value = { 
      formula: `SUMIFS(DB_Visit_Items!D2:D10000, DB_Visit_Items!B2:B10000, L$2, DB_Visit_Items!C2:C10000, K${rowNum})` 
    };
    
    // Total Retur
    wsReport.getCell(`M${rowNum}`).value = { 
      formula: `SUMIFS(DB_Visit_Items!E2:E10000, DB_Visit_Items!B2:B10000, L$2, DB_Visit_Items!C2:C10000, K${rowNum})` 
    };

    // Total Aktif Dititip (Mencari sisa titipan terakhir menggunakan MAXIFS & SUMIFS di Kolom I)
    wsReport.getCell(`N${rowNum}`).value = { 
      formula: `SUMIFS(DB_Visit_Items!I2:I10000, DB_Visit_Items!A2:A10000, MAXIFS(DB_Visit_Items!A2:A10000, DB_Visit_Items!B2:B10000, L$2, DB_Visit_Items!C2:C10000, K${rowNum}), DB_Visit_Items!B2:B10000, L$2, DB_Visit_Items!C2:C10000, K${rowNum})` 
    };
  });

  wsReport.getColumn('K').width = 25;
  wsReport.getColumn('L').width = 15;
  wsReport.getColumn('M').width = 15;
  wsReport.getColumn('N').width = 20;
};

// ==========================================
// HELPER 3: GENERATE RAW DB SHEETS (HIDDEN)
// ==========================================
const generateRawDbSheets = (workbook: ExcelJS.Workbook, data: any) => {
  const { products, stores, visits, visitItemsData, inventoryLogs } = data;

  const addHiddenSheet = (name: string, columns: any[], rows: any[]) => {
    const ws = workbook.addWorksheet(name);
    ws.state = 'hidden';
    ws.columns = columns;
    ws.addRows(rows);
    ws.getRow(1).font = { bold: true };
    return ws;
  };

  addHiddenSheet('DB_Products', [
    { header: 'ID', key: 'id' }, { header: 'Name', key: 'name' }, { header: 'Normalized Name', key: 'normalizedName' },
    { header: 'Category', key: 'category' }, { header: 'Cost Price', key: 'costPrice' },
    { header: 'Wholesale Price', key: 'wholesalePrice' }, { header: 'Retail Price', key: 'retailPrice' },
    { header: 'Warehouse Stock', key: 'warehouseStock' }, { header: 'Returned Stock', key: 'returnedStock' },
    { header: 'Description', key: 'description' }, { header: 'Is Archived', key: 'isArchived' }
  ], products);

  addHiddenSheet('DB_Stores', [
    { header: 'ID', key: 'id' }, { header: 'Name', key: 'name' }, { header: 'Normalized Name', key: 'normalizedName' },
    { header: 'Owner Name', key: 'ownerName' }, { header: 'Phone', key: 'phone' }, { header: 'Address', key: 'address' },
    { header: 'Latitude', key: 'latitude' }, { header: 'Longitude', key: 'longitude' }, { header: 'Notes', key: 'notes' },
    { header: 'Debt', key: 'debt' }, { header: 'Asset Value', key: 'assetValue' }, { header: 'Last Visit At', key: 'lastVisitAt' },
    { header: 'Category', key: 'category' }, { header: 'Is Archived', key: 'isArchived' }
  ], stores);

  addHiddenSheet('DB_Visits', [
    { header: 'ID', key: 'id' }, { header: 'Store ID', key: 'storeId' }, { header: 'Store Name', key: 'storeName' },
    { header: 'Amount Paid', key: 'amountPaid' }, { header: 'Current Debt', key: 'currentDebt' }, { header: 'Created At', key: 'createdAt' }
  ], visits.map((v: any) => ({ ...v })));

  // Perhatikan: Kolom I ditambahkan untuk 'remained' agar rumus 'Aktif Dititip' bisa bekerja
  addHiddenSheet('DB_Visit_Items', [
    { header: 'Visit ID', key: 'visitId' }, { header: 'Product ID', key: 'productId' }, { header: 'Store Name', key: 'storeName' },
    { header: 'Sold', key: 'sold' }, { header: 'Returned', key: 'returned' }, { header: 'Cost Price', key: 'costPrice' },
    { header: 'Wholesale Price', key: 'wholesalePrice' }, { header: 'Product Name', key: 'productName' },
    { header: 'Remained', key: 'remained' }
  ], visitItemsData);

  addHiddenSheet('DB_InventoryLogs', [
    { header: 'ID', key: 'id' }, { header: 'Product ID', key: 'productId' }, { header: 'Type', key: 'type' },
    { header: 'Quantity', key: 'quantity' }, { header: 'Store ID', key: 'storeId' }, { header: 'Store Name', key: 'storeName' },
    { header: 'Notes', key: 'notes' }, { header: 'Created At', key: 'createdAt' }
  ], inventoryLogs);
};

// ==========================================
// MAIN FUNCTION EXPORT API
// ==========================================
export const backupApi = {
  exportInteractiveExcel: async (): Promise<boolean> => {
    try {
      const products = await db.products.toArray();
      const stores = await db.stores.toArray();
      const visits = await db.visits.toArray();
      const inventoryLogs = await db.inventoryLogs.toArray();

      // Ekstraksi Visit Items (Termasuk 'remained' untuk Aktif Dititip)
      const visitItemsData = visits.flatMap(visit => 
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

      const workbook = new ExcelJS.Workbook();
      const wsReport = workbook.addWorksheet('1. Laporan Produk');

      // 1. Render Kiri
      generateLeftSection(wsReport, products);
      
      // 2. Render Kanan
      generateRightSection(wsReport, stores, visitItemsData);
      
      // 3. Render DB Mentah (Sembunyi)
      generateRawDbSheets(workbook, { products, stores, visits, visitItemsData, inventoryLogs });

      // Apply AutoSize ke semua sheet
      workbook.worksheets.forEach(ws => autoSizeColumns(ws));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Backup_dan_Laporan_Juragan.xlsx');
      
      return true;
    } catch (error) {
      console.error("Failed to export Excel backup:", error);
      toast.error("Gagal melakukan backup data.");
      return false;
    }
  },

  /*
  exportToJson: async (): Promise<void> => {
    try {
      const products = await db.products.toArray();
      const stores = await db.stores.toArray();
      const visits = await db.visits.toArray();
      const inventoryLogs = await db.inventoryLogs.toArray();

      const backupData = {
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          products,
          stores,
          visits,
          inventoryLogs
        }
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `juragan_titip_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export backup:", error);
      throw error;
    }
  },

  importFromJson: async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) throw new Error("File kosong");
          
          const parsed = JSON.parse(content);
          
          if (!parsed.data || !Array.isArray(parsed.data.products) || !Array.isArray(parsed.data.stores) || !Array.isArray(parsed.data.visits)) {
            throw new Error("Format file backup tidak valid.");
          }

          const { products, stores, visits, inventoryLogs = [] } = parsed.data;

          await db.transaction('rw', db.products, db.stores, db.visits, db.inventoryLogs, async () => {
            await db.products.clear();
            await db.stores.clear();
            await db.visits.clear();
            await db.inventoryLogs.clear();

            if (products.length > 0) await db.products.bulkAdd(products);
            if (stores.length > 0) await db.stores.bulkAdd(stores);
            if (visits.length > 0) await db.visits.bulkAdd(visits);
            if (inventoryLogs.length > 0) await db.inventoryLogs.bulkAdd(inventoryLogs);
          });

          resolve();
        } catch (error) {
          console.error("Failed to import backup:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Gagal membaca file backup"));
      };

      reader.readAsText(file);
    });
  }
  */
};
