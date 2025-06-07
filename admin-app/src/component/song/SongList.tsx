"use client";

import { useEffect, useState } from "react";
import SongCard from "./SongCard"; // Component hiển thị 1 bài hát
import { GetAllSong } from "@/api/ApiSong";
import { Button } from "@/components/ui/button"; // ShadCN UI button
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const SongList = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true); // kiểm soát nút "Trang sau"
  const route = useRouter();

  useEffect(() => {
    const fetchSongs = async (page: number) => {
      try {
        setLoading(true);
        const data = await GetAllSong(page);
        setSongs(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Lỗi khi lấy bài hát:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs(page);
  }, [page]);

  // Cuộn lên đầu khi đổi trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleEdit = (song: any) => {
    route.push(`/song/formupdate?id=${song.SongData.ID}`);
  };

  const handleDelete = async (song: any) => {
    console.log("Delete:", song);
    // Gọi API xoá nếu cần
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý bài hát</h2>
        <Button onClick={() => route.push("/song/formadd")}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Danh sách bài hát */}
      {loading ? (
        <p className="text-gray-500">Đang tải danh sách bài hát...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-500">Không có bài hát nào.</p>
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

      {/* Phân trang */}
      <div className="flex items-center justify-end space-x-4 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Trang trước
        </Button>

        <span className="text-sm font-medium">Trang {page}</span>

        <Button
          variant="outline"
          disabled={!hasMore}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default SongList;
