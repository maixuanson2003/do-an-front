"use client";

import { useState } from "react";
import {
  Play,
  Heart,
  Download,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useAudioPlayer } from "../music/AudioPlayerContext";
import { LikeSong } from "@/api/ApiSong";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const SongCard = ({ song, onCommentClick }: any) => {
  const { playSong } = useAudioPlayer();
  const artistNames = song.artist.map((a: any) => a.name).join(", ");
  const [liked, setLiked] = useState(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const [downloading, setDownloading] = useState(false);
  const route = useRouter();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleLikeSong = async (songid: any) => {
    if (isLogin) {
      const userid = localStorage.getItem("userid");
      const data = await LikeSong(songid, userid);
      setLiked(true);
      setTimeout(() => setLiked(false), 3000);
    } else {
      alert("hay dang nhap vao he thong");
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    if (isLogin) {
      try {
        setDownloading(true);

        // Tạo request để tải file từ server
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Chuyển response thành blob
        const blob = await response.blob();

        // Tạo URL tạm thời cho blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Tạo thẻ a ẩn để kích hoạt tải xuống
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename || `${song.SongData.NameSong}.mp3`;
        document.body.appendChild(link);

        // Kích hoạt sự kiện click để tải xuống
        link.click();

        // Xóa thẻ a sau khi tải xuống
        document.body.removeChild(link);

        // Giải phóng URL tạm thời
        window.URL.revokeObjectURL(downloadUrl);

        // Hiển thị thông báo tải xuống thành công
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (error) {
        console.error("Lỗi khi tải xuống bài hát:", error);
      } finally {
        setDownloading(false);
      }
    } else {
      alert("hay dang nhap vao he thong ");
    }
  };

  return (
    <div className="relative flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow hover:shadow-md transition">
      <div>
        <h3 className="text-base font-semibold">{song.SongData.NameSong}</h3>
        <p className="text-sm text-gray-600">Tác giả: {artistNames}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Bình luận icon */}
        <button
          onClick={() => onCommentClick(song)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MessageCircle
            size={18}
            className="text-gray-600 hover:text-blue-500"
          />
        </button>

        {/* Like icon */}
        <button
          onClick={() => handleLikeSong(song.SongData.ID)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Heart
            size={18}
            className={`${
              liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Download icon */}
        <button
          onClick={() =>
            handleDownload(
              song.SongData.SongResource,
              `${song.SongData.NameSong}.mp3`
            )
          }
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={downloading}
        >
          <Download
            size={18}
            className={`${
              downloading
                ? "text-gray-400"
                : "text-gray-600 hover:text-blue-500"
            }`}
          />
        </button>

        {/* Play button */}
        <button
          onClick={() =>
            playSong({
              Id: song.SongData.ID,
              name: song.SongData.NameSong,
              artist: artistNames,
              url: song.SongData.SongResource,
            })
          }
          className="ml-2 bg-green-500 text-white px-3 py-2 rounded-full text-sm flex items-center"
        >
          <Play size={16} className="mr-1" /> Phát
        </button>
      </div>

      {liked && (
        <div className="absolute top-0 right-0 mt-[-10px] mr-[-10px] bg-green-100 text-green-700 px-3 py-1 text-sm rounded shadow flex items-center gap-1">
          <CheckCircle size={16} /> Đã thêm vào yêu thích!
        </div>
      )}

      {downloadSuccess && (
        <div className="absolute top-0 right-0 mt-[-10px] mr-[-10px] bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded shadow flex items-center gap-1">
          <CheckCircle size={16} /> Tải xuống thành công!
        </div>
      )}
    </div>
  );
};

export default SongCard;
