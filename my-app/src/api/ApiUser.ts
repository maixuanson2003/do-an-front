"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";

dotenv.config();
export async function login(dataLogin: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + "/api/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(dataLogin),
  });
  if (!data.ok) {
    throw new Error("faile to login");
  }
  let res = await data.json();
  const token = res.Token;
  console.log(token);
  if (token) {
    (await cookies()).set("token", token);
  }
  return res;
}
export async function register(dataRegister: any) {
  const url = process.env.BASE_URL;
  const res = await fetch(url + `/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    cache: "no-store",
    body: JSON.stringify(dataRegister),
  });
  const data = await res.json();
  return data;
}
export async function Logout() {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
}
export async function checkLogin() {
  const cookieStore = cookies();
  let token = (await cookieStore).get("token");
  if (!token) {
    return false;
  }
  return true;
}
export async function sendOtp(email: string) {
  const url = process.env.BASE_URL;
  const response = await fetch(
    `${url}/api/sendotp?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send OTP");
  }

  const result = await response.json();
  return result;
}
export async function checkOtp(otp: string) {
  const url = process.env.BASE_URL;
  const response = await fetch(
    `${url}/api/checkotp?otp=${encodeURIComponent(otp)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Invalid OTP");
  }

  const result = await response.json();
  return result;
}
export async function changePassword(newPassword: any, userid: any) {
  const queryParams = new URLSearchParams({
    newpassword: newPassword,
    userid: userid,
  });
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const url = process.env.BASE_URL;
  const res = await fetch(url + `/api/change/password?${queryParams}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Lỗi không xác định");
  return data;
}
export async function resetPassword(email: any, newPassword: any) {
  const queryParams = new URLSearchParams({
    newpassword: newPassword,
    email: email,
  });

  const url = process.env.BASE_URL;
  const res = await fetch(url + `/api/reset/password?${queryParams}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Lỗi không xác định");
  return data;
}
