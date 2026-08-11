import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kashmir AI — Kashmir Valley Digital Assistant & Tourism Platform",
  description: "Intelligent Kashmir AI Agent understanding local places, tourism, hotels, weather, transport, education, and businesses in English, Urdu, and Kashmiri.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
