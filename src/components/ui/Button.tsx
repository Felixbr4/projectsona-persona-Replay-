"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "persona";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold tracking-wider",
    md: "px-5 py-2.5 text-sm font-bold tracking-wide",
    lg: "px-8 py-3.5 text-base font-black tracking-wider",
  };

  const variantClasses = {
    primary:
      "bg-theme-primary text-black font-extrabold hover:bg-theme-primary-hover shadow-[0_0_20px_var(--theme-glow)] active:scale-95 transition-all duration-200",
    persona:
      "bg-theme-primary text-black font-black uppercase tracking-wider persona-cut-badge hover:bg-theme-primary-hover shadow-[0_0_25px_var(--theme-glow)] active:scale-95 transition-all duration-200",
    secondary:
      "bg-theme-surface hover:bg-theme-surface-hover text-theme-text border border-theme-border transition-all",
    outline:
      "bg-transparent hover:bg-theme-primary/10 text-theme-primary border-2 border-theme-primary transition-all",
    danger:
      "bg-red-600 hover:bg-red-700 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all",
    ghost: "bg-transparent hover:bg-white/5 text-theme-muted hover:text-theme-text",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 focus:ring-offset-theme-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
