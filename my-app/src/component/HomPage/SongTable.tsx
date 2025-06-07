"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { getTopSongsThisWeek } from "@/api/ApiSong";
import { useAudioPlayer } from "../music/AudioPlayerContext";
import moment from "moment";

export default function TopSongsTable() {
  const [topSongs, setTopSongs] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const { playSong } = useAudioPlayer();
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getTopSongsThisWeek();
        setTopSongs(songs);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách bài hát.");
      }
    };
    fetchSongs();
  }, []);

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">
        📈 Bảng xếp hạng - Top bài hát tuần này
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-white/5 backdrop-blur-sm">
            <tr className="text-sm uppercase text-zinc-300">
              <th className="p-4">#</th>
              <th className="p-4">Tên bài hát</th>
              <th className="p-4">Lượt nghe</th>
              <th className="p-4">Ngày phát hành</th>
              <th className="p-4">Thích</th>
              <th className="p-4 text-right">▶️</th>
            </tr>
          </thead>
          <tbody>
            {topSongs.map((song: any, index: any) => (
              <tr
                key={song.ID}
                className="group border-b border-white/5 hover:bg-white/5 hover:backdrop-blur-md transition-all duration-200"
              >
                <td className="p-4 font-bold text-lg text-pink-400 group-hover:text-pink-300">
                  {index + 1}
                </td>
                <td className="p-4 text-white font-medium group-hover:text-white">
                  <div>{song.NameSong}</div>
                  <div className="text-xs text-zinc-400">
                    {song.Description}
                  </div>
                </td>
                <td className="p-4 text-zinc-300 group-hover:text-zinc-100">
                  {song.ListenAmout.toLocaleString()}
                </td>
                <td className="p-4 text-zinc-300 group-hover:text-zinc-100">
                  {moment(song.ReleaseDay).format("DD/MM/YYYY")}
                </td>
                <td className="p-4 text-zinc-300 group-hover:text-zinc-100">
                  ❤️ {song.LikeAmount}
                </td>
                <td className="p-4 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white group-hover:text-green-400"
                    onClick={() =>
                      playSong({
                        Id: song.ID,
                        name: song.NameSong,
                        artist: "",
                        url: song.SongResource,
                      })
                    }
                  >
                    <PlayIcon className="w-5 h-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
