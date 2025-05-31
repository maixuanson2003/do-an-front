"use client";

import { ShieldCheck } from "lucide-react";

export default function AdminWelcome() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <ShieldCheck className="w-16 h-16 text-foreground dark:text-white" />

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome, Admin
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
          This is your admin dashboard. From here, you can manage users, monitor
          activity, and update system settings.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/admin/users"
          >
            Manage Users
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/admin/settings"
          >
            System Settings
          </a>
        </div>
      </main>

      <footer className="row-start-3 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
