import React from "react";
import { ArrowRight } from "lucide-react";
import { NumberInput } from "@/components/shared/number-input";
import type { OpnameItem } from "@/types";

interface StepOpnameProps {
  opnameItems: (OpnameItem & { initialStock: number })[];
  handleOpnameChange: (productId: string, field: 'sold' | 'returned', value: number) => void;
  onNext: () => void;
}

export function StepOpname({ opnameItems, handleOpnameChange, onNext }: StepOpnameProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-md">
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-primary">Cek fisik barang sisa titipan terakhir</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] md:min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant">
                <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold w-[35%] md:w-[45%]">Produk</th>
                <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[15%] md:w-[11%]">Titip</th>
                <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[20%] md:w-[16%]">Laku</th>
                <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[20%] md:w-[16%]">Retur (Rusak)</th>
                <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[10%] md:w-[12%]">Sisa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {opnameItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-xl text-center text-text-secondary font-body-sm sm:font-body text-body-sm sm:text-body bg-surface-bright">
                    Tidak ada data titipan sebelumnya. (Otomatis Skip)
                  </td>
                </tr>
              ) : (
                opnameItems.map(item => (
                  <tr key={item.productId} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-md px-md">
                      <span className="font-body text-body font-medium text-text-primary">{item.productName}</span>
                    </td>
                    <td className="py-md px-md text-center">
                      <span className="font-data-md text-data-md text-text-secondary font-medium bg-surface-container-high px-2 py-1 rounded-md">{item.initialStock}</span>
                    </td>
                    <td className="py-md px-md">
                      <div className="flex justify-center">
                        <NumberInput value={item.sold} max={item.initialStock - item.returned} onChange={(val: number) => handleOpnameChange(item.productId, 'sold', val)} />
                      </div>
                    </td>
                    <td className="py-md px-md">
                      <div className="flex justify-center">
                        <NumberInput value={item.returned} max={item.initialStock - item.sold} onChange={(val: number) => handleOpnameChange(item.productId, 'returned', val)} />
                      </div>
                    </td>
                    <td className="py-md px-md text-center">
                      <span className={`font-data-md sm:font-data-lg text-data-md sm:text-data-lg font-bold ${item.remained > 0 ? 'text-primary' : 'text-text-muted'}`}>{item.remained}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={onNext} className="bg-primary text-on-primary px-lg py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm">
          Lanjut Restock <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}