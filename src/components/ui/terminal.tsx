"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Terminal({ children, title = "terminal", className }: TerminalProps) {
  return (
    <div className={cn("terminal-window", className)}>
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="ml-2 text-xs text-[var(--text-muted)] font-mono">{title}</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
}
