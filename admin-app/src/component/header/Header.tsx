"use client";

import { useRouter } from "next/navigation";
import { LogIn, UserCircle } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userid") : null;

  const handleLogin = () => {
    router.push("/login"); // Đổi đường dẫn nếu trang login khác
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    router.refresh();
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">🎛️ Trang quản lý</h1>

      {/* Khu vực user hoặc login */}
      <div className="flex items-center gap-3">
        {userId ? (
          <>
            <UserCircle className="text-blue-600" size={24} />
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-lg transition"
          >
            <LogIn size={18} />
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
