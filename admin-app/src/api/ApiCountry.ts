"use server";
import dotenv from "dotenv";
dotenv.config();
export async function getListCountry() {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/country/list`, {
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
