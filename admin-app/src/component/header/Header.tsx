"use client";

import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserCircle, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedUserId = localStorage.getItem("userid");
    setUserId(storedUserId);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    setUserId(null);
    router.refresh();
  };

  const handleChangePassword = () => {
    router.push(`/changepassword?userid=${userId}`);
  };

  if (!hasMounted) return null;

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">🎛️ Trang quản lý</h1>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <UserCircle className="text-blue-600 cursor-pointer" size={28} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleChangePassword}>
              <KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
