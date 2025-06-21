"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { register, sendOtp, checkOtp } from "@/api/ApiUser";
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

  const validateForm = () => {
    const { username, password, fullName, phone, email, address, gender, age } =
      formData;

    if (
      !username ||
      !password ||
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !gender ||
      !age
    ) {
      alert("Vui lòng điền đầy đủ tất cả các trường.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ.");
      return false;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone)) {
      alert("Số điện thoại không hợp lệ (9-11 chữ số).");
      return false;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 10 || ageNumber > 100) {
      alert("Tuổi phải là số hợp lệ từ 10 đến 100.");
      return false;
    }

    if (!["nam", "nữ", "Nam", "Nữ"].includes(gender)) {
      alert("Giới tính phải là 'Nam' hoặc 'Nữ'.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await sendOtp(formData.email);
      setShowOtpModal(true);
    } catch {
      alert("Không thể gửi OTP. Vui lòng kiểm tra lại email.");
    }
  };

  const handleConfirmOtp = async () => {
    try {
      const result = await checkOtp(otp);
      if (result.success) {
        await register(formData);
        router.push("/");
      } else {
        alert("OTP không đúng!");
      }
    } catch {
      alert("Lỗi xác minh OTP!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4 text-white">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <UserPlus className="text-green-400" />
          Đăng ký tài khoản
        </h1>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="username"
            placeholder="Tên đăng nhập"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            name="fullName"
            placeholder="Họ và tên"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Số điện thoại"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            name="address"
            placeholder="Địa chỉ"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            name="gender"
            placeholder="Giới tính (Nam/Nữ)"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
          <Input
            name="age"
            placeholder="Tuổi"
            className="bg-zinc-800 text-white placeholder-gray-400"
            onChange={handleChange}
          />
        </form>

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
            className="bg-zinc-800 text-white placeholder-gray-400"
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
