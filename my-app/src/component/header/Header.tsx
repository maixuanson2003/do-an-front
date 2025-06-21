"use client";
import {
  Music,
  User,
  LogOut,
  Lock,
  Bot,
  Menu,
  Library,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Logout, checkLogin } from "@/api/ApiUser";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Side drawer for mobile

export default function Header() {
  const router = useRouter();
  const isLogin = useAuthStore((state) => state.isLogin);
  const setLogout = useAuthStore((state) => state.setLogout);
  const setLogin = useAuthStore((state) => state.setLogin);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await Logout();
    setLogout();
    router.push("/");
  };

  useEffect(() => {
    const handleCheck = async () => {
      const checkLogins = await checkLogin();
      if (checkLogins) setLogin();
    };
    handleCheck();
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1e1e1e] to-[#121212] text-white shadow-md">
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-2xl font-bold text-green-400 hover:cursor-pointer hover:text-white transition-all"
      >
        <Music className="w-6 h-6" />
        MyMusic
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-3">
        <Button
          onClick={() => router.push("/compe")}
          variant="ghost"
          className="text-gray-300 hover:text-green-400 transition-colors"
        >
          BXH
        </Button>
        <Button
          onClick={() => router.push("/chatbot")}
          variant="ghost"
          className="text-gray-300 hover:text-green-400 transition-colors"
        >
          <Bot className="w-4 h-4 mr-1" />
          Chatbot
        </Button>
        <Button
          onClick={() => router.push("/collection")}
          variant="ghost"
          className="text-gray-300 hover:text-green-400 transition-colors"
        >
          Tuyển tập
        </Button>
        <Button
          onClick={() => router.push("/song")}
          variant="ghost"
          className="text-gray-300 hover:text-green-400 transition-colors"
        >
          Bài hát
        </Button>
        <Button
          onClick={() => router.push("/artist")}
          variant="ghost"
          className="text-gray-300 hover:text-green-400 transition-colors"
        >
          Nghệ sĩ
        </Button>

        {!isLogin ? (
          <>
            <Button
              onClick={() => router.push("/register")}
              variant="ghost"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Đăng ký
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="border border-gray-500 text-gray-200 hover:text-green-400 hover:border-green-400 bg-transparent transition-colors"
            >
              <User className="w-5 h-5 mr-1" />
              Đăng nhập
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold cursor-pointer hover:opacity-90 transition">
                S
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-white text-black shadow-lg rounded-md"
            >
              <DropdownMenuItem
                onClick={() => router.push("/changepassword")}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Lock className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile menu (hamburger) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#1e1e1e] text-white">
            <div className="flex flex-col gap-4 mt-8">
              <Button
                onClick={() => router.push("/compe")}
                variant="ghost"
                className="justify-start text-gray-300 hover:text-green-400"
              >
                BXH
              </Button>
              <Button
                onClick={() => router.push("/chatbot")}
                variant="ghost"
                className="justify-start text-gray-300 hover:text-green-400"
              >
                <Bot className="w-4 h-4 mr-2" />
                Chatbot
              </Button>
              <Button
                onClick={() => router.push("/collection")}
                variant="ghost"
                className="justify-start text-gray-300 hover:text-green-400"
              >
                Tuyển tập
              </Button>
              <Button
                onClick={() => router.push("/song")}
                variant="ghost"
                className="justify-start text-gray-300 hover:text-green-400"
              >
                Bài hát
              </Button>
              <Button
                onClick={() => router.push("/artist")}
                variant="ghost"
                className="justify-start text-gray-300 hover:text-green-400"
              >
                Tác giả
              </Button>

              {!isLogin ? (
                <>
                  <Button
                    onClick={() => router.push("/register")}
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-green-400"
                  >
                    Đăng ký
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-green-400"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => router.push("/changepassword")}
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-green-400"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-green-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
