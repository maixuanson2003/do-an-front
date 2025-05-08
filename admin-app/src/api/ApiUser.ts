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
