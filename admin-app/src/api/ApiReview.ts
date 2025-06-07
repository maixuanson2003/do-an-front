"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";
dotenv.config();
export async function getAllReview() {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/reviewlist`, {
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
export async function updateReview(id: any, reviewData: any) {
  try {
    const url = process.env.BASE_URL;
    console.log("status:", reviewData);
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const param = new URLSearchParams({
      reviewid: id,
      status: reviewData,
    });
    const res = await fetch(`${url}/api/updatereview?${param}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update review");
    }

    return await res.json(); // { message, status }
  } catch (err: any) {
    throw new Error(err.message);
  }
}
export async function deleteReview(id: number) {
  try {
    const url = process.env.BASE_URL;
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const res = await fetch(`${url}/api/deletereview/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
