"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendOtp, checkOtp, changePassword } from "@/api/ApiUser";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email) return alert("Vui lòng nhập email");
    const data = await sendOtp(email);
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert("Vui lòng nhập mã xác thực");
    const data = await checkOtp(otp);
    if (data.success) {
      setStep("new-password");
    } else {
      alert("otp not valid");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword)
      return alert("Vui lòng điền đầy đủ thông tin");
    if (newPassword !== confirmPassword) return alert("Mật khẩu không khớp");

    try {
      const userid = localStorage.getItem("userid");
      await changePassword(newPassword, userid);
      alert("Đổi mật khẩu thành công!");
      router.push("/");
    } catch (error: any) {
      alert(error.message || "Lỗi khi đổi mật khẩu");
    }
  };

  return (
    <div className="min-h-screen pl-[250px] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Đổi mật khẩu</h2>

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
            <Button className="w-full mt-4" onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
