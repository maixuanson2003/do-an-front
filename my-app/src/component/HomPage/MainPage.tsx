import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, HeartIcon } from "lucide-react";

const playlists = [
  {
    title: "Morning Chill",
    description: "15 bài hát • 52 phút",
    image: "/images/playlist1.jpg",
    color: "from-pink-500 to-yellow-400",
  },
  {
    title: "Top Trending",
    description: "10 bài hot nhất tuần",
    image: "/images/playlist2.jpg",
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Lo-fi Buổi Tối",
    description: "18 bài hát • 60 phút",
    image: "/images/playlist3.jpg",
    color: "from-blue-400 to-cyan-500",
  },
  {
    title: "Ballad Việt",
    description: "20 bài hát • 75 phút",
    image: "/images/playlist4.jpg",
    color: "from-rose-400 to-red-500",
  },
];

export default function MainPage() {
  return (
    <div className="p-6 w-full space-y-8   text-white">
      <div>
        <h1 className="text-3xl font-bold">🎵 Chào mừng, Maixuanson!</h1>
        <p className="text-muted-foreground text-zinc-300">
          Hôm nay bạn muốn nghe gì?
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">🎧 Playlist đề xuất</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl transition-all bg-gradient-to-br ${playlist.color} text-white`}
            >
              <img
                src={playlist.image}
                alt={playlist.title}
                className="rounded-t-xl w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg drop-shadow-sm">
                  {playlist.title}
                </h3>
                <p className="text-sm text-zinc-200 mb-2">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-zinc-200"
                  >
                    <PlayIcon className="w-4 h-4 mr-1" /> Phát
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-pink-300"
                  >
                    <HeartIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
