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
export async function searchArtist(keyword: any) {
  const queryParams = new URLSearchParams({
    keyword: keyword,
  });
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/searchart?${queryParams}`, {
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
export async function FilterArtist(CountryId: any) {
  const queryParams = new URLSearchParams({
    countryid: CountryId,
  });
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/filterart?${queryParams}`, {
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
