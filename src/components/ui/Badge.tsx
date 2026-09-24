import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-theme-primary/20 text-theme-primary border-theme-primary/30",
    secondary: "bg-theme-surface text-theme-muted border-theme-border",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    danger: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    outline: "border border-theme-border text-theme-muted",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
