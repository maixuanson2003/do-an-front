"use client";

import { useEffect, useState } from "react";
import SongCard from "./SongCard"; // Đường dẫn đúng đến component của bạn
import { GetAllSong } from "@/api/ApiSong";
import { Button } from "@/components/ui/button"; // dùng ShadCN nếu bạn đã cài
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteCollection } from "@/api/ApiCollection";

const SongList = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const route = useRouter();

  useEffect(() => {
    const fetchSongs = async (page: number) => {
      try {
        const data = await GetAllSong(page);
        setSongs(data);
      } catch (error) {
        console.error("Lỗi khi lấy bài hát:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs(page);
  }, [page]);

  const handleEdit = (song: any) => {
    route.push(`/song/formupdate?`);
    // mở form sửa bài
  };

  const handleDelete = async (song: any) => {
    console.log("Delete:", song);
    // mở confirm xoá
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề + nút thêm mới */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý bài hát</h2>
        <Button
          onClick={() => {
            route.push("/song/formadd");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Danh sách bài hát */}
      {loading ? (
        <p>Đang tải danh sách bài hát...</p>
      ) : songs.length === 0 ? (
        <p>Không có bài hát nào.</p>
      ) : (
        songs.map((song) => (
          <SongCard
            key={song.SongData.ID}
            song={song}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default SongList;
