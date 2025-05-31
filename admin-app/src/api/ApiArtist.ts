"use server";
import dotenv from "dotenv";
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
export async function CreateArtist(DataCreate: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/createart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(DataCreate),
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
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

  const data = await fetch(url + `/api/deleteartist/${artistId}`, {
    method: "DELETE",
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
  const data = await fetch(url + `/api/updateartist/${artistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(DataCreate),
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  return res;
}
