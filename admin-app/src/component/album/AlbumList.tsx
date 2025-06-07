"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getListAlbum, DeleteAlbumById } from "@/api/ApiAlbum";

interface Album {
  ID: number;
  NameAlbum: string;
  Description: string;
  ReleaseDay: string;
  ArtistOwner: string;
}

const AlbumList = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 5;

  const route = useRouter();

  const fetchAlbums = async () => {
    const res = await getListAlbum();
    setAlbums(res);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xoá album này không?")) {
      await DeleteAlbumById(id);
      fetchAlbums();
    }
  };

  const filteredAlbums = albums.filter((album) =>
    album?.NameAlbum?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = filteredAlbums.slice(
    indexOfFirstAlbum,
    indexOfLastAlbum
  );
  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📀 Danh sách Album</h2>
        <Button onClick={() => route.push("/album/formcreate")}>
          <Plus size={16} className="mr-2" /> Thêm Album
        </Button>
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm album..."
        className="border px-3 py-1 rounded mb-4 w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Tên Album</th>
            <th className="border px-3 py-2">Mô tả</th>
            <th className="border px-3 py-2">Ngày phát hành</th>
            <th className="border px-3 py-2">Chủ nghệ sĩ</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentAlbums.map((album) => (
            <tr key={album.ID} className="text-center">
              <td className="border px-2 py-1">{album.ID}</td>
              <td className="border px-2 py-1">{album.NameAlbum}</td>
              <td className="border px-2 py-1">{album.Description}</td>
              <td className="border px-2 py-1">
                {new Date(album.ReleaseDay).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1">{album.ArtistOwner}</td>
              <td className="border px-2 py-1 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => route.push(`/album/formupdate?id=${album.ID}`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(album.ID)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Trước
        </Button>
        <span>
          Trang {currentPage} / {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Sau →
        </Button>
      </div>
    </div>
  );
};

export default AlbumList;
