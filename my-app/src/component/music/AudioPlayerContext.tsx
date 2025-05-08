"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

type Song = {
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

  const playSong = (song: Song) => {
    const index = listSongToPlay.findIndex((s) => s.url === song.url);
    setCurrentIndex(index);
    setCurrentSong(song);
  };

  const setListToPlay = (songs: Song[]) => {
    setListSongToPlay(songs);
    if (songs.length > 0) {
      setCurrentIndex(0);
      setCurrentSong(songs[0]);
      playSong(songs[0]);
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

  const nextSong = () => {
    console.log(currentIndex);

    if (currentIndex < listSongToPlay.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setCurrentSong(listSongToPlay[next]);
    } else {
      setIsPlaying(false);
    }
  };

  const prevSong = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setCurrentSong(listSongToPlay[prev]);
    }
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  useEffect(() => {
    if (currentSong) {
      if (isPlaying) {
        playAudio();
      }
    }
  }, [currentSong, isPlaying]);

  // Lắng nghe sự kiện onEnded để chuyển sang bài tiếp theo
  useEffect(() => {
    const handleEnded = () => {
      console.log("🎵 Bài hát kết thúc");
      nextSong();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }

    // Cleanup sự kiện khi component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
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
