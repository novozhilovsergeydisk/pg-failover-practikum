"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Terminal, BookOpen, Code, Database } from "lucide-react";

interface PracticumCardProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "available" | "in-progress" | "completed";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function PracticumCard({
  title,
  description,
  difficulty,
  status,
  icon,
  onClick,
  className,
}: PracticumCardProps) {
  const difficultyMap = {
    beginner: { label: "Начальный", variant: "green" as const },
    intermediate: { label: "Средний", variant: "orange" as const },
    advanced: { label: "Продвинутый", variant: "red" as const },
  };

  const statusMap = {
    available: { label: "Доступно", variant: "blue" as const },
    "in-progress": { label: "В процессе", variant: "orange" as const },
    completed: { label: "Завершено", variant: "green" as const },
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-6 cursor-pointer card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
          {icon || <Database className="w-5 h-5 text-[var(--accent-blue)]" />}
        </div>
        <div className="flex gap-2">
          <Badge variant={difficultyMap[difficulty].variant}>
            {difficultyMap[difficulty].label}
          </Badge>
          <Badge variant={statusMap[status].variant}>
            {statusMap[status].label}
          </Badge>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  lessonsCount: number;
  completedLessons?: number;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  lessonsCount,
  completedLessons = 0,
  icon,
  onClick,
  className,
}: ModuleCardProps) {
  const progress = lessonsCount > 0 ? (completedLessons / lessonsCount) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-6 cursor-pointer card-hover",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
          {icon || <BookOpen className="w-6 h-6 text-[var(--accent-green)]" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>{completedLessons}/{lessonsCount} уроков</span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
        </div>
      </div>
    </div>
  );
}
