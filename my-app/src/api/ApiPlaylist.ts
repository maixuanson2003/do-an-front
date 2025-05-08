"use server";
import dotenv from "dotenv";
dotenv.config();
export async function getPlayListByUserId(Id: any) {
  const url = process.env.BASE_URL;
  let userId = Id;
  const data = await fetch(url + `/api/playlist/${userId}`, {
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
export async function addNewPlayList(namePlayList: any, userId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    nameplaylist: namePlayList,
    userid: userId,
  });
  const data = await fetch(url + `/api/createplay?${queryParams}`, {
    method: "POST",
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
export async function addSongToPlayList(songId: any, playListId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    songid: songId,
    playlistid: playListId,
  });
  const data = await fetch(url + `/api/addsong?${queryParams}`, {
    method: "PUT",
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
export async function getSongByPlayList(playListId: any) {
  const url = process.env.BASE_URL;
  const data = await fetch(url + `/api/songplay/${playListId}`, {
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
