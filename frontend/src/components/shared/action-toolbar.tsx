import React from "react";
import { Search, SlidersHorizontal, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner"

// --- Tipe Data untuk Filter Generic ---
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;          // ex: "status", "category"
  title: string;       // ex: "Status Operasional", "Kategori Produk"
  options: FilterOption[];
}

interface ActionToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // --- Props Filter Baru (Generic) ---
  filterGroups?: FilterGroup[];
  activeFilters?: Record<string, string>; // ex: { status: "active", sortBy: "newest" }
  onFilterChange?: (groupId: string, value: string) => void;

  onAddClick: () => void;
  addLabel?: string;
  onSettingClick?: () => void;
  isSettingDisabled?: boolean;
  className?: string;
}

export function ActionToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onAddClick,
  addLabel = "Tambah",
  onSettingClick,
  isSettingDisabled = true,
  className,
}: ActionToolbarProps) {
  const isMobile = useMobile();
  // Mengecek apakah ada filter yang tidak menggunakan nilai default (asumsi "" adalah default/Semua)
  const hasActiveFilter = Object.values(activeFilters).some(val => val !== "" && val !== "name_asc");

  return (
    <div className={cn("flex items-center gap-2 mb-md w-full", className)}>
      
      {/* 1. Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 w-full bg-surface"
        />
      </div>

      {/* 2. Tombol Settings */}
      <Button
        variant="outline"
        size="icon"
        // onClick={onSettingClick}
        // disabled={isSettingDisabled}
        onClick={()=>{toast.error("Fitur ini belum tersedia")}}
        className="shrink-0 bg-surface"
        title="Pengaturan"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* 3. Tombol Filter (Berubah menjadi Popover Trigger) */}
      {filterGroups.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 relative bg-surface"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilter && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" />
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            align={isMobile ? "end" : "center"}
            sideOffset={8}
            collisionPadding={16}
            className="w-[calc(100vw-2rem)] sm:w-[320px] p-5 rounded-2xl bg-surface border border-border shadow-lg"
          >
            <div className="flex flex-col space-y-6">
              {filterGroups.map((group) => (
                <div key={group.id} className="flex flex-col space-y-3">
                  <span className="text-overline text-text-secondary uppercase tracking-wider">
                    {group.title}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const isActive = activeFilters[group.id] === opt.value;
                      
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onFilterChange?.(group.id, opt.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-body-sm font-medium transition-colors cursor-pointer",
                            isActive
                              ? "bg-primary text-on-primary border border-primary shadow-sm" // BRAND PALETTE: Biru Aktif
                              : "bg-surface text-text-secondary border border-outline-variant hover:bg-surface-container-low"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        // Fallback jika tidak ada filterGroups yang dilempar
        <Button variant="outline" size="icon" className="shrink-0 relative bg-surface" disabled>
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      )}

      {/* 4. Tombol Tambah */}
      <Button 
        onClick={onAddClick} 
        className="shrink-0 bg-primary text-on-primary hover:bg-primary/90 shadow-sm border-transparent"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline-block ml-1">{addLabel}</span>
      </Button>
      
    </div>
  );
}