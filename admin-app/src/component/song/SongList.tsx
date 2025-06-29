"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SongCard from "./SongCard";
import { GetListSong } from "@/api/ApiSong";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PAGE_SIZE = 7; // ➟ số bài hát / trang

export default function SongList() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  /* ---------- load danh sách tất cả bài hát ---------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await GetListSong(); // trả mảng đầy đủ
        setSongs(data);
      } catch (err) {
        console.error("Lỗi khi lấy bài hát:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- tính toán trang hiện tại ---------- */
  const maxPage = Math.ceil(songs.length / PAGE_SIZE) || 1;
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentSongs = songs.slice(startIndex, startIndex + PAGE_SIZE);

  /* ---------- handlers ---------- */
  const handleEdit = (song: any) =>
    router.push(`/song/formupdate?id=${song.SongData.ID}`);
  const handleDelete = (song: any) => console.log("Delete:", song);

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Quản lý bài hát</h2>
        <Button onClick={() => router.push("/song/formadd")}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* danh sách */}
      {loading ? (
        <p className="text-gray-500">Đang tải danh sách bài hát...</p>
      ) : currentSongs.length === 0 ? (
        <p className="text-gray-500">Không có bài hát nào.</p>
      ) : (
        currentSongs.map((song) => (
          <SongCard
            key={song.SongData.ID}
            song={song}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      {/* phân trang */}
      <div className="flex items-center justify-end gap-4 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Trang trước
        </Button>

        <span className="text-sm font-medium">
          Trang {page} / {maxPage}
        </span>

        <Button
          variant="outline"
          disabled={page >= maxPage}
          onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
