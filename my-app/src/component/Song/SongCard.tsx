"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Heart,
  Download,
  CheckCircle,
  MessageCircle,
  Music,
  User,
  Clock,
  Headphones,
} from "lucide-react";
import { useAudioPlayer } from "../music/AudioPlayerContext";
import { LikeSong, GetSongLike, DownLoad, dishLikeSong } from "@/api/ApiSong";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import LoginRequiredDialog from "../toast/LoginToast";

const SongCard = ({ song, onCommentClick, index, onLikeClick }: any) => {
  const { playSong, currentSong, isPlaying } = useAudioPlayer();
  const artistNames = song.artist.map((a: any) => a.name).join(", ");
  const isLogin = useAuthStore((state) => state.isLogin);
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [userLikedSongs, setUserLikedSongs] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentSong = currentSong?.Id === song.SongData.ID;

  const isSongLiked = userLikedSongs.some(
    (s: any) => s.ID === song.SongData.ID
  );

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const userId = localStorage.getItem("userid");
      if (userId) {
        const likedData = await GetSongLike(userId);
        setUserLikedSongs(likedData);
      }
    };

    fetchLikedSongs();
  }, []);
  useEffect(() => {
    if (downloadSuccess) {
      const timer = setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000); // 3 giây

      return () => clearTimeout(timer);
    }
  }, [downloadSuccess]);

  const handleLikeToggle = async () => {
    if (!isLogin) return setLoginDialogOpen(true);
    const userId = localStorage.getItem("userid");
    if (!userId) return;

    if (isSongLiked) {
      await dishLikeSong(song.SongData.ID, userId);
      setUserLikedSongs((prev) =>
        prev.filter((s: any) => s.ID !== song.SongData.ID)
      );
    } else {
      await LikeSong(song.SongData.ID, userId);
      setUserLikedSongs((prev) => [...prev, song.SongData]);
      setLiked(true);
    }

    onLikeClick(song);
  };

  const handleDownload = async () => {
    if (!isLogin) return setLoginDialogOpen(true);

    try {
      setDownloading(true);
      const blob = await DownLoad(song.SongData.SongResource);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${song.SongData.NameSong}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setDownloadSuccess(true);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePlaySong = () => {
    playSong({
      Id: song.SongData.ID,
      name: song.SongData.NameSong,
      artist: artistNames,
      url: song.SongData.SongResource,
    });
  };

  return (
    <div
      className={`group relative rounded-2xl shadow-sm transition-all duration-500 overflow-hidden border hover:border-purple-200 ${
        isCurrentSong
          ? "ring-2 ring-purple-500 ring-opacity-50 bg-gradient-to-r from-purple-50 to-indigo-50"
          : "bg-white border-gray-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-2 left-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl"></div>
      </div>

      {/* Top Indicator Bar */}
      {isCurrentSong && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse" />
      )}

      {/* Song Info Section */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div
            className="flex-1 cursor-pointer group/info"
            onClick={() => router.push(`/song/${song.SongData.ID}`)}
          >
            <div className="flex items-center gap-4">
              {/* Music Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isCurrentSong
                    ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-purple-100 group-hover:to-indigo-100 group-hover:text-purple-600"
                }`}
              >
                <Music className="w-5 h-5" />
                {isHovered && !isCurrentSong && (
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Song Details */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-lg truncate mb-1 ${
                    isCurrentSong ? "text-purple-700" : "text-gray-800"
                  } group-hover/info:text-purple-600`}
                >
                  {song.SongData.NameSong}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-3 h-3" />
                  <span className="truncate">{artistNames}</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>3:42</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    <span>1.2K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCommentClick(song)}
              className="p-3 rounded-xl hover:bg-gray-100 transition group/btn"
              title="Bình luận"
            >
              <MessageCircle className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-500" />
            </button>

            <button
              onClick={handleLikeToggle}
              className={`p-3 rounded-xl transition group/btn ${
                liked ? "bg-red-50" : "hover:bg-gray-100"
              }`}
              title="Yêu thích"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  isSongLiked
                    ? "text-red-500 fill-red-500 scale-110"
                    : "text-gray-500 group-hover:scale-110 group-hover:text-red-500"
                }`}
              />
            </button>

            <button
              onClick={handleDownload}
              className="p-3 rounded-xl hover:bg-gray-100 transition group/btn relative"
              disabled={downloading}
              title="Tải xuống"
            >
              <Download
                className={`w-5 h-5 ${
                  downloading
                    ? "text-gray-400 animate-bounce"
                    : "text-gray-500 group-hover/btn:text-green-500"
                }`}
              />
            </button>

            <button
              onClick={handlePlaySong}
              className={`ml-2 px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition ${
                isCurrentSong && isPlaying
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              }`}
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Phát nhạc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toasts */}

      {downloadSuccess && (
        <Toast
          message="Tải xuống thành công!"
          icon={<CheckCircle />}
          color="blue"
        />
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* Login Dialog */}
      <LoginRequiredDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </div>
  );
};

// Toast component (reusable)
const Toast = ({ message, icon, color }: any) => (
  <div
    className={`absolute top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300`}
  >
    {icon}
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export default SongCard;
