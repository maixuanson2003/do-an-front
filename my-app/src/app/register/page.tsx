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
