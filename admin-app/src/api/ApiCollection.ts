"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";
dotenv.config();
export async function getListCollection() {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/listcollect`, {
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
export async function getCollectionDetail(id: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/collect/${id}`, {
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
export async function CreateCollection(CreateData: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    namecollection: CreateData,
  });
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/createcollect?${queryParams}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
export async function addSongToCollection(collectionId: any, SongId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    collectionid: collectionId,
    songid: SongId,
  });
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/addtocollect?${queryParams}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
export async function removeSongFromCollection(collectionId: any, SongId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    collectionid: collectionId,
    songid: SongId,
  });
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/deletesongcollect?${queryParams}`, {
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
  return res;
}
export async function DeleteCollection(collectionId: any) {
  const url = process.env.BASE_URL;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const data = await fetch(url + `/api/deletecollect/${collectionId}`, {
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
  return res;
}
