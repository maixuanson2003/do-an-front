"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { register } from "@/api/ApiUser";
import { sendOtp, checkOtp } from "@/api/ApiUser";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RegisterPage() {
  const router = useRouter();
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

  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await sendOtp(formData.email); // Gửi OTP trước
      setShowOtpModal(true); // Hiện modal
    } catch (err) {
      alert("Không thể gửi OTP. Vui lòng kiểm tra lại email.");
    }
  };

  const handleConfirmOtp = async () => {
    try {
      const result = await checkOtp(otp);
      if (result.success) {
        await register(formData); // Đăng ký nếu OTP đúng
        router.push("/"); // Chuyển về trang chủ
      } else {
        alert("OTP không đúng!");
      }
    } catch (err) {
      alert("Lỗi xác minh OTP!");
    }
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
            type="email"
            name="email"
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

      {/* Modal nhập OTP */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Nhập mã OTP</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            onClick={handleConfirmOtp}
            className="mt-4 bg-green-500 hover:bg-green-600 text-black"
          >
            Xác nhận OTP
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
