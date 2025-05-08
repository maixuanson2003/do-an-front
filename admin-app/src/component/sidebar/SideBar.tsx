// components/admin/Sidebar.tsx
"use client";
import { Album, Library, Music2, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  {
    label: "Quản lý Album",
    icon: Album,
    path: "/album",
    color: "text-pink-500",
  },
  {
    label: "Quản lý Tuyển tập",
    icon: Library,
    path: "/collection",
    color: "text-yellow-500",
  },
  {
    label: "Quản lý Người dùng",
    icon: Users,
    path: "/user",
    color: "text-blue-500",
  },
  {
    label: "Quản lý Bài hát",
    icon: Music2,
    path: "/song",
    color: "text-green-500",
  },
  {
    label: "Quản lý nghệ sĩ",
    icon: Music2,
    path: "/artist",
    color: "text-green-500",
  },
];

const Sidebar = ({ open, toggle }: { open: boolean; toggle: () => void }) => {
  return (
    <aside
      className={`bg-gray-900 text-white ${
        open ? "w-64" : "w-20"
      } transition-all duration-300 p-4`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{open ? "🎵 Admin Panel" : "🎵"}</h2>
        <button onClick={toggle}>
          <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
            <path d="M6 10h8M6 6h8M6 14h8" />
          </svg>
        </button>
      </div>

      <nav className="space-y-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
          >
            <item.icon className={`${item.color}`} />
            {open && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <button className="flex items-center gap-3 p-2 w-full text-sm text-red-400 hover:bg-red-600 hover:text-white rounded transition">
          <LogOut />
          {open && "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
