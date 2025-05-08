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
