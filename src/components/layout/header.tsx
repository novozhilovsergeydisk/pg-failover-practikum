"use client";

import { ReactNode, createContext, useContext, useState, useEffect, Children, cloneElement, isValidElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Database, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: "",
  userEmail: "",
  register: () => ({ success: false }),
  login: () => ({ success: false }),
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const data = JSON.parse(saved);
      setIsLoggedIn(true);
      setUserName(data.name || "Пользователь");
      setUserEmail(data.email || "");
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    const raw = localStorage.getItem("users");
    return raw ? JSON.parse(raw) : [];
  };

  const register = (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, error: "Пользователь с таким email уже существует" };
    }
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem("auth", JSON.stringify({ name, email }));
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: "Неверный email или пароль" };
    }
    setIsLoggedIn(true);
    setUserName(user.name);
    setUserEmail(user.email);
    localStorage.setItem("auth", JSON.stringify({ name: user.name, email: user.email }));
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userEmail, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, userName, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)]">PG</span>
              <span className="font-light text-[var(--text-secondary)]">Practikum</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {children}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {userName}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Войти
                </Button>
              </Link>
            )}
            <button
              className="md:hidden p-2 rounded-md hover:bg-[var(--bg-tertiary)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-primary)]">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)]">PG</span>
              <span className="font-light text-[var(--text-secondary)]">Practikum</span>
            </div>
          </Link>
          <button
            className="p-2 rounded-md hover:bg-[var(--bg-tertiary)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
                onClick: () => setMobileMenuOpen(false),
              });
            }
            return child;
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--border-primary)]">
          {isLoggedIn ? (
            <div className="space-y-1">
              <Link href="/profile" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  {userName}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          ) : (
            <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function NavLink({ href, children, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
      )}
    >
      {children}
    </Link>
  );
}
