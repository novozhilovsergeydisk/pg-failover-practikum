import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "PG Practikum — Практикум по PostgreSQL",
    template: "%s | PG Practikum",
  },
  description: "Учебный стенд для отработки физического резервирования кластера PostgreSQL через потоковую репликацию. 30+ практических заданий, TLS, failover, pg_rewind.",
  keywords: ["PostgreSQL", "репликация", "резервирование", "failover", "practicum", "обучение", "DBA"],
  authors: [{ name: "PG Practikum" }],
  creator: "PG Practikum",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://appuse.ru",
    siteName: "PG Practikum",
    title: "PG Practikum — Практикум по PostgreSQL",
    description: "Учебный стенд для отработки физического резервирования кластера PostgreSQL через потоковую репликацию.",
    images: [
      {
        url: "https://appuse.ru/og-image.png",
        width: 1200,
        height: 630,
        alt: "PG Practikum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PG Practikum — Практикум по PostgreSQL",
    description: "Учебный стенд для отработки физического резервирования кластера PostgreSQL.",
    images: ["https://appuse.ru/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
