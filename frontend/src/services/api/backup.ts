import { db } from "@/lib/db";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "sonner";

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

export const backupApi = {
  exportDatabaseExcel: async (): Promise<boolean> => {
    try {
      const products = await db.products.toArray();
      const stores = await db.stores.toArray();
      const visits = await db.visits.toArray();
      const inventoryLogs = await db.inventoryLogs.toArray();

      const workbook = new ExcelJS.Workbook();

      const wsProducts = workbook.addWorksheet('DB_Products');
      wsProducts.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Normalized Name', key: 'normalizedName' },
        { header: 'Category', key: 'category' },
        { header: 'Cost Price', key: 'costPrice' },
        { header: 'Wholesale Price', key: 'wholesalePrice' },
        { header: 'Retail Price', key: 'retailPrice' },
        { header: 'Warehouse Stock', key: 'warehouseStock' },
        { header: 'Returned Stock', key: 'returnedStock' },
        { header: 'Description', key: 'description' },
        { header: 'Is Archived', key: 'isArchived' }
      ];
      wsProducts.addRows(products);

      const wsStores = workbook.addWorksheet('DB_Stores');
      wsStores.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Normalized Name', key: 'normalizedName' },
        { header: 'Owner Name', key: 'ownerName' },
        { header: 'Phone', key: 'phone' },
        { header: 'Address', key: 'address' },
        { header: 'Latitude', key: 'latitude' },
        { header: 'Longitude', key: 'longitude' },
        { header: 'Notes', key: 'notes' },
        { header: 'Debt', key: 'debt' },
        { header: 'Asset Value', key: 'assetValue' },
        { header: 'Last Visit At', key: 'lastVisitAt' },
        { header: 'Category', key: 'category' },
        { header: 'Is Archived', key: 'isArchived' }
      ];
      wsStores.addRows(stores);

      const wsVisits = workbook.addWorksheet('DB_Visits');
      wsVisits.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Store ID', key: 'storeId' },
        { header: 'Store Name', key: 'storeName' },
        { header: 'Amount Paid', key: 'amountPaid' },
        { header: 'Current Debt', key: 'currentDebt' },
        { header: 'Created At', key: 'createdAt' }
      ];
      wsVisits.addRows(visits.map(v => ({
        id: v.id,
        storeId: v.storeId,
        storeName: v.storeName,
        amountPaid: v.amountPaid,
        currentDebt: v.currentDebt,
        createdAt: v.createdAt
      })));

      const wsVisitItems = workbook.addWorksheet('DB_Visit_Items');
      wsVisitItems.columns = [
        { header: 'Visit ID', key: 'visitId' },
        { header: 'Product ID', key: 'productId' },
        { header: 'Product Name', key: 'productName' },
        { header: 'Sold', key: 'sold' },
        { header: 'Returned', key: 'returned' },
        { header: 'Remained', key: 'remained' },
        { header: 'Cost Price', key: 'costPrice' },
        { header: 'Wholesale Price', key: 'wholesalePrice' }
      ];
      const visitItemsData: any[] = [];
      visits.forEach(visit => {
        if (visit.items && Array.isArray(visit.items)) {
          visit.items.forEach(item => {
            visitItemsData.push({
              visitId: visit.id,
              productId: item.productId,
              productName: item.productName,
              sold: item.sold,
              returned: item.returned,
              remained: item.remained,
              costPrice: item.costPrice,
              wholesalePrice: item.wholesalePrice
            });
          });
        }
      });
      wsVisitItems.addRows(visitItemsData);

      const wsInventoryLogs = workbook.addWorksheet('DB_InventoryLogs');
      wsInventoryLogs.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Product ID', key: 'productId' },
        { header: 'Type', key: 'type' },
        { header: 'Quantity', key: 'quantity' },
        { header: 'Store ID', key: 'storeId' },
        { header: 'Store Name', key: 'storeName' },
        { header: 'Notes', key: 'notes' },
        { header: 'Created At', key: 'createdAt' }
      ];
      wsInventoryLogs.addRows(inventoryLogs);

      [wsProducts, wsStores, wsVisits, wsVisitItems, wsInventoryLogs].forEach(ws => {
        ws.getRow(1).font = { bold: true };
        autoSizeColumns(ws);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Database_Backup.xlsx');
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
