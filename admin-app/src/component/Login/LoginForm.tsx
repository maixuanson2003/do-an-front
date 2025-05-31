"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore"; // ✅ đúng cú pháp import store
import { login } from "@/api/ApiUser"; // ✅ giả định đã có API này
import { log } from "console";
import { Logout } from "@/api/ApiUser";
const LoginForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ thêm biến lỗi

  const setLogin = useAuthStore((state) => state.setLogin); // ✅ đúng tên method trong store

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataLogin = {
        Username: username,
        Password: password,
      };

      const data = await login(dataLogin);
      console.log(data.Role);

      if (data.Role != "ADMIN") {
        alert("access denied");
        await Logout();
        return;
      }
      localStorage.setItem("role", data.Role);
      localStorage.setItem("userid", data.UserId);

      setLogin();
      router.push("/");
    } catch (err) {
      setError("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Tên đăng nhập
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // ✅ đúng setter
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="admin"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;
