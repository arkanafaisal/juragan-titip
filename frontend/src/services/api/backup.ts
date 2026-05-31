import { db } from "@/lib/db";

export const backupApi = {
  exportToJson: async (): Promise<void> => {
    try {
      const products = await db.products.toArray();
      const stores = await db.stores.toArray();
      const visits = await db.visits.toArray();

      const backupData = {
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          products,
          stores,
          visits
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

          const { products, stores, visits } = parsed.data;

          await db.transaction('rw', db.products, db.stores, db.visits, async () => {
            await db.products.clear();
            await db.stores.clear();
            await db.visits.clear();

            if (products.length > 0) await db.products.bulkAdd(products);
            if (stores.length > 0) await db.stores.bulkAdd(stores);
            if (visits.length > 0) await db.visits.bulkAdd(visits);
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
};
