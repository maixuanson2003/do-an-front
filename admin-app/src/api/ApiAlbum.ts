"use server";
import dotenv from "dotenv";
dotenv.config();
export async function getListAlbum() {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/album/getlist`, {
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
export async function CreateAlbum(DataCreate: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/createalbum`, {
    method: "POST",
    cache: "no-store",
    body: DataCreate,
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
export async function DeleteAlbumById(albumId: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/deletealbum/${albumId}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
export async function updateAlbum(albumId: any, updateData: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(`${url}/api/updatealbum/${albumId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(updateData),
  });
  if (!data.ok) {
    throw new Error("Failed to update album");
  }
  const res = await data.json();
  return res;
}
export async function getAlbumById(id: string | number) {
  const url = process.env.BASE_URL;
  const data = await fetch(`${url}/api/album/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch album by ID");
  }
  const res = await data.json();
  return res;
}
