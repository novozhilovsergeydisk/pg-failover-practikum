"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = "sql",
  filename,
  className,
  showLineNumbers = true,
}: CodeBlockProps) {
  const lines = String(children).split("\n");

  return (
    <div className={cn("code-block", className)}>
      {filename && (
        <div className="px-4 py-2 border-b border-[var(--border-primary)] text-xs text-[var(--text-muted)]">
          {filename}
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="m-0">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="line-number">{i + 1}</span>
                )}
                <span className="flex-1">{highlightSQL(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightSQL(line: string): ReactNode {
  const keywords = [
    "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
    "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "INDEX", "VIEW", "DATABASE",
    "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "NOT", "NULL", "DEFAULT",
    "UNIQUE", "CHECK", "CONSTRAINT", "REPLICATION", "SLOT", "WAL",
    "PG_BASEBACKUP", "PG_REWIND", "PG_CTLCLUSTER", "PG_LSCLUSTERS",
    "STREAMING", "ACTIVE", "CONF", "RELOAD", "SYSTEM", "PG_HBA",
  ];

  const comments = line.trimStart().startsWith("--");
  if (comments) {
    return <span className="comment">{line}</span>;
  }

  const parts: ReactNode[] = [];
  let remaining = line;

  // Simple regex-based highlighting
  const regex = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\b\w+\b)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    const token = match[1];
    if (token.startsWith("'") || token.startsWith('"')) {
      parts.push(<span key={match.index} className="string">{token}</span>);
    } else if (keywords.includes(token.toUpperCase())) {
      parts.push(<span key={match.index} className="keyword">{token}</span>);
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return <>{parts}</>;
}
