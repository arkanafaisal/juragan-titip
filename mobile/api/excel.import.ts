import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';
import { db } from '../db';
import { products, stores, visits, visitItems, inventoryLogs } from '../db/schema';

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
      
      if (finalVisits.length > 0) {
        const cleanVisits = finalVisits.map(visit => {
          const payload: any = {
            storeId: visit.storeId,
            subtotal: visit.subtotal ?? 0,
            amountPaid: visit.amountPaid ?? 0,
            debt: visit.debt ?? visit.currentDebt ?? 0,
            createdAt: visit.createdAt
          };
          if (visit.id !== undefined && visit.id !== null) payload.id = visit.id;
          return payload;
        });
        await tx.insert(visits).values(cleanVisits as any);
      }

      if (finalVisitItems.length > 0) {
        const cleanVisitItems = finalVisitItems.map(item => {
          const payload: any = {
            visitId: item.visitId,
            productId: item.productId,
            initialStock: item.initialStock ?? 0,
            sold: item.sold ?? 0,
            returned: item.returned ?? 0,
            restocked: item.restocked ?? 0,
            price: item.price ?? 0
          };
          if (item.id !== undefined && item.id !== null) payload.id = item.id;
          return payload;
        });
        await tx.insert(visitItems).values(cleanVisitItems as any);
      }

      if (finalLogs.length > 0) {
        const cleanLogs = finalLogs.map(log => {
          const payload: any = {
            productId: log.productId,
            type: log.type,
            quantity: log.quantity ?? 0,
            storeName: log.storeName,
            createdAt: log.createdAt
          };
          if (log.id !== undefined && log.id !== null) payload.id = log.id;
          return payload;
        });
        await tx.insert(inventoryLogs).values(cleanLogs as any);
      }
    });

    return { success: true, message: "Restore data berhasil!" };
  } catch (error) {
    console.error("Gagal melakukan import ExcelJS:", error);
    throw error;
  }
};
