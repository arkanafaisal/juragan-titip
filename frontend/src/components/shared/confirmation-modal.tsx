import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string) => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  
  // Opsi Mode Verifikasi Teks (Seperti ketik nama toko untuk hapus)
  verificationText?: string; 
  verificationLabel?: React.ReactNode;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDanger = false,
  isLoading = false,
  verificationText,
  verificationLabel,
  errorMessage,
  onClearError
}: ConfirmationModalProps) {
  const { isCollapsed } = useSidebar();
  const isMobile = useMobile();
  const [inputValue, setInputValue] = useState("");

  // Mengunci scroll layar & reset input saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isInputValid = verificationText 
    ? inputValue.toLowerCase() === verificationText.toLowerCase() 
    : true;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  return createPortal(
    <div className={cn(
      "fixed right-0 z-[60] flex items-center justify-center bg-on-surface/50 backdrop-blur-sm animate-in fade-in duration-200 p-md",
      // Batas presisi agar tidak menutupi komponen layout utama
      "top-16",
      isMobile ? "bottom-[72px] left-0" : isCollapsed ? "bottom-0 left-20" : "bottom-0 left-60"
    )}>
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full sm:w-[400px] min-w-[300px] shrink-0 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-full">
        
        <div className="p-lg overflow-y-auto custom-scrollbar">
          <div className={`flex items-center gap-sm mb-sm ${isDanger ? 'text-error' : 'text-primary'}`}>
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h3 className="font-h2 text-h2 font-bold text-text-primary">{title}</h3>
          </div>
          
          <p className="font-body text-body text-text-secondary mb-md">
            {description}
          </p>
          
          {/* Blok Verifikasi Teks (Opsional) */}
          {verificationText && (
            <div className={`mt-md p-md rounded-lg border ${isDanger ? 'bg-error/5 border-error/20' : 'bg-primary/5 border-primary/20'}`}>
              <label className="font-caption text-caption text-text-secondary block mb-xs">
                {verificationLabel || <>Ketik <span className="font-bold text-text-primary select-none">{verificationText}</span> untuk melanjutkan:</>}
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className={cn(
                  "w-full bg-surface border rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 transition-all",
                  isDanger 
                    ? "border-outline-variant focus:ring-error focus:border-error" 
                    : "border-outline-variant focus:ring-primary focus:border-primary"
                )}
                placeholder="..."
                autoComplete="off"
              />
              {errorMessage && (
                <p className="text-error font-caption text-caption mt-xs flex items-start gap-1">
                  <span className="mt-0.5">•</span> {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-md border-t border-outline-variant bg-surface-bright flex justify-end gap-sm shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-md py-sm rounded-lg font-body text-body font-medium text-text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => onConfirm(inputValue)}
            disabled={isLoading || !isInputValid}
            className={cn(
              "px-md py-sm rounded-lg font-body text-body font-medium transition-colors flex items-center gap-2 disabled:opacity-50",
              isDanger 
                ? "text-on-error bg-error hover:bg-error/90" 
                : "text-on-primary bg-primary hover:bg-primary/90"
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isLoading ? "Memproses..." : confirmText}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}