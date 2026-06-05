import type { ReactNode } from "react";

export function SectionCard({ 
  children, 
  className = "",
  id
}: { 
  children: ReactNode; 
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant ${className}`.trim()}>
      {children}
    </section>
  );
}
