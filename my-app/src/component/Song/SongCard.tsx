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

const SongCard = ({ song, onCommentClick }: any) => {
  const { playSong } = useAudioPlayer();
  const artistNames = song.artist.map((a: any) => a.name).join(", ");
  const [liked, setLiked] = useState(false);

  const handleLikeSong = async (songid: any) => {
    const userid = localStorage.getItem("userid");
    const data = await LikeSong(songid, userid);
    setLiked(true);
    setTimeout(() => setLiked(false), 3000);
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
          <Heart size={18} className="text-gray-600 hover:text-red-500" />
        </button>

        {/* Download icon */}
        <a
          href={song.SongData.SongResource}
          download
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Download size={18} className="text-gray-600 hover:text-blue-500" />
        </a>

        {/* Play button */}
        <button
          onClick={() =>
            playSong({
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
    </div>
  );
};

export default SongCard;
