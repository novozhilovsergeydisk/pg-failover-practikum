"use client";

import { useAuth } from "@/components/layout/header";
import { Database, BookOpen, Terminal, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activePage?: string;
}

export function MobileNav({ activePage }: MobileNavProps) {
  const { isAdmin } = useAuth();

  const navItems = [
    { href: "/", icon: <Database className="w-4 h-4" />, label: "Практикум" },
    { href: "/modules", icon: <BookOpen className="w-4 h-4" />, label: "Модули" },
    { href: "/reference", icon: <Terminal className="w-4 h-4" />, label: "Справочник" },
    { href: "/glossary", icon: <BookOpen className="w-4 h-4" />, label: "Глоссарий" },
    { href: "/help", icon: <HelpCircle className="w-4 h-4" />, label: "Справка" },
    ...(isAdmin ? [{ href: "/admin", icon: <Settings className="w-4 h-4" />, label: "Управление" }] : []),
  ];

  const gridCols = navItems.length === 6 ? "grid-cols-6" : "grid-cols-5";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
      <div className={cn("grid py-2", gridCols)}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-1 py-2",
              activePage === item.href
                ? "text-[var(--accent-green)]"
                : "text-[var(--text-muted)]"
            )}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
