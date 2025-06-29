"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";
dotenv.config();
export async function getListArtist() {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/listart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
export async function CreateArtist(formData: any) {
  const url = process.env.BASE_URL;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const res = await fetch(url + `/api/createart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ KHÔNG đặt Content-Type ở đây, trình duyệt sẽ tự gắn boundary đúng!
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create artist");
  }

  return await res.json();
}
export async function getArtistById(artistId: number) {
  const url = process.env.BASE_URL;
  console.log(artistId);

  const data = await fetch(url + `/api/artist/${artistId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
export async function DeleteAritst(artistId: number) {
  const url = process.env.BASE_URL;
  console.log(artistId);
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/deleteartist/${artistId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  console.log(res);

  return res;
}

export async function UpdateArtist(DataCreate: any, artistId: any) {
  const url = process.env.BASE_URL;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/updateartist/${artistId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: DataCreate,
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
