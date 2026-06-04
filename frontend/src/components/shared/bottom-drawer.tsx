import React from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomDrawer({ isOpen, onClose, children }: BottomDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/50 backdrop-blur-sm max-w-[448px] mx-auto font-body text-body text-on-surface antialiased">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-surface-container-lowest rounded-t-3xl p-lg pb-24 animate-in slide-in-from-bottom-10 duration-200 shadow-xl">
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-5"></div>
        {children}
      </div>
    </div>
  );
}
