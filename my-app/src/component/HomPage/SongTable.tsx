import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

const topSongs = [
  { title: "Em Bé", artist: "AMEE" },
  { title: "Idol", artist: "YOASOBI" },
  { title: "Waiting For You", artist: "MONO" },
  { title: "See Tình", artist: "Hoàng Thuỳ Linh" },
  { title: "As If It's Your Last", artist: "BLACKPINK" },
];

export default function TopSongsTable() {
  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">
        📈 Bảng xếp hạng - Top bài hát tuần này
      </h2>
      <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-white/5 backdrop-blur-sm">
            <tr className="text-sm uppercase text-zinc-300">
              <th className="p-4">#</th>
              <th className="p-4">Bài hát</th>
              <th className="p-4">Ca sĩ</th>
              <th className="p-4 text-right">▶️</th>
            </tr>
          </thead>
          <tbody>
            {topSongs.map((song, index) => (
              <tr
                key={index}
                className="group border-b border-white/5 hover:bg-white/5 hover:backdrop-blur-md transition-all duration-200"
              >
                <td className="p-4 font-bold text-lg text-pink-400 group-hover:text-pink-300">
                  {index + 1}
                </td>
                <td className="p-4 font-medium text-white group-hover:text-white">
                  {song.title}
                </td>
                <td className="p-4 text-zinc-300 group-hover:text-zinc-100">
                  {song.artist}
                </td>
                <td className="p-4 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white group-hover:text-green-400"
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
