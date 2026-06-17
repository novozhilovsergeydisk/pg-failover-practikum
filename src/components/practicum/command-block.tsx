"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandBlockProps {
  command: string;
  description?: string;
  output?: string;
  className?: string;
}

export function CommandBlock({ command, description, output, className }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("terminal-window", className)}>
      {description && (
        <div className="px-4 py-2 border-b border-[var(--border-primary)] text-xs text-[var(--text-muted)]">
          {description}
        </div>
      )}
      <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--accent-green)]" />
          <span className="text-xs text-[var(--text-muted)]">Команда</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 px-2"
        >
          {copied ? (
            <Check className="w-3 h-3 text-[var(--accent-green)]" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <div className="terminal-body">
        <code className="text-[var(--accent-green)]">{command}</code>
      </div>
      {output && (
        <div className="border-t border-[var(--border-primary)]">
          <div className="px-4 py-2 bg-[var(--bg-tertiary)] text-xs text-[var(--text-muted)]">
            Вывод:
          </div>
          <div className="terminal-body text-[var(--text-secondary)]">
            <pre className="m-0 text-xs">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
