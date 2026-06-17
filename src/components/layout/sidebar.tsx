"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn("w-64 shrink-0", className)}>
      <nav className="sticky top-20 space-y-1">
        {children}
      </nav>
    </aside>
  );
}

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      <h4 className="px-3 mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
}

export function SidebarLink({ href, children, active, icon }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
      <ChevronRight className={cn("w-4 h-4 transition-transform", active && "rotate-90")} />
    </Link>
  );
}
