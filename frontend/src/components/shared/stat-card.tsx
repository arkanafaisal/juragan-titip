import { type ElementType } from "react";
import { SectionCard } from "@/components/shared/section-card";

interface StatCardProps {
  icon: ElementType;
  title: string;
  value: string;
  unit?: string;
  bgClass: string;
  textClass: string;
  valSizePC?: string;
  valSizeMobile?: string;
  className?: string;
}

export function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  bgClass, 
  textClass, 
  valSizePC = "font-h1 text-h1", 
  valSizeMobile = "font-h3 text-h3 font-bold",
  className = ""
}: StatCardProps) {
  return (
    <SectionCard className={`!p-md flex flex-row justify-between items-center gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 ${bgClass} rounded-lg ${textClass} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-caption text-caption text-text-secondary">{title}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight ${valSizeMobile}`}>{value}</span>
            {unit && <span className="font-caption text-caption text-text-secondary">{unit}</span>}
          </div>
        </div>
        <span className="hidden font-h3 text-h3 text-text-secondary">{title}</span>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <div className="hidden flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight font-bold ${valSizePC}`}>{value}</span>
            {unit && <span className="font-body-sm text-body-sm text-text-secondary">{unit}</span>}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
