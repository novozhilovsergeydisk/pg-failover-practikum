"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  children: ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  return (
    <div className="mobile-nav">
      {children}
    </div>
  );
}

interface MobileNavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export function MobileNavItem({ href, icon, label, active }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors",
        active
          ? "text-[var(--accent-green)]"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
