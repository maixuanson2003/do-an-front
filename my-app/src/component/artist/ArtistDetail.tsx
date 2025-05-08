"use client";

import React from "react";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getArtistById } from "@/api/ApiArtist";
interface ArtistResponse {
  id: number;
  name: string;
  birthDay: string;
  description: string;
  country: string;
}

interface SongResponse {
  id: number;
  nameSong: string;
  description: string;
  releaseDay: string;
  createDay: string;
  updateDay: string;
  point: number;
  likeAmount: number;
  status: string;
  countryId: number;
  listenAmout: number;
  albumId?: number;
  songResource: string;
}

interface AlbumResponse {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
}
interface Props {
  data: any;
}

const ArtistPage = () => {
  const router = useRouter();
  // const { artist, song, album } = data;

  const handlePlay = (song: SongResponse) => {
    console.log("Phát bài hát:", song.nameSong);
    // TODO: Tích hợp audio player hoặc dispatch sang context
  };
  const params = useParams();
  const id = params?.id; // đảm bảo có tồn tại

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const artist = await getArtistById(Number(id));
        console.log(artist.artist);

        setData(artist);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center text-4xl font-bold">
          {data?.artist?.Name}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{data?.artist?.Name}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Ngày sinh: {data?.artist?.BirthDay}
          </p>
          <p className="text-sm text-gray-400">
            Quốc gia: {data?.artist?.Country}
          </p>
          <p className="mt-3 text-gray-300 max-w-2xl">
            {data?.artist?.Description}
          </p>
        </div>
      </div>

      {/* Albums */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Album nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.album?.map((albumItem: any) => (
            <div
              key={albumItem.ID}
              onClick={() => router.push(`/artist/album?id=${albumItem.ID}`)}
              className="bg-neutral-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
            >
              <img
                // src={albumItem.coverUrl}
                alt={albumItem.NameAlbum}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{albumItem.NameAlbum}</h3>
                <p className="text-sm text-gray-400">
                  Phát hành: {albumItem.ReleaseDay}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Songs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bài hát</h2>
        <div className="space-y-2">
          {data?.song?.map((songItem: any) => (
            <div
              key={songItem.ID}
              className="flex justify-between items-center bg-neutral-800 p-3 rounded hover:bg-neutral-700 transition"
            >
              <div>
                <span>{songItem.NameSong}</span>
                <span className="block text-sm text-gray-400">
                  Ngày phát hành:{" "}
                  {new Date(songItem.releaseDay).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handlePlay(songItem)}
                className="bg-green-500 hover:bg-green-600 text-black p-2 rounded-full"
              >
                <Play size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtistPage;
