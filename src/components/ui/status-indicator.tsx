"use client";

import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning";
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Circle
        className={cn("w-2 h-2 fill-current", {
          "status-online": status === "online",
          "status-offline": status === "offline",
          "status-warning": status === "warning",
        })}
      />
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}
