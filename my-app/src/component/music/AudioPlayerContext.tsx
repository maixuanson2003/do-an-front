"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { SaveListen } from "@/api/ApiSong";
import { useAuthStore } from "@/store/useAuthStore";

type Song = {
  Id: any;
  name: string;
  artist: string;
  url: string;
};

type AudioPlayerContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setListToPlay: (songs: Song[]) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  setVolume: (value: number) => void;
  nextSong: () => void;
  prevSong: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listSongToPlay, setListSongToPlay] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isLogin = useAuthStore((state) => state.isLogin);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback error:", err);
        });
    }
  };

  const playSong = async (song: Song) => {
    const userid = localStorage.getItem("userid");

    if (userid && isLogin) {
      await SaveListen(userid, song.Id);
    } else {
      await SaveListen("", song.Id);
    }

    setCurrentSong(song);
    setIsPlaying(true);

    const index = listSongToPlay.findIndex((s) => s.url === song.url);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const setListToPlay = (songs: Song[]) => {
    setListSongToPlay(songs);

    if (songs.length > 0) {
      setCurrentIndex(0);
      setCurrentSong(songs[0]);
      setIsPlaying(true); // Auto play bài đầu tiên
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const nextSong = async () => {
    if (currentIndex < listSongToPlay.length - 1) {
      const userid = localStorage.getItem("userid");

      const next = currentIndex + 1;
      setCurrentIndex(next);
      setCurrentSong(listSongToPlay[next]);
      if (userid) {
        await SaveListen(userid, listSongToPlay[next].Id);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const prevSong = async () => {
    if (currentIndex > 0) {
      const userid = localStorage.getItem("userid");
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setCurrentSong(listSongToPlay[prev]);
      if (userid) {
        await SaveListen(userid, listSongToPlay[prev].Id);
      }
      setIsPlaying(true);
    }
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  useEffect(() => {
    if (currentSong && isPlaying) {
      playAudio();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      nextSong();
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentIndex, listSongToPlay]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        setListToPlay,
        audioRef,
        nextSong,
        prevSong,
        setVolume,
      }}
    >
      {children}
      <audio
        controls
        autoPlay
        ref={audioRef}
        onEnded={nextSong}
        src={currentSong?.url}
        onCanPlayThrough={() => {
          if (isPlaying) {
            playAudio();
          }
        }}
        hidden
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
