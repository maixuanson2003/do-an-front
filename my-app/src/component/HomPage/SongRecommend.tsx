"use client";

import React, { useEffect, useState } from "react";
import { RecommendSong } from "@/api/ApiSong";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Play,
  Music2,
  Headphones,
  ListMusic,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAudioPlayer } from "../music/AudioPlayerContext";
// UI Components
import { Button } from "@/components/ui/button";

export default function SongRecommend() {
  const [songs, setSongs] = useState<any>([]);
  const { playSong } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const isLogin = useAuthStore((state) => state.isLogin);
  // Fetch recommended songs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let id = localStorage.getItem("userid");
        const data = await RecommendSong(id);
        setSongs(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isLogin) {
      fetchData();
    }
  }, []);

  // Generate a vibrant gradient based on song index
  const getGradient = (index: number) => {
    const gradients = [
      "from-purple-600 to-blue-500",
      "from-pink-500 to-orange-400",
      "from-green-500 to-teal-400",
      "from-blue-500 to-indigo-600",
      "from-red-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="pb-24">
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl mx-auto mt-6 w-full border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-white font-bold">Gợi ý bài hát</h2>
            <p className="text-sm text-gray-400">Dựa trên sở thích của bạn</p>
          </div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white flex items-center"
            >
              <ListMusic className="h-4 w-4 mr-1" />
              <span>{songs.length || 0}</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-300">Đang tải gợi ý...</p>
          </div>
        ) : songs.length === 0 || !isLogin ? (
          <div className="text-center p-8">
            <Music2 className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {!isLogin ? "dang nhap de thay goi y" : "chua co goi y nao"}
            </h3>
            <p className="text-gray-400 mb-4">
              Hãy khám phá và nghe nhạc nhiều hơn
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
              <p className="text-sm font-medium text-gray-300">
                Những bài hát bạn có thể thích
              </p>
            </div>

            <ul className="space-y-3">
              {songs.map((song: any, index: number) => (
                <li
                  key={song.ID}
                  className="relative overflow-hidden rounded-lg transition-all duration-300 group"
                  onMouseEnter={() => setHoveredSong(index)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${getGradient(
                      index
                    )} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between group-hover:bg-gray-750 transition-colors duration-300 border border-transparent group-hover:border-gray-700">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 flex-shrink-0 rounded-md bg-gradient-to-br ${getGradient(
                          index
                        )} flex items-center justify-center mr-4 group-hover:shadow-lg shadow-md`}
                      >
                        <Music2 className="h-5 w-5 text-white" />
                      </div>

                      <div>
                        <p className="font-semibold text-white group-hover:text-white transition-colors">
                          {song.NameSong}
                        </p>
                        <p className="text-sm text-gray-400">
                          {song.Description}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        playSong({
                          Id: song.ID,
                          name: song.NameSong,
                          artist: "",
                          url: song.SongResource,
                        })
                      }
                      size="icon"
                      variant={hoveredSong === index ? "default" : "ghost"}
                      className={`z-10
                        transition-all duration-300
                        ${
                          hoveredSong === index
                            ? `bg-gradient-to-r ${getGradient(
                                index
                              )} text-white hover:opacity-90`
                            : "text-white hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      <Play
                        className={`w-5 h-5 ${
                          hoveredSong === index
                            ? ""
                            : "opacity-70 group-hover:opacity-100"
                        }`}
                      />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {songs.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Xem thêm gợi ý
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
