"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border/60 mb-5">
          {title && (
            <h3 className="text-lg font-black tracking-wider uppercase text-theme-text">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-theme-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
