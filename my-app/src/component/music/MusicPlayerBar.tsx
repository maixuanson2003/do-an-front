"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Heart,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
} from "lucide-react";
import Image from "next/image";

type Props = {
  src: string;
  title: string;
  artist: string;
  thumbnail: string;
};

export default function MusicPlayerBar({
  src,
  title,
  artist,
  thumbnail,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1e1b2e] text-white px-4 py-3 flex items-center justify-between z-50">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Left: Thumbnail + Info */}
      <div className="flex items-center gap-3 w-1/3">
        <Image
          src={thumbnail}
          alt="Thumbnail"
          width={48}
          height={48}
          className="rounded object-cover"
        />
        <div>
          <div className="font-medium text-sm truncate">{title}</div>
          <div className="text-xs text-gray-400 truncate">{artist}</div>
        </div>
        <Heart className="ml-2 cursor-pointer" size={18} />
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-4 mb-1">
          <Shuffle className="w-5 h-5 cursor-pointer text-gray-300" />
          <SkipBack className="w-5 h-5 cursor-pointer" />
          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <SkipForward className="w-5 h-5 cursor-pointer" />
          <Repeat className="w-5 h-5 cursor-pointer text-gray-300" />
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center gap-3 w-1/3 justify-end pr-3">
        <button onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input type="range" min={0} max={1} step={0.01} className="w-24" />
      </div>
    </div>
  );
}
