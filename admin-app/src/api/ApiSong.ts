"use server";
import dotenv from "dotenv";
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
export async function CreateSong(formData: FormData) {
  const url = process.env.BASE_URL;

  const response = await fetch(url + `/api/song/create`, {
    method: "POST",
    body: formData, // KHÔNG cần set headers
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to call API");
  }

  const res = await response.json();
  console.log(res);

  return res;
}
