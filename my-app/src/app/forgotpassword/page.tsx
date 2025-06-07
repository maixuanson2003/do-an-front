"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendOtp, checkOtp, resetPassword } from "@/api/ApiUser";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email) return alert("Vui lòng nhập email");
    try {
      await sendOtp(email);
      setStep("otp");
    } catch (error: any) {
      alert(error.message || "Gửi OTP thất bại");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert("Vui lòng nhập mã xác thực");
    try {
      const res = await checkOtp(otp);
      if (res.success) {
        setStep("new-password");
      } else {
        alert("Mã OTP không hợp lệ");
      }
    } catch (error: any) {
      alert(error.message || "Xác minh OTP thất bại");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Vui lòng nhập đầy đủ mật khẩu");
    }
    if (newPassword !== confirmPassword) {
      return alert("Mật khẩu không khớp");
    }

    try {
      await resetPassword(email, newPassword);
      alert("Đặt lại mật khẩu thành công!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Lỗi khi đặt lại mật khẩu");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>

        {step === "email" && (
          <>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full mt-4" onClick={handleSendOTP}>
              Gửi mã xác thực
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <label className="block text-sm font-medium">Mã xác thực</label>
            <Input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button className="w-full mt-4" onClick={handleVerifyOTP}>
              Xác nhận OTP
            </Button>
          </>
        )}

        {step === "new-password" && (
          <>
            <label className="block text-sm font-medium">Mật khẩu mới</label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block text-sm font-medium mt-4">
              Xác nhận mật khẩu
            </label>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className="w-full mt-4" onClick={handleResetPassword}>
              Đặt lại mật khẩu
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
