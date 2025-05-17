"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addSongToPlayList, getSongByPlayList } from "@/api/ApiPlaylist";
import { useSearchParams } from "next/navigation";
import { SearchSong } from "@/api/ApiSong";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useAudioPlayer } from "../music/AudioPlayerContext";
import { Play } from "lucide-react";
const mockSongs = [
  { id: 1, name: "Đừng Hỏi Em", artist: "Mỹ Tâm" },
  { id: 2, name: "Bông Hoa Đẹp Nhất", artist: "Quân A.P" },
  { id: 3, name: "Waiting For You", artist: "Mono" },
  { id: 4, name: "Lạc Trôi", artist: "Sơn Tùng M-TP" },
  { id: 5, name: "Em Của Ngày Hôm Qua", artist: "Sơn Tùng M-TP" },
];

export default function PlaylistPage() {
  const param = useSearchParams();
  const { playSong, setListToPlay } = useAudioPlayer();
  const playListId = param.get("playlistid");
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<any>([]);
  const [playlistSongs, setPlaylistSongs] = useState<any>([]);

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

  const handleAddSong = async (songId: any) => {
    const data = await addSongToPlayList(songId, playListId);
    const datas = await getSongByPlayList(playListId);
    setPlaylistSongs(datas);
  };

  return (
    <div className="grid grid-cols-4 h-screen bg-[#121212] text-white">
      {/* Sidebar Playlist */}
      <div className="col-span-1 p-6 border-r border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Nhạc Chill</h2>

        <Input
          placeholder="Tìm kiếm bài hát..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchSongs(e.target.value);
          }}
          className="bg-[#2a2a2a] text-white placeholder:text-gray-400 mb-4"
        />

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {songs.map((song: any) => (
            <div
              key={song.SongData.ID}
              className="flex justify-between items-center bg-[#1e1e1e] p-3 rounded-md hover:bg-[#2a2a2a] transition"
            >
              <div>
                <p className="text-sm font-medium">{song.SongData.NameSong}</p>
                {/* <p className="text-xs text-gray-400">{song.artist}</p> */}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:text-green-400"
                onClick={() => handleAddSong(song.SongData.ID)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Playlist Songs */}
      <div className="col-span-3 p-6">
        <Button
          className="bg-green-500 text-white hover:bg-green-600 transition-colors px-6 py-2 rounded-full flex items-center gap-2"
          onClick={() => {
            handlePlaySongList(playlistSongs);
          }}
        >
          <Play className="w-5 h-5" />
          Nghe tất cả
        </Button>

        <div className="space-y-3">
          {playlistSongs.length === 0 && (
            <p className="text-gray-400">Playlist chưa có bài hát nào.</p>
          )}
          {playlistSongs.map((song: any) => (
            <div
              key={song.ID}
              className="flex items-center gap-4 bg-[#1e1e1e] p-4 rounded-lg hover:bg-[#2a2a2a] transition"
            >
              <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-white text-xl">
                🎵
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{song.NameSong}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  playSong({
                    Id: song.ID,
                    name: song.NameSong,
                    artist: "",
                    url: song.SongResource,
                  })
                }
                className="text-green-400 hover:text-green-600"
              >
                <PlayCircle className="w-32 h-32" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
