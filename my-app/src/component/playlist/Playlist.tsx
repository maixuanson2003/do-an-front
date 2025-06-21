"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Clock,
  Music,
  Trash,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  addSongToPlayList,
  getSongByPlayList,
  deleteSongFromPlaylist,
} from "@/api/ApiPlaylist";
import { useSearchParams } from "next/navigation";
import { SearchSong } from "@/api/ApiSong";
import { useAudioPlayer } from "../music/AudioPlayerContext";

export default function PlaylistPage() {
  const param = useSearchParams();
  const { playSong, setListToPlay } = useAudioPlayer();
  const playListId = param.get("playlistid");

  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<any>([]);
  const [playlistSongs, setPlaylistSongs] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSearchSidebar, setShowSearchSidebar] = useState(true);

  useEffect(() => {
    if (!playListId) return;
    const fetchData = async () => {
      const data = await getSongByPlayList(playListId);
      setPlaylistSongs(data);
    };
    fetchData();
  }, [playListId]);

  const searchSongs = async (keyword: any) => {
    const data = await SearchSong(keyword);
    setSongs(data);
  };

  const handlePlaySongList = (Song: any[]) => {
    const songList = Song.map((s) => ({
      Id: s.ID,
      name: s.NameSong,
      artist: "",
      url: s.SongResource,
    }));
    setListToPlay(songList);
    setIsPlaying(true);
  };

  const handleDeleteSong = async (songId: number) => {
    try {
      await deleteSongFromPlaylist(songId, Number(playListId));
      const updatedSongs = await getSongByPlayList(playListId);
      setPlaylistSongs(updatedSongs);
    } catch (error) {
      console.error("Lỗi khi xoá bài hát:", error);
    }
  };

  const handleAddSong = async (songId: any) => {
    await addSongToPlayList(songId, playListId);
    const updated = await getSongByPlayList(playListId);
    setPlaylistSongs(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-black to-black text-white relative flex">
      {/* Toggle Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={() => setShowSearchSidebar(!showSearchSidebar)}
          className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-full"
        >
          {showSearchSidebar ? (
            <ChevronLeft className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )}
          {showSearchSidebar ? "Thoát" : "Thêm nhạc"}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          showSearchSidebar ? "w-80" : "w-0"
        } overflow-hidden bg-black/60 backdrop-blur-sm border-r border-white/10 h-screen`}
      >
        {showSearchSidebar && (
          <div className="p-6">
            {/* Search Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 mt-8 text-white/90">
                Tìm kiếm bài hát
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    searchSongs(e.target.value);
                  }}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full focus:bg-white/20 transition-all"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {songs.map((song: any) => (
                <div
                  key={song.SongData.ID}
                  className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {song.SongData.NameSong}
                      </p>
                      <p className="text-xs text-gray-400 truncate">Nghệ sĩ</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-green-400 hover:text-green-300 hover:bg-green-400/20 w-8 h-8 p-0 transition-all"
                    onClick={() => handleAddSong(song.SongData.ID)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/40 to-transparent" />
          <div className="relative p-8 pb-6">
            <div className="flex items-end gap-6">
              <div className="w-60 h-60 bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center">
                <Music className="w-24 h-24 text-white/80" />
              </div>
              <div className="flex-1 pb-6">
                <p className="text-sm font-medium text-white/80 mb-2">
                  PLAYLIST
                </p>
                <h1 className="text-6xl font-black text-white mb-4 leading-none">
                  Khám phá
                </h1>
                <p className="text-white/70 mb-4">
                  Playlist của bạn • {playlistSongs.length} bài hát
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handlePlaySongList(playlistSongs)}
                    className="bg-green-500 hover:bg-green-400 text-black font-semibold h-14 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    disabled={playlistSongs.length === 0}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 mr-2" />
                    ) : (
                      <Play className="w-6 h-6 mr-2" />
                    )}
                    {isPlaying ? "Tạm dừng" : "Phát"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    <Heart className="w-8 h-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    <MoreHorizontal className="w-8 h-8" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Songs Table */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-white/10 mb-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Tiêu đề</div>
            <div className="col-span-3">Mô tả</div>
            <div className="col-span-1 text-center">action</div>
            <div className="col-span-1"></div>
          </div>

          <div
            className="space-y-1 max-h-96 overflow-y-auto pr-2 
                     [&::-webkit-scrollbar]:w-3
                     [&::-webkit-scrollbar-track]:bg-transparent
                     [&::-webkit-scrollbar-thumb]:bg-white/20
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     [&::-webkit-scrollbar-thumb]:border-2
                     [&::-webkit-scrollbar-thumb]:border-transparent
                     [&::-webkit-scrollbar-thumb]:bg-clip-content
                     hover:[&::-webkit-scrollbar-thumb]:bg-white/30
                     [&::-webkit-scrollbar-thumb]:transition-colors
                     [&::-webkit-scrollbar-thumb]:duration-300
                     [&::-webkit-scrollbar-thumb]:ease-in-out
                     [&::-webkit-scrollbar-thumb]:shadow-sm
                     hover:[&::-webkit-scrollbar-thumb]:shadow-md
                     hover:[&::-webkit-scrollbar-thumb]:shadow-white/10
                     active:[&::-webkit-scrollbar-thumb]:bg-white/40
                     scroll-smooth
                     md:[&::-webkit-scrollbar]:w-3
                     max-md:[&::-webkit-scrollbar]:w-0"
          >
            {playlistSongs.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Playlist chưa có bài hát nào
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Tìm kiếm và thêm bài hát từ thanh tìm kiếm bên trái
                </p>
              </div>
            ) : (
              playlistSongs.map((song: any, index: number) => (
                <div
                  key={song.ID}
                  className="group grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="text-gray-400 group-hover:hidden text-sm">
                      {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden group-hover:flex w-8 h-8 p-0 text-white hover:text-green-400"
                      onClick={() =>
                        playSong({
                          Id: song.ID,
                          name: song.NameSong,
                          artist: "",
                          url: song.SongResource,
                        })
                      }
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <Music className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate hover:underline cursor-pointer">
                        {song.NameSong}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <p className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
                      {song.Description}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 p-0 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteSong(song.ID)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
