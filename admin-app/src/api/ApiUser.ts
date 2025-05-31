"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";
dotenv.config();
export async function getAllUser() {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = data.json();
  console.log(res);

  return res;
}
export async function CreateUser(Data: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data),
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = data.json();
  console.log(res);

  return res;
}
export async function getUserById(id: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/getuser/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = await data.json();
  return res;
}
export async function UpdateUser(Data: any, id: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data),
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
export async function DeleteUser(id: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/deleteuser/${id}`, {
    method: "DELETE",

    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
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
