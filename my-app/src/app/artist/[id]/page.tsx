"use client";
import ArtistPage from "@/component/artist/ArtistDetail";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArtistById } from "@/api/ApiArtist";
interface Song {
  id: number;
  title: string;
  duration: string;
}

interface Album {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
}

interface Artist {
  id: number;
  name: string;
  birthDay: string;
  description: string;
  countryId: number;
  albums: Album[];
  featuredSongs: Song[];
  composedSongs: Song[];
}
export const mockArtistData = {
  artist: {
    id: 1,
    name: "Sơn Tùng M-TP",
    birthDay: "1994-07-05",
    description:
      "Sơn Tùng M-TP là một ca sĩ, nhạc sĩ và nhà sản xuất âm nhạc nổi tiếng tại Việt Nam. Anh được biết đến với phong cách âm nhạc hiện đại và cá tính.",
    country: "Việt Nam",
  },
  album: [
    {
      id: 101,
      title: "Chúng Ta Của Hiện Tại",
      coverUrl:
        "https://upload.wikimedia.org/wikipedia/vi/thumb/b/b4/Son_Tung_MTP_-_Chung_ta_cua_hien_tai.jpg/220px-Son_Tung_MTP_-_Chung_ta_cua_hien_tai.jpg",
      releaseDate: "2020-12-20",
    },
    {
      id: 102,
      title: "Sky Tour",
      coverUrl:
        "https://upload.wikimedia.org/wikipedia/vi/7/76/Sky_Tour_Son_Tung.jpg",
      releaseDate: "2019-07-07",
    },
  ],
  song: [
    {
      id: 201,
      nameSong: "Lạc Trôi",
      description: "Bài hát cổ trang pha trộn nhạc điện tử",
      releaseDay: "2017-01-01T00:00:00Z",
      createDay: "2016-12-01T00:00:00Z",
      updateDay: "2017-02-01T00:00:00Z",
      point: 9.2,
      likeAmount: 25000,
      status: "public",
      countryId: 1,
      listenAmout: 5000000,
      albumId: 101,
      songResource: "/music/lac-troi.mp3",
    },
    {
      id: 202,
      nameSong: "Chạy Ngay Đi",
      description: "Bản hit nổi bật năm 2018",
      releaseDay: "2018-05-12T00:00:00Z",
      createDay: "2018-04-01T00:00:00Z",
      updateDay: "2018-06-01T00:00:00Z",
      point: 8.8,
      likeAmount: 18000,
      status: "public",
      countryId: 1,
      listenAmout: 4200000,
      albumId: 102,
      songResource: "/music/chay-ngay-di.mp3",
    },
  ],
};

export default function ArtistDetails() {
  return <ArtistPage />;
}
