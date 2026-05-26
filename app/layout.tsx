import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/store";
import { ToastProvider } from "./_components/toast";
import { GyroProvider } from "./_components/gyro-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneTime — Agendamento online para o seu negócio",
  description:
    "Plataforma SaaS de agendamento online para petshops, barbearias, salões de beleza e prestadores de serviço.",
  manifest: "/manifest.webmanifest",
  applicationName: "OneTime",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OneTime",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overscroll-y-none">
        <DataProvider>
          <ToastProvider>
            <GyroProvider>{children}</GyroProvider>
          </ToastProvider>
        </DataProvider>
      </body>
    </html>
  );
}
