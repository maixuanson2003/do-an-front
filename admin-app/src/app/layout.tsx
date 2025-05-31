"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/component/sidebar/SideBar";
import Header from "@/component/header/Header";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <div className="flex min-h-screen">
            <Sidebar open={sidebarOpen} toggle={toggleSidebar} />
            <div className="flex-1 bg-gray-50">
              <Header />
              <main className="p-6">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
