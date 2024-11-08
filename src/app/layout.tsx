import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ad Copy Generator",
  description: "Generate and manage AI-powered ad copy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="__next" className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}