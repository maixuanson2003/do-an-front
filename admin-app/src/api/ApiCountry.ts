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
export async function createCountry(name: string) {
  const url = process.env.BASE_URL;
  const res = await fetch(
    `${url}/api/create/country?namecountry=${encodeURIComponent(name)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to create country");
  return res.json();
}
export async function updateCountry(id: number, name: string) {
  const url = process.env.BASE_URL;
  const res = await fetch(
    `${url}/api/updateregion?countryid=${id}&namecountry=${encodeURIComponent(
      name
    )}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to update country");
  return res.json();
}
export async function deleteCountry(id: number) {
  const url = process.env.BASE_URL;
  const res = await fetch(`${url}/api/deletecountry/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete country");
  return res.json();
}
export async function getCountryById(id: number) {
  const url = process.env.BASE_URL;
  const res = await fetch(`${url}/api/country/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country by ID");
  return res.json();
}
