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
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  console.log(token);

  const data = await fetch(url + `/api/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(Data),
    cache: "no-store",
  });

  if (!data.ok) {
    throw new Error("failed to call api");
  }

  return await data.json();
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
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/deleteuser/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
export async function exportUserExcel() {
  const url = process.env.BASE_URL + "/api/admin/users/export";
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không thể xuất file Excel");
  }

  const blob = await res.blob();
  return blob;
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
