"use client";
import React, { useEffect, useState } from "react";
import {
  Play,
  Heart,
  Share2,
  Download,
  Clock,
  MoreVertical,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAlbumById } from "@/api/ApiAlbum";
import { useAudioPlayer } from "../music/AudioPlayerContext";

interface SongResponse {
  ID: number;
  NameSong: string;
  Point: string;
  SongResource: string;
}

interface ArtistResponse {
  ID: number;
  Name: string;
}

interface AlbumResponse {
  id: number;
  NameAlbum: string;
  Description: string;
  ReleaseDay: string;
  ArtistOwner: string;
  Song: SongResponse[];
  Artist: ArtistResponse[];
}

const AlbumDetailPage = () => {
  const { playSong, setListToPlay } = useAudioPlayer();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getAlbumById(Number(id));
      console.log(data);
      setAlbum(data);
    };
    fetchData();
  }, [id]);

  const handlePlay = (song: SongResponse) => {
    playSong({
      Id: song.ID,
      name: song.NameSong,
      artist: album?.ArtistOwner || "",
      url: song.SongResource,
    });
  };
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
  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải album...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent"></div>

        <div className="relative px-8 pt-24 pb-8">
          <div className="flex items-end gap-8 max-w-7xl mx-auto">
            {/* Album Cover */}
            <div className="relative group">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg shadow-2xl flex items-center justify-center">
                <div className="text-6xl">🎵</div>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button className="w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                  <Play size={24} className="text-black ml-1" />
                </button>
              </div>
            </div>

            {/* Album Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-300 mb-2">ALBUM</p>
              <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                {album.NameAlbum}
              </h1>
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <span className="font-medium text-white">
                  {album.ArtistOwner}
                </span>
                <span>•</span>
                <span>{new Date(album.ReleaseDay).getFullYear()}</span>
                <span>•</span>
                <span>{album.Song?.length || 0} bài hát</span>
              </div>
              <p className="text-gray-400 max-w-2xl leading-relaxed">
                {album.Description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contributing Artists */}
          {album.Artist && album.Artist.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Nghệ sĩ tham gia
              </h2>
              <div className="flex flex-wrap gap-4">
                {album.Artist.map((artist) => (
                  <div
                    key={artist.ID}
                    className="group bg-zinc-800/50 hover:bg-zinc-700/50 px-6 py-3 rounded-full transition-all cursor-pointer border border-zinc-700/50 hover:border-zinc-600"
                  >
                    <span className="text-gray-300 group-hover:text-white font-medium">
                      {artist.Name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Song List */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Danh sách bài hát
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePlaySongList(album.Song)}
                  className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                >
                  <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                    <Play size={18} fill="currentColor" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide">
                    NGHE TẤT CẢ
                  </span>
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-zinc-700/50 mb-2">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-7">TÊN BÀI HÁT</div>
              <div className="col-span-2 text-center">ĐIỂM</div>
              <div className="col-span-2 text-center">
                <Clock size={16} className="mx-auto" />
              </div>
            </div>

            {/* Song List */}
            <div className="space-y-1">
              {album.Song?.map((song, index) => (
                <div
                  key={song.ID}
                  onMouseEnter={() => setHoveredSong(song.ID)}
                  onMouseLeave={() => setHoveredSong(null)}
                  className="group grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer"
                >
                  {/* Track Number / Play Button */}
                  <div className="col-span-1 flex items-center justify-center">
                    {hoveredSong === song.ID ? (
                      <button
                        onClick={() => handlePlay(song)}
                        className="w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-all"
                      >
                        <Play size={14} className="text-black ml-0.5" />
                      </button>
                    ) : (
                      <span className="text-gray-400 font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="col-span-7 flex items-center min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-medium text-white group-hover:text-green-400 transition-colors truncate">
                        {song.NameSong}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {album.ArtistOwner}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300 text-sm">
                        {song.Point}
                      </span>
                    </div>
                  </div>

                  {/* Duration / Actions */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <button className="opacity-0 group-hover:opacity-100 w-6 h-6 text-gray-400 hover:text-white transition-all">
                        <Heart size={16} />
                      </button>
                      <span className="text-gray-400 text-sm">3:24</span>
                      <button className="opacity-0 group-hover:opacity-100 w-6 h-6 text-gray-400 hover:text-white transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default AlbumDetailPage;
