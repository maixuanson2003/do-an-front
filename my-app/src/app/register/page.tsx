"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { register } from "@/api/ApiUser";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const data = await register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <UserPlus className="w-7 h-7 text-green-400" />
          Đăng ký tài khoản
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="fullName"
            placeholder="Họ và tên"
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Số điện thoại"
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <Input name="address" placeholder="Địa chỉ" onChange={handleChange} />
          <Input
            name="gender"
            placeholder="Giới tính (Nam/Nữ)"
            onChange={handleChange}
          />
          <Input name="age" placeholder="Tuổi" onChange={handleChange} />
        </div>
        <Button
          onClick={handleRegister}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
        >
          Đăng ký
        </Button>
      </div>
    </div>
  );
}
