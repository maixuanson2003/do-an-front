"use server";
import dotenv from "dotenv";
dotenv.config();
export async function getListType() {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/listtype`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = data.json();
  return res;
}
export async function createType(type: string) {
  const url = process.env.BASE_URL;
  const res = await fetch(
    url + `/api/createtype?type=${encodeURIComponent(type)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to create type");
  return res.json();
}
export async function updateType(id: number, type: string) {
  const url = process.env.BASE_URL;
  const res = await fetch(
    url + `/api/updatetype?type=${encodeURIComponent(type)}&id=${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to update type");
  return res.json();
}
export async function deleteType(id: number) {
  const url = process.env.BASE_URL;
  const res = await fetch(url + `/api/deletetype/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete type");
  return res.json();
}
export async function getTypeById(id: number) {
  const url = process.env.BASE_URL;
  const res = await fetch(url + `/api/type/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch type by ID");
  return res.json();
}
