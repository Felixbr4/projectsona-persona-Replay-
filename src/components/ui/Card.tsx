import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
}) => {
  return (
    <div
      className={`bg-theme-surface/70 border border-theme-border/80 rounded-xl p-5 backdrop-blur-md transition-all duration-300 ${
        hoverEffect
          ? "hover:border-theme-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
