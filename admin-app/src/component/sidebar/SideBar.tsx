"use client";
import {
  Album,
  Library,
  Users,
  Music,
  Mic2,
  MessageCircle,
  Tags,
  Globe,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "@/api/ApiUser";
import { useAuthStore } from "@/store/authStore";

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
    icon: Music,
    path: "/song",
    color: "text-green-500",
  },
  {
    label: "Quản lý nghệ sĩ",
    icon: Mic2,
    path: "/artist",
    color: "text-purple-500",
  },
  {
    label: "Quản lý bình luận",
    icon: MessageCircle,
    path: "/review",
    color: "text-teal-500",
  },
  {
    label: "Quản lý thể loại",
    icon: Tags,
    path: "/songtype",
    color: "text-orange-500",
  },
  {
    label: "Quản lý quốc gia",
    icon: Globe,
    path: "/country",
    color: "text-indigo-500",
  },
];

const Sidebar = ({ open, toggle }: { open: boolean; toggle: () => void }) => {
  const router = useRouter();
  const setLogout = useAuthStore((state) => state.setLogout);

  const handleLogout = async () => {
    await Logout();
    setLogout();
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    router.push("/login");
  };

  return (
    <aside
      className={`bg-gray-900 text-white ${
        open ? "w-64" : "w-20"
      } transition-all duration-300 p-4`}
    >
      <div
        onClick={() => router.push("/")}
        className="flex items-center justify-between mb-6 hover:cursor-pointer"
      >
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 w-full text-sm text-red-400 hover:bg-red-600 hover:text-white rounded transition"
        >
          <LogOut />
          {open && "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
