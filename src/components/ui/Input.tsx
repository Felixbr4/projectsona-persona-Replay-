import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-theme-surface/80 text-theme-text border rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all ${
            error ? "border-red-500 ring-red-500/20" : "border-theme-border"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
