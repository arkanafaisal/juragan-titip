import { ReactNode } from "react";

export function SectionCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <section className={`bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant ${className}`.trim()}>
      {children}
    </section>
  );
}
