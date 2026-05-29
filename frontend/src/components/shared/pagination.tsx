import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  hasNextPage,
  onPageChange,
  className,
}: PaginationProps) {
  // Hide navigasi sepenuhnya jika sedang di page 1 dan tidak ada halaman selanjutnya
  if (currentPage === 1 && !hasNextPage) {
    return null;
  }

  const getPageNumbers = () => {
    const maxVisible = 5;
    
    // Tentukan halaman paling ujung kanan di array pagination
    // Jika ada next page, ujung kanannya adalah halaman selanjutnya (1 depan)
    // Jika tidak ada, ujung kanannya mentok di halaman saat ini
    const endPage = hasNextPage ? currentPage + 1 : currentPage;
    
    // Tentukan halaman paling ujung kiri (hitung mundur dari endPage sebanyak maxVisible)
    // Pastikan tidak pernah kurang dari halaman 1
    const startPage = Math.max(1, endPage - maxVisible + 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-lg", className)}>
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-outline-variant text-text-secondary hover:bg-surface-container-low hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Deretan Angka Halaman */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "min-w-[36px] h-9 px-3 rounded-lg font-body-sm font-medium transition-colors",
              currentPage === page
                ? "bg-primary text-on-primary border border-primary shadow-sm"
                : "border border-transparent text-text-secondary hover:bg-surface-container-low hover:text-text-primary"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-lg border border-outline-variant text-text-secondary hover:bg-surface-container-low hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman selanjutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}