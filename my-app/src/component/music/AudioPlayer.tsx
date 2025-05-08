"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const AudioPlayer = () => {
  const { currentSong, isPlaying, togglePlay, audioRef, nextSong, prevSong } =
    useAudioPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6); // Mặc định 60%

  useEffect(() => {
    if (audioRef.current && currentSong) {
      const audio = audioRef.current;
      audio.volume = volume;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      const interval = setInterval(() => {
        if (!audio.paused) {
          setCurrentTime(audio.currentTime);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentSong, volume]);

  // useEffect(() => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.play();
  //     } else {
  //       audioRef.current.pause();
  //     }
  //   }
  // }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (!currentSong) return null;

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e1b2e] text-white px-6 py-3 h-[100px] flex items-center justify-between z-50">
      {/* LEFT: Thumbnail & Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <div>
          <p className="text-sm font-semibold truncate max-w-[200px]">
            {currentSong.name}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* CENTER: Controls & Progress */}
      <div className="flex flex-col items-center w-[40%]">
        <div className="flex items-center gap-5 mb-1">
          <SkipBack
            onClick={prevSong}
            className="w-5 h-5 cursor-pointer text-gray-300"
          />
          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <SkipForward
            onClick={nextSong}
            className="w-5 h-5 cursor-pointer text-gray-300"
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          <div className="h-1 w-full bg-gray-600 rounded overflow-hidden">
            <div
              className="h-1 bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-[30%] justify-end">
        <Volume2 size={18} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 appearance-none bg-gray-600 rounded cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
