"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/api/ApiUser";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.setLogin);

  const handleLogin = async () => {
    const dataLogin = {
      Username: username,
      Password: password,
    };
    const data = await login(dataLogin);
    localStorage.setItem("role", data.Role);
    localStorage.setItem("userid", data.UserId);
    setLogin();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Đăng nhập</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <Input
              type="text"
              placeholder="your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold"
          >
            Đăng nhập
          </Button>

          <div className="flex justify-end mt-2">
            <Link
              href="/forgotpassword"
              className="text-sm text-blue-400 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <p className="text-sm text-center text-gray-400 mt-4">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-green-400 hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
