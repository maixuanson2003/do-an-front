"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, ArrowLeft, Plus, Trash2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSong } from "@/api/ApiSong";
import {
  getCollectionDetail,
  addSongToCollection,
  removeSongFromCollection,
} from "@/api/ApiCollection";

const CollectionDetailAdmin = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [collection, setCollection] = useState<any>(null);
  const [songs, setSongs] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [reload, setReload] = useState(0);

  // Fetch collection details
  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        const data = await getCollectionDetail(id);
        setCollection(data);
        setSongs(data.Song || []);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết bộ sưu tập:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [id, reload]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim()) {
        setSearching(true);
        try {
          const results = await SearchSong(searchTerm);
          console.log(results);

          setSearchResults(results);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm bài hát:", err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [searchTerm, songs]);

  const handleAddSong = async (song: any) => {
    try {
      await addSongToCollection(id, song.SongData.ID);
      setSongs([...songs, song]);
      setReload(reload + 1);
    } catch (err) {
      console.error("Lỗi khi thêm bài hát vào bộ sưu tập:", err);
    }
  };

  const handleRemoveSong = async (songId: any) => {
    try {
      await removeSongFromCollection(id, songId);
      setSongs(songs.filter((song: any) => song.ID !== songId));
      setReload(reload + 1);
    } catch (err) {
      console.error("Lỗi khi xóa bài hát khỏi bộ sưu tập:", err);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!collection) {
    return <div className="p-6">Không tìm thấy bộ sưu tập</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">{collection.NameCollection}</h1>
      </div>

      {/* Search Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Thêm bài hát vào bộ sưu tập</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bài hát..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="border rounded-lg overflow-hidden">
            {searching ? (
              <div className="p-4 text-center">Đang tìm kiếm...</div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y">
                {searchResults.map((song: any, index: any) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{song.SongData.NameSong}</p>
                        <p className="text-sm text-gray-500">
                          {song.artist?.map((a: any) => a.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddSong(song)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>
        )}
      </div>

      {/* Songs in Collection */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Danh sách bài hát ({songs.length})
        </h2>

        {songs.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">
              Chưa có bài hát nào trong bộ sưu tập này
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden divide-y">
            {songs.map((song: any, index: any) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{song.NameSong}</p>
                    <p className="text-sm text-gray-500">ss</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSong(song.ID)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailAdmin;
