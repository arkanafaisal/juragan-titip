
import { Plus, Minus } from "lucide-react";

export const NumberInput = ({ value, max, onChange, className = "" }: any) => {
  const disabled = max === 0;
  return (
    <div className={`flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest ${className} ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <button 
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="px-2 py-1 sm:py-1.5 bg-surface-container-low hover:bg-surface-container-high text-text-secondary transition-colors disabled:opacity-50"
      >
        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      <input 
        type="text" 
        disabled={disabled}
        value={value === 0 ? '0' : value}
        onChange={(e) => {
          if (disabled) return;
          const raw = e.target.value.replace(/[^0-9]/g, '');
          const val = parseInt(raw);
          if (isNaN(val)) onChange(0);
          else onChange(max !== undefined ? Math.min(max, val) : val);
        }}
        className="w-full min-w-[32px] sm:min-w-[40px] max-w-[50px] sm:max-w-[60px] text-center font-data-md text-data-md outline-none bg-transparent py-1"
      />
      <button 
        onClick={() => !disabled && onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={disabled || (max !== undefined && value >= max)}
        className="px-2 py-1 sm:py-1.5 bg-surface-container-low hover:bg-surface-container-high text-text-secondary transition-colors disabled:opacity-50"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};