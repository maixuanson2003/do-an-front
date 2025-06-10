"use client";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Logout, checkLogin } from "@/api/ApiUser";
import { useEffect } from "react";

// ShadCN dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const isLogin = useAuthStore((state) => state.isLogin);
  const setLogout = useAuthStore((state) => state.setLogout);
  const setLogin = useAuthStore((state) => state.setLogin);

  const handleLogout = async () => {
    await Logout();
    setLogout();
    router.push("/"); // Chuyển hướng về trang chủ sau khi logout
  };

  useEffect(() => {
    const handleCheck = async () => {
      let checkLogins = await checkLogin();
      if (checkLogins) setLogin();
    };
    handleCheck();
  }, []);

  return (
    <header className="flex items-center justify-between z-50 p-4 bg-[#121212] text-white shadow-md">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="text-xl font-bold text-green-500 hover:cursor-pointer"
      >
        MyMusic
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push("/compe")}
          variant="ghost"
          className="text-gray-300 hover:text-black"
        >
          BXH
        </Button>
        <Button
          onClick={() => router.push("/collection")}
          variant="ghost"
          className="text-gray-300 hover:text-black"
        >
          Tuyển tập
        </Button>
        <Button
          onClick={() => router.push("/song")}
          variant="ghost"
          className="text-gray-300 hover:text-black"
        >
          Bài hát
        </Button>
        <Button
          onClick={() => router.push("/artist")}
          variant="ghost"
          className="text-gray-300 hover:text-black"
        >
          Ca sĩ
        </Button>

        {!isLogin ? (
          <>
            <Button
              onClick={() => router.push("/register")}
              variant="ghost"
              className="text-gray-300 hover:text-black"
            >
              Đăng ký
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="text-gray-300 hover:text-black"
            >
              <User className="w-5 h-5" />
            </Button>
          </>
        ) : (
          // Dropdown menu khi đã đăng nhập
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold cursor-pointer">
                S
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-white text-black"
            >
              <DropdownMenuItem
                onClick={() => router.push("/changepassword")}
                className="cursor-pointer"
              >
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
