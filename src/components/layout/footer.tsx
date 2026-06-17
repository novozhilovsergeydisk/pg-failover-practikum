import Link from "next/link";
import { Database, ExternalLink, Mail, BookOpen, Terminal, Shield, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-[var(--text-primary)]">PG</span>
                <span className="font-light text-[var(--text-secondary)]">Practikum</span>
              </div>
            </Link>
            <p className="text-sm text-[var(--text-muted)]">
              Учебный стенд для отработки физического резервирования кластера PostgreSQL через потоковую репликацию.
            </p>
          </div>

          {/* Modules */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Модули</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/modules/1" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Потоковая репликация
                </Link>
              </li>
              <li>
                <Link href="/modules/2" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Физические слоты
                </Link>
              </li>
              <li>
                <Link href="/modules/3" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  TLS и безопасность
                </Link>
              </li>
              <li>
                <Link href="/modules/4" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Failover и pg_rewind
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Ресурсы</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/reference" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Справочник команд
                </Link>
              </li>
              <li>
                <a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Документация PostgreSQL
                </a>
              </li>
              <li>
                <a href="https://www.postgresql.org/support/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Поддержка PostgreSQL
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Стек технологий</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]">Next.js</span>
              <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]">React</span>
              <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]">TypeScript</span>
              <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]">Tailwind CSS</span>
              <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-[var(--border-primary)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} PG Practikum. Образовательный проект.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="mailto:info@pg-practikum.ru" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
