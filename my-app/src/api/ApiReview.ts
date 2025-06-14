"use server";
import dotenv from "dotenv";
import { json } from "stream/consumers";
dotenv.config();
export async function getReviewBySong(SongId: number) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/reviewlistinsong/${SongId}`, {
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
export async function CreateReview(ReviewData: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/createreview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(ReviewData),
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
export async function deleteReview(id: number) {
  try {
    const url = process.env.BASE_URL;
    const res = await fetch(`${url}/api/deletereview/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete review");
    }

    return await res.json(); // { message, status }
  } catch (err: any) {
    throw new Error(err.message);
  }
}
