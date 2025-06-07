"use client";

import { useEffect, useState } from "react";
import ArtistCard from "./ArtistCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { getListArtist, DeleteAritst } from "@/api/ApiArtist";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 5;

const ArtistList = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getListArtist();
        setArtists(data);
        setFilteredArtists(data); // Khởi tạo filter ban đầu
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nghệ sĩ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const filtered = artists.filter((artist) =>
      artist.Name?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredArtists(filtered);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [searchKeyword, artists]);

  const handleDelete = async (artist: any) => {
    try {
      await DeleteAritst(artist.ID);
      setArtists((prev) => prev.filter((a) => a.ID !== artist.ID));
    } catch (err) {
      console.log("Lỗi xoá nghệ sĩ:", err);
    }
  };

  const totalPages = Math.ceil(filteredArtists.length / PAGE_SIZE);
  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý nghệ sĩ</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Tìm theo tên nghệ sĩ"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => router.push("/artist/FormAdd")}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nghệ sĩ
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Đang tải danh sách nghệ sĩ...</p>
      ) : filteredArtists.length === 0 ? (
        <p>Không có nghệ sĩ nào.</p>
      ) : (
        <>
          <div className="flex flex-col flex-wrap gap-4">
            {paginatedArtists.map((artist) => (
              <ArtistCard
                key={artist.ID}
                artist={artist}
                onEdit={() =>
                  router.push(`/artist/FormEdit?artistid=${artist.ID}`)
                }
                onDelete={() => handleDelete(artist)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trang trước
            </Button>
            <span className="px-2 py-1 border rounded">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ArtistList;
