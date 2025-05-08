"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

const mockSongs: Song[] = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    url: "/songs/blinding-lights.mp3",
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    url: "/songs/shape-of-you.mp3",
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    url: "/songs/levitating.mp3",
  },
];

export default function SongRecommend() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      setCurrentSong(song);
      audioRef.current.src = song.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="pb-24">
      {" "}
      {/* dành chỗ cho player ở dưới */}
      <div className="p-4 bg-gray-900 rounded-lg shadow-md mx-auto mt-6 w-full ">
        <h2 className="text-xl text-white font-bold mb-4">🎧 Gợi ý bài hát</h2>
        <ul className="space-y-3">
          {mockSongs.map((song) => (
            <li
              key={song.id}
              className="p-3 bg-gray-800 rounded-lg flex justify-between items-center hover:bg-gray-700 transition"
            >
              <div>
                <p className="font-semibold text-white">{song.title}</p>
                <p className="text-sm text-gray-400">by {song.artist}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-white group-hover:text-green-400"
              >
                <PlayIcon className="w-5 h-5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* Spotify-like bottom player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-base font-semibold">{currentSong.title}</p>
            <p className="text-sm text-gray-400">{currentSong.artist}</p>
          </div>
          <button
            onClick={togglePlayPause}
            className="text-white text-lg px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>
        </div>
      )}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
