import { ArrowLeft } from "lucide-react";
import { useSmartBack } from "@/hooks/use-smart-back";

export function BackButton({ fallbackPath, className = "" }: { fallbackPath: string; className?: string }) {
  const { goBack } = useSmartBack();
  
  return (
    <div className={`flex items-center ${className}`}>
      <button 
        onClick={() => goBack(fallbackPath)}
        className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm font-bold text-text-primary hover:bg-surface-container-low active:scale-[0.98] transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> 
        <span className="text-body-sm">Kembali</span>
      </button>
    </div>
  );
}
