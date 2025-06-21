"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Music,
  Heart,
  Clock,
  Calendar,
  Users,
  Headphones,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Volume2,
} from "lucide-react";
import { useAudioPlayer } from "@/component/music/AudioPlayerContext";

type Artist = {
  ID: number;
  Name: string;
  BirthDay: string;
  Description: string;
  Country: string;
};

type SongType = {
  Id: number;
  Type: string;
};

type Song = {
  ID: number;
  NameSong: string;
  Description: string;
  ReleaseDay: string;
  CreateDay: string;
  UpdateDay: string;
  Point: number;
  LikeAmount: number;
  Status: string;
  CountryId: number;
  ListenAmout: number;
  AlbumId: number | null;
  SongResource: string;
  Artist: Artist[];
  SongType: SongType[];
};

export default function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [recommendations, setRecommendations] = useState<any>([]);
  const [isLiked, setIsLiked] = useState(false);
  const { playSong, setListToPlay } = useAudioPlayer();

  const handlePlaySongList = (Song: any[]) => {
    let songList = [];
    for (let index = 0; index < Song.length; index++) {
      console.log(Song[index]);

      songList.push({
        Id: Song[index].ID,
        name: Song[index].NameSong,
        artist: "",
        url: Song[index].SongResource,
      });
    }
    setListToPlay(songList);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/getsong/${id}`)
      .then((res) => res.json())
      .then((data) => setSong(data));

    fetch(`http://localhost:8080/api/getrecommed/song?songid=${id}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data));
  }, [id]);

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative px-6 pt-20 pb-8">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-end gap-8">
            {/* Album Cover */}
            <div className="relative group">
              <div className="w-64 h-64 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                <Music className="w-24 h-24 text-white/80" />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full h-16 w-16 p-0"
                  onClick={() =>
                    playSong({
                      Id: song.ID,
                      name: song.NameSong,
                      artist: "",
                      url: song.SongResource,
                    })
                  }
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </Button>
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 space-y-4">
              <div className="text-sm font-medium text-white/70 uppercase tracking-wide">
                {song.SongType.map((t) => t.Type).join(" • ")}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {song.NameSong}
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {song.Artist.map((a) => a.Name).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(song.ReleaseDay).getFullYear()}
                </div>
                <div className="flex items-center gap-1">
                  <Headphones className="w-4 h-4" />
                  {formatNumber(song.ListenAmout)} lượt nghe
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  3:45
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-6 py-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full h-14 px-8"
              onClick={() =>
                playSong({
                  Id: song.ID,
                  name: song.NameSong,
                  artist: "",
                  url: song.SongResource,
                })
              }
            >
              <Play className="h-5 w-5 mr-2" fill="currentColor" />
              Phát nhạc
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className={`rounded-full h-14 w-14 p-0 ${
                isLiked ? "text-red-500" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="rounded-full h-14 w-14 p-0 text-white/60 hover:text-white"
            >
              <MoreHorizontal className="h-6 w-6" />
            </Button>

            <div className="ml-auto flex items-center gap-4 text-white/60">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatNumber(song.LikeAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Gợi ý cho bạn</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Phát ngẫu nhiên
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => handlePlaySongList(recommendations)}
              >
                <Play className="mr-2 h-4 w-4" />
                Phát tất cả
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {recommendations.map((recSong: any, index: number) => (
              <div
                key={recSong.ID}
                className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-8 text-center text-white/40 group-hover:hidden">
                  {index + 1}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hidden group-hover:flex text-white hover:text-green-400 hover:bg-transparent"
                  onClick={() =>
                    playSong({
                      Id: recSong.ID,
                      name: recSong.NameSong,
                      artist: "",
                      url: recSong.SongResource,
                    })
                  }
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                </Button>

                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-white/80" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate group-hover:text-green-400 transition-colors">
                    {recSong.NameSong}
                  </div>
                  <div className="text-sm text-white/60 truncate">
                    {recSong.Artist?.map((a: any) => a.Name).join(", ")}
                  </div>
                </div>

                <div className="hidden md:block text-sm text-white/40">
                  {formatNumber(recSong.ListenAmout || 0)} lượt nghe
                </div>

                <div className="text-sm text-white/40">3:22</div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-white/60 hover:text-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-white/60 hover:text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
