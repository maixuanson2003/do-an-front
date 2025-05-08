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
