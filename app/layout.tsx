import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React & Tailwind Screening Interview",
  description: "Technical screening interview for React v19 and Tailwind CSS v4 expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
          {children}
        </div>
      </body>
    </html>
  );
}
