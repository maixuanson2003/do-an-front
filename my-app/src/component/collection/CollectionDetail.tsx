"use client";
import {
  Music,
  Play,
  Search,
  Heart,
  MoreHorizontal,
  Clock,
  Volume2,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);

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

  const filteredSongs = songs.filter(
    (song: any) =>
      song.NameSong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.Description &&
        song.Description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
      {/* Header Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/40 via-purple-800/20 to-transparent"></div>

        <div className="relative p-8 pb-6">
          {/* Collection Info */}
          <div className="flex items-end space-x-6 mb-8">
            {/* Album Cover */}
            <div className="relative group">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl flex items-center justify-center">
                <Music size={80} className="text-white/80" />
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-black/10 transition-all duration-300"></div>
            </div>

            {/* Collection Details */}
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                Playlist
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Danh sách bài hát
              </h1>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <span className="font-semibold text-white">Bộ sưu tập</span>
                <span>•</span>
                <span>{songs.length} bài hát</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handlePlaySongList(songs)}
              className="group relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Play size={20} className="text-black ml-1" fill="currentColor" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <Heart size={32} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <MoreHorizontal size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-8 pb-4">
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm trong playlist này"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
          />
        </div>
      </div>

      {/* Songs List */}
      <div className="px-8 pb-20">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider border-b border-white/10">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Tiêu đề</div>
          <div className="col-span-3">Mô tả</div>
          <div className="col-span-2 text-center">Điểm</div>
          <div className="col-span-1 flex justify-center">
            <Clock size={16} />
          </div>
        </div>

        {/* Songs */}
        <div className="space-y-1 mt-4">
          {filteredSongs.map((song: any, index: any) => (
            <div
              key={song.ID || index}
              className="group grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredSong(index)}
              onMouseLeave={() => setHoveredSong(null)}
            >
              {/* Track Number / Play Button */}
              <div className="col-span-1 flex items-center justify-center">
                {hoveredSong === index ? (
                  <button
                    onClick={() =>
                      playSong({
                        Id: song.ID,
                        name: song.NameSong,
                        artist: "",
                        url: song.SongResource,
                      })
                    }
                    className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play size={12} fill="currentColor" />
                  </button>
                ) : (
                  <span className="text-white/40 text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Song Info */}
              <div className="col-span-5 flex items-center space-x-4">
                {/* Thumbnail */}
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                  <Music size={16} className="text-white" />
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                    {song.NameSong}
                  </p>
                  <p className="text-white/60 text-sm truncate">Nghệ sĩ</p>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-3 flex items-center">
                <p className="text-white/60 text-sm truncate">
                  {song.Description || "Không có mô tả"}
                </p>
              </div>

              {/* Points */}
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-green-400 font-semibold">
                  {song.Point?.toLocaleString() || 0}
                </span>
              </div>

              {/* Duration / Actions */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  {hoveredSong === index && (
                    <button className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white transition-all">
                      <Heart size={16} />
                    </button>
                  )}
                  <span className="text-white/40 text-sm">
                    {formatDuration(Math.floor(Math.random() * 240) + 120)}
                  </span>
                  {hoveredSong === index && (
                    <button className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSongs.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} className="text-white/40" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-white/60">
                  Hãy thử tìm kiếm với từ khóa khác
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Playlist Stats */}
        {songs.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center space-x-6">
                <span>{songs.length} bài hát</span>
                <span>Khoảng {Math.floor(songs.length * 3.5)} phút</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span>Chất lượng cao</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
