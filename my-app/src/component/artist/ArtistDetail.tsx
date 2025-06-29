"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, Disc, Calendar, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getArtistById } from "@/api/ApiArtist";
import { useAudioPlayer } from "../music/AudioPlayerContext";
const ArtistPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { playSong, setListToPlay } = useAudioPlayer();
  const [data, setData] = useState<any>([]);

  // Function to generate a vibrant gradient color based on album name
  const generateGradient = (name: string) => {
    // Simple hash function to generate consistent color based on text
    const hash = Array.from(name).reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
      0
    );

    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-400",
      "from-emerald-500 to-teal-400",
      "from-rose-500 to-orange-400",
      "from-indigo-600 to-blue-400",
      "from-amber-500 to-yellow-400",
      "from-green-500 to-emerald-400",
      "from-red-500 to-rose-400",
    ];

    return gradients[Math.abs(hash) % gradients.length];
  };

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
  }, [id]);

  const handlePlay = (song: any) => {
    console.log("Phát bài hát:", song.NameSong);
    // TODO: Tích hợp audio player hoặc dispatch sang context
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
          {data?.artist?.Image ? (
            <img
              src={data.artist.Image}
              alt={data.artist.Name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-5xl font-bold">
              {data?.artist?.Name?.charAt(0) || "A"}
            </div>
          )}
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-4xl font-bold">{data?.artist?.Name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
            <p className="text-sm text-gray-400 px-3 py-1 bg-gray-800 rounded-full">
              {data?.artist?.BirthDay}
            </p>
            <p className="text-sm text-gray-400 px-3 py-1 bg-gray-800 rounded-full">
              {data?.artist?.Country}
            </p>
          </div>
          <p className="mt-4 text-gray-300 max-w-2xl">
            {data?.artist?.Description}
          </p>
        </div>
      </div>

      {/* Albums */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Album Đóng góp</h2>
          {data?.album?.length > 0 && (
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push(`/artist/${id}/albums`)}
            >
              Xem tất cả
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.album?.map((albumItem: any) => (
            <div
              key={albumItem.ID}
              onClick={() => router.push(`/artist/album?id=${albumItem.ID}`)}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group"
            >
              {/* ------- ẢNH BÌA / GRADIENT PLACEHOLDER ------- */}
              {albumItem.Image ? (
                <img
                  src={albumItem.Image}
                  alt={albumItem.NameAlbum}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  className={`w-full h-48 flex items-center justify-center bg-gradient-to-br ${generateGradient(
                    albumItem.NameAlbum
                  )}`}
                >
                  <Disc className="w-12 h-12 text-white/80" />
                </div>
              )}

              {/* ------- LỚP MỜ TRÊN ẢNH ------- */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* ------- THÔNG TIN ALBUM ------- */}
              <div className="p-4 bg-neutral-900/80 backdrop-blur-sm">
                <h3 className="font-bold text-lg truncate mb-1">
                  {albumItem.NameAlbum}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(albumItem.ReleaseDay).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* -------- Placeholder nếu chưa có album -------- */}
          {(!data?.album || data.album.length === 0) &&
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className={`bg-gradient-to-br ${
                    [
                      "from-purple-600 to-pink-500",
                      "from-blue-600 to-cyan-500",
                      "from-emerald-500 to-green-500",
                      "from-orange-500 to-amber-500",
                    ][index % 4]
                  } rounded-lg overflow-hidden shadow-lg`}
                >
                  <div className="p-6 flex flex-col items-center justify-center min-h-48">
                    <div className="rounded-full bg-black/20 p-4 mb-3">
                      <Disc className="w-10 h-10 opacity-70" />
                    </div>
                    <p className="text-center text-white/70">
                      Chưa có thông tin album
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Songs */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Bài hát</h2>
          {data?.song?.length > 0 && (
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push(`/artist/${id}/songs`)}
            >
              Xem tất cả
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {data?.song?.map((songItem: any, index: number) => (
            <div
              key={songItem.ID}
              className={`flex justify-between items-center bg-gradient-to-r ${
                index % 2 === 0
                  ? "from-neutral-800/70 to-neutral-900/70"
                  : "from-neutral-900/70 to-neutral-800/70"
              } backdrop-blur-sm p-4 rounded-lg hover:bg-neutral-700/70 transition group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>

              <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-medium text-lg">
                    {songItem.NameSong}
                  </span>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(songItem.ReleaseDay).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 z-10">
                <div className="text-right hidden md:block">
                  <span className="text-sm text-gray-400">Lượt nghe: </span>
                  <span className="font-medium">
                    {songItem.ListenAmout || 0}
                  </span>
                </div>
                <button
                  onClick={() =>
                    playSong({
                      Id: songItem.ID,
                      name: songItem.NameSong,
                      artist: "",
                      url: songItem.SongResource,
                    })
                  }
                  className="bg-green-500 hover:bg-green-600 text-black p-3 rounded-full transition-all flex items-center justify-center shadow-lg"
                >
                  <Play size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Display placeholder if there are no songs */}
          {(!data?.song || data.song.length === 0) && (
            <div className="bg-neutral-800/70 backdrop-blur-sm p-8 rounded-lg text-center">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-10 h-10" />
              </div>
              <p className="text-xl font-medium mb-2">Chưa có bài hát</p>
              <p className="text-gray-400">
                Bài hát của nghệ sĩ sẽ hiển thị tại đây
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArtistPage;
