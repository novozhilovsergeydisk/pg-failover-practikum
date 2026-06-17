"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "green" | "blue" | "orange" | "red" | "purple";
  className?: string;
}

export function Badge({ children, variant = "blue", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        {
          "badge-green": variant === "green",
          "badge-blue": variant === "blue",
          "badge-orange": variant === "orange",
          "badge-red": variant === "red",
          "badge-purple": variant === "purple",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
