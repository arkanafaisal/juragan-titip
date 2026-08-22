import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';
import { db } from '../db';
import { products, stores, visits, visitItems, inventoryLogs } from '../db/schema';
import { useSettingsStore } from './settings.api';
import { RAW_SHEETS, getTableColumnNames } from './excel.constants';

// ==========================================
// FUNGSI UTAMA IMPORT (RESTORE DATA)
// ==========================================
export const importDatabaseFromExcel = async (fileUri: string) => {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const buffer = Buffer.from(fileBase64, 'base64');

    const workbook = new ExcelJS.Workbook();
    // Gunakan 'as any' untuk membungkam error tipe TypeScript terkait polyfill Buffer
    await workbook.xlsx.load(buffer as any);

    // Tarik seluruh 5 sheet raw yang tersembunyi
    const rawProductsSheet = workbook.getWorksheet(RAW_SHEETS.PRODUCTS);
    const rawStoresSheet = workbook.getWorksheet(RAW_SHEETS.STORES);
    const rawVisitsSheet = workbook.getWorksheet(RAW_SHEETS.VISITS);
    const rawVisitItemsSheet = workbook.getWorksheet(RAW_SHEETS.VISIT_ITEMS);
    const rawLogsSheet = workbook.getWorksheet(RAW_SHEETS.INVENTORY_LOGS);

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

    // Parse Data & Normalisasi Boolean dan Date (karena tipe bolean dan date sering berubah saat melewati Excel)
    const normalizeData = (item: any) => {
      const newItem = { ...item };
      
      if ('isArchived' in newItem) {
        newItem.isArchived = newItem.isArchived === 'true' || newItem.isArchived === true || newItem.isArchived === 1;
      }

      for (const key of Object.keys(newItem)) {
        if (newItem[key] instanceof Date) {
          newItem[key] = newItem[key].toISOString();
        }
      }
      return newItem;
    };

    const finalProducts = parseSheet(rawProductsSheet).map(normalizeData);
    const finalStores = parseSheet(rawStoresSheet).map(normalizeData);
    const finalVisits = parseSheet(rawVisitsSheet).map(normalizeData);
    const finalVisitItems = parseSheet(rawVisitItemsSheet).map(normalizeData);
    const finalLogs = parseSheet(rawLogsSheet).map(normalizeData);

    // Proses Restore Config / Settings
    const rawConfigSheet = workbook.getWorksheet(RAW_SHEETS.CONFIG);
    if (rawConfigSheet) {
      const configData = parseSheet(rawConfigSheet);
      const { setCategoryLabels, setStoreCategoryLabels, setLowStockThreshold, setStoreOverdueDays } = useSettingsStore.getState();
      
      let pLabels: any = {};
      let sLabels: any = {};
      
      configData.forEach(row => {
        if (row.ID_Prod && row.Label_Prod) pLabels[String(row.ID_Prod)] = row.Label_Prod;
        if (row.ID_Toko && row.Label_Toko) sLabels[String(row.ID_Toko)] = row.Label_Toko;
        
        if (row.Setting_Key === 'lowStockThreshold' && row.Setting_Val !== undefined && row.Setting_Val !== null) {
          setLowStockThreshold(Number(row.Setting_Val));
        }
        if (row.Setting_Key === 'storeOverdueDays' && row.Setting_Val !== undefined && row.Setting_Val !== null) {
          setStoreOverdueDays(Number(row.Setting_Val));
        }
      });
      
      if (Object.keys(pLabels).length > 0) setCategoryLabels(pLabels);
      if (Object.keys(sLabels).length > 0) setStoreCategoryLabels(sLabels);
    }

    // Eksekusi Restore dalam DB Transaction Drizzle
    await db.transaction(async (tx) => {
      // Hapus berurutan dari tabel paling anak (Child) ke tabel induk (Parent)
      // Ini WAJIB untuk menghindari error "FOREIGN KEY constraint failed"
      await tx.delete(visitItems);
      await tx.delete(inventoryLogs);
      await tx.delete(visits);
      await tx.delete(products);
      await tx.delete(stores);

      // Helper pembersih data dinamis
      const cleanItems = (items: any[], table: any) => {
        const keys = getTableColumnNames(table);
        return items.map(item => {
          const payload: any = {};
          keys.forEach(k => {
             // Pastikan tipe data boolean dari database ditangani dengan baik
             if (item[k] !== undefined && item[k] !== null && item[k] !== '') {
               payload[k] = item[k];
             }
          });
          return payload;
        });
      };

      // Insert ulang data secara berurutan dari Induk ke Anak
      if (finalStores.length > 0) await tx.insert(stores).values(cleanItems(finalStores, stores) as any);
      if (finalProducts.length > 0) await tx.insert(products).values(cleanItems(finalProducts, products) as any);
      if (finalVisits.length > 0) await tx.insert(visits).values(cleanItems(finalVisits, visits) as any);
      if (finalVisitItems.length > 0) await tx.insert(visitItems).values(cleanItems(finalVisitItems, visitItems) as any);
      if (finalLogs.length > 0) await tx.insert(inventoryLogs).values(cleanItems(finalLogs, inventoryLogs) as any);
    });

    return { success: true, message: "Restore data berhasil!" };
  } catch (error) {
    console.error("Gagal melakukan import ExcelJS:", error);
    throw error;
  }
};
