"use server";
import dotenv from "dotenv";
dotenv.config();
export async function getAlbumById(albumId: number) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/album/${albumId}`, {
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
