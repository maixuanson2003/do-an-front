"use server";
import dotenv from "dotenv";
import { utimes } from "fs";
import { cookies } from "next/headers";
dotenv.config();
export async function SearchSong(keywords: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    keyword: keywords,
  });
  const data = await fetch(url + `/api/search?${queryParams}`, {
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
export async function GetAllSong(page: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    page: page,
  });
  const data = await fetch(url + `/api/getsongall?${queryParams}`, {
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
export async function GetSongById(Id: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/getsong/${Id}`, {
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

  console.log(res);

  return res;
}
export async function CreateSong(formData: FormData) {
  const url = process.env.BASE_URL;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const response = await fetch(url + `/api/song/create`, {
    method: "POST",
    body: formData, // KHÔNG cần set headers
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to call API");
  }

  const res = await response.json();
  console.log(res);

  return res;
}
export async function UpdateSong(formData: FormData, id: any) {
  const url = process.env.BASE_URL;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const response = await fetch(url + `/api/updatesong/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to call API");
  }

  const res = await response.json();
  console.log(res);

  return res;
}
export async function DeleteSong(id: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    songid: id,
  });
  console.log(url);
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const response = await fetch(url + `/api/delete/song?${queryParams}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} - ${errorText}`);
    throw new Error("Failed to call API");
  }

  const res = await response.json();
  console.log(res);

  return res;
}
