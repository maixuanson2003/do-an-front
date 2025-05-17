"use client";
import { Music, Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getCollectionById } from "@/api/ApiCollection";
import { useParams } from "next/navigation";
import { useAudioPlayer } from "../music/AudioPlayerContext";
const songs = [
  { title: "Bài hát 1", artist: "Ca sĩ A", duration: "3:45" },
  { title: "Bài hát 2", artist: "Ca sĩ B", duration: "4:10" },
  { title: "Bài hát 3", artist: "Ca sĩ C", duration: "2:58" },
];

export default function CollectionDetail() {
  const params = useParams();
  const id = params?.id;
  const { playSong, setListToPlay } = useAudioPlayer();
  const [songs, setSong] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollectionById(Number(id));
      setSong(data.Song);
    };
    fetchData();
  }, []);
  const handlePlaySongList = (Song: any[]) => {
    let songList = [];
    for (let index = 0; index < Song.length; index++) {
      songList.push({
        Id: Song[index].ID,
        name: Song[index].NameSong,
        artist: "",
        url: Song[index].SongResource,
      });
    }
    setListToPlay(songList);
  };
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Header + Search */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-green-500">
            <Music size={28} /> Danh sách bài hát
          </h2>
          <button
            onClick={() => {
              handlePlaySongList(songs);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            <Play className="inline-block mr-2" size={18} />
            Phát tất cả
          </button>
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm bài hát hoặc ca sĩ..."
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Bảng bài hát */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-900">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-green-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Tên bài hát</th>
              <th className="px-6 py-3">Mô tả</th>
              <th className="px-6 py-3">Điểm</th>
              <th className="px-6 py-3 text-center">Phát</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song: any, index: any) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
              >
                <td className="px-6 py-4 font-semibold text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4">{song.NameSong}</td>
                <td className="px-6 py-4">{song.Description}</td>
                <td className="px-6 py-4">{song.Point}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() =>
                      playSong({
                        Id: song.ID,
                        name: song.NameSong,
                        artist: "",
                        url: song.SongResource,
                      })
                    }
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition duration-200"
                  >
                    <Play size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
