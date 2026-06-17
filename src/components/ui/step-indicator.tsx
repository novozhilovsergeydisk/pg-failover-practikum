"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  completed?: boolean;
  current?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              {
                "step-completed": step.completed,
                "step-current": step.current,
                "step-pending": !step.completed && !step.current,
              }
            )}
          >
            {step.completed ? (
              <Check className="w-4 h-4" />
            ) : (
              step.id
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-2",
                step.completed ? "bg-[var(--accent-green)]" : "bg-[var(--border-primary)]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
