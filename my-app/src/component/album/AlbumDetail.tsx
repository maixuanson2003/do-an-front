"use client";
import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAlbumById } from "@/api/ApiAlbum";
import { useAudioPlayer } from "../music/AudioPlayerContext";
interface SongResponse {
  id: number;
  title: string;
  duration: string;
}

interface ArtistResponse {
  id: number;
  name: string;
}

interface AlbumResponse {
  id: number;
  nameAlbum: string;
  description: string;
  releaseDay: string;
  artistOwner: string;
  createDay: string;
  updateDay: string;
  song: SongResponse[];
  artist: ArtistResponse[];
}

const AlbumDetailPage = () => {
  const handlePlay = (song: SongResponse) => {
    console.log("Phát bài hát:", song.title);
  };
  const { playSong } = useAudioPlayer();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [album, setAlbum] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getAlbumById(Number(id));
      console.log(data);

      setAlbum(data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white p-6">
      {/* Album Info */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{album.NameAlbum}</h1>
        <p className="text-sm text-gray-400">Phát hành: {album.ReleaseDay}</p>
        <p className="text-sm text-gray-400">Tác giả: {album.ArtistOwner}</p>
        <p className="mt-4 text-gray-300 max-w-3xl">{album.Description}</p>
      </div>

      {/* Contributing Artists */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Nghệ sĩ đóng góp</h2>
        <div className="flex flex-wrap gap-4">
          {album.Artist?.map((a: any) => (
            <div
              key={a.ID}
              className="bg-neutral-800 px-4 py-2 rounded-full hover:bg-neutral-700 transition"
            >
              {a.Name}
            </div>
          ))}
        </div>
      </section>

      {/* Songs in Album */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Danh sách bài hát</h2>
        <div className="space-y-2">
          {album.Song?.map((s: any) => (
            <div
              key={s.ID}
              className="flex justify-between items-center bg-neutral-800 p-3 rounded hover:bg-neutral-700 transition"
            >
              <div>
                <span>{s.NameSong}</span>
                <span className="block text-sm text-gray-400">{s.Point}</span>
              </div>
              <button
                onClick={() =>
                  playSong({
                    Id: s.ID,
                    name: s.NameSong,
                    artist: "",
                    url: s.SongResource,
                  })
                }
                // onClick={() => handlePlay(s)}
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

export default AlbumDetailPage;
