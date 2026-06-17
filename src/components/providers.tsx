"use client";

import { AuthProvider } from "@/components/layout/header";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
