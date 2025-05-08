"use client";

import { useEffect, useState } from "react";
import ArtistCard from "./ArtistCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getListArtist } from "@/api/ApiArtist";
import { useRouter } from "next/navigation";

const ArtistList = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getListArtist();
        setArtists(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nghệ sĩ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleEdit = (artist: any) => {
    console.log("Sửa:", artist);
    // Mở form sửa
  };

  const handleDelete = (artist: any) => {
    console.log("Xoá:", artist);
    // Xác nhận xoá
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý nghệ sĩ</h2>
        <Button
          onClick={() => {
            route.push("/artist/FormAdd");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm nghệ sĩ
        </Button>
      </div>

      {loading ? (
        <p>Đang tải danh sách nghệ sĩ...</p>
      ) : artists.length === 0 ? (
        <p>Không có nghệ sĩ nào.</p>
      ) : (
        <div className="flex flex-col flex-wrap gap-4">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.ID}
              artist={artist}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistList;
