"use client";

import { useState } from "react";
import {
  Play,
  Heart,
  Download,
  CheckCircle,
  MessageCircle,
  Music,
  Pause,
  User,
  Clock,
  Headphones,
} from "lucide-react";
import { useAudioPlayer } from "../music/AudioPlayerContext";
import { LikeSong } from "@/api/ApiSong";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import LoginRequiredDialog from "../toast/LoginToast"; // ✅ Thêm

const SongCard = ({ song, onCommentClick, index }: any) => {
  const { playSong, currentSong, isPlaying } = useAudioPlayer();
  const artistNames = song.artist.map((a: any) => a.name).join(", ");
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // ✅ Thêm
  const route = useRouter();

  const isCurrentSong = currentSong?.Id === song.SongData.ID;

  const handleLikeSong = async (songid: any) => {
    if (!isLogin) {
      setLoginDialogOpen(true); // ✅ Thay alert
      return;
    }

    const userid = localStorage.getItem("userid");
    const data = await LikeSong(songid, userid);
    setLiked(true);
    setTimeout(() => setLiked(false), 3000);
  };

  const handleDownload = async (url: string, filename: string) => {
    if (!isLogin) {
      setLoginDialogOpen(true); // ✅ Thay alert
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || `${song.SongData.NameSong}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi khi tải xuống bài hát:", error);
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
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 ${
        isCurrentSong
          ? "ring-2 ring-purple-500 ring-opacity-50 bg-gradient-to-r from-purple-50 to-indigo-50"
          : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-2 left-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl"></div>
      </div>

      {isCurrentSong && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500">
          <div
            className={`h-full bg-gradient-to-r from-purple-600 to-indigo-600 ${
              isPlaying ? "animate-pulse" : ""
            }`}
          ></div>
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div
            className="flex-1 cursor-pointer group/info"
            onClick={() => route.push(`/song/${song.SongData.ID}`)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isCurrentSong
                    ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-purple-100 group-hover:to-indigo-100 group-hover:text-purple-600"
                }`}
              >
                {isCurrentSong && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-white rounded-full animate-pulse delay-100"></div>
                    <div className="w-1 h-5 bg-white rounded-full animate-pulse delay-200"></div>
                  </div>
                ) : (
                  <Music className="w-5 h-5" />
                )}

                {isHovered && !isCurrentSong && (
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-lg mb-1 truncate transition-colors duration-200 group-hover/info:text-purple-600 ${
                    isCurrentSong ? "text-purple-700" : "text-gray-800"
                  }`}
                >
                  {song.SongData.NameSong}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-3 h-3" />
                  <span className="truncate">{artistNames}</span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
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

          <div className="flex items-center gap-1">
            <button
              onClick={() => onCommentClick(song)}
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group/btn"
              title="Bình luận"
            >
              <MessageCircle className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={() => handleLikeSong(song.SongData.ID)}
              className={`relative p-3 rounded-xl transition-all duration-300 group/btn ${
                liked ? "bg-red-50" : "hover:bg-gray-100"
              }`}
              title="Yêu thích"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  liked
                    ? "text-red-500 fill-red-500 scale-110"
                    : "text-gray-500 group-hover/btn:text-red-500 group-hover/btn:scale-110"
                }`}
              />
            </button>

            <button
              onClick={() =>
                handleDownload(
                  song.SongData.SongResource,
                  `${song.SongData.NameSong}.mp3`
                )
              }
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group/btn"
              disabled={downloading}
              title="Tải xuống"
            >
              <Download
                className={`w-5 h-5 transition-all duration-300 ${
                  downloading
                    ? "text-gray-400 animate-bounce"
                    : "text-gray-500 group-hover/btn:text-green-500 group-hover/btn:scale-110"
                }`}
              />
              {downloading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>

            <button
              onClick={handlePlaySong}
              className={`ml-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isCurrentSong && isPlaying
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
              }`}
            >
              {isCurrentSong && isPlaying ? (
                <>
                  <Play className="w-4 h-4 ml-0.5" />
                  <span className="hidden sm:inline">Phát nhạc</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 ml-0.5" />
                  <span className="hidden sm:inline">Phát nhạc</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {liked && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Đã thêm vào yêu thích!</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Tải xuống thành công!</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* ✅ Login Dialog */}
      <LoginRequiredDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </div>
  );
};

export default SongCard;
