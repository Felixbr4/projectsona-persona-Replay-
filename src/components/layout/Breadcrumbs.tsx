import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-theme-muted my-4">
      <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Início</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-theme-primary font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
