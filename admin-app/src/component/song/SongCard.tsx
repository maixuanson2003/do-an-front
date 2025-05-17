"use client";

import { useState } from "react";
import {
  Play,
  Heart,
  Download,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteSong } from "@/api/ApiSong";

const SongCard = ({ song, onCommentClick }: any) => {
  const route = useRouter();
  const handleDelete = async (id: any) => {
    if (confirm("Bạn có chắc chắn muốn xoá bài hát này không?")) {
      try {
        await DeleteSong(id);
        window.location.reload();
      } catch (error) {
        console.error("Xoá thất bại:", error);
        alert("Đã xảy ra lỗi khi xoá bài hát.");
      }
    }
  };
  const artistNames = song.artist.map((a: any) => a.name).join(", ");
  return (
    <div className="relative flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow hover:shadow-md transition">
      <div>
        <h3 className="text-base font-semibold">{song.SongData.NameSong}</h3>
        <p className="text-sm text-gray-600">Tác giả: {artistNames}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            route.push(`/song/formupdate?songid=${song.SongData.ID}`)
          }
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          Update
        </button>

        <button
          onClick={() => handleDelete(song.SongData.ID)}
          className="ml-2 bg-green-500 text-white px-3 py-2 rounded-full text-sm flex items-center"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SongCard;
