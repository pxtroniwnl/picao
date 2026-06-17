import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Picao — Fútbol en Cartagena",
  description: "Organiza y llena tus picaos de fútbol amateur en Cartagena.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Picao",
  },
};

export const viewport: Viewport = {
  themeColor: "#16171D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
      <body className="font-body">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
