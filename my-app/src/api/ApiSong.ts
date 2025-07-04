"use server";
import dotenv from "dotenv";
import { cookies } from "next/headers";
import { log } from "util";
export async function SearchSong(keywords: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    keyword: keywords,
  });
  const data = await fetch(url + `/api/search?${queryParams}`, {
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
export async function GetAllSong() {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/getsongall`, {
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
export async function GetSongLike(userid: any) {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/get/like/${userid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
export const FilterSong = async (artistIds: number[], typeIds: number[]) => {
  try {
    const url = process.env.BASE_URL;
    artistIds.forEach((element) => {
      console.log(element);
    });
    const response = await fetch(
      `http://localhost:8080/api/filtersong?artistId=${artistIds.join(
        ","
      )}&typeId=${typeIds.join(",")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error filtering songs:", error);
    throw error;
  }
};
export async function GetAllSongByArtist(artistId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    artistId: artistId,
  });
  const data = await fetch(url + `/api/getsongall?${queryParams}`, {
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
export async function LikeSong(SongId: any, UserId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    songid: SongId,
    userid: UserId,
  });
  const data = await fetch(url + `/api/Like?${queryParams}`, {
    method: "POST",
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
export async function dishLikeSong(SongId: any, UserId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    songid: SongId,
    userid: UserId,
  });
  const data = await fetch(url + `/api/dishlike?${queryParams}`, {
    method: "POST",
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
export async function RecommendSong(UserId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    userid: UserId,
  });
  const cookieStore = cookies();
  let token = (await cookieStore).get("token");
  const data = await fetch(url + `/api/recommend?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
export async function SaveListen(UserId: any, songId: any) {
  const url = process.env.BASE_URL;
  const queryParams = new URLSearchParams({
    userid: UserId,
    songid: songId,
  });
  const data = await fetch(url + `/api/savehistory?${queryParams}`, {
    method: "POST",
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
export async function getTopSongsThisWeek() {
  const url = process.env.BASE_URL;
  const res = await fetch(`${url}/api/topweek/song`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách bài hát top tuần");
  }

  const data = await res.json();
  return data.data;
}
export async function DownLoad(fileUrl: any) {
  const url = process.env.BASE_URL;
  const res = await fetch(`${url}/api/download/song?url=${fileUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách bài hát top tuần");
  }

  const blob = await res.blob();
  return blob;
}
export async function GetListSong() {
  const url = process.env.BASE_URL;

  const data = await fetch(url + `/api/list/song`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("faile to call api");
  }
  let res = await data.json();
  console.log(res);

  return res;
}
