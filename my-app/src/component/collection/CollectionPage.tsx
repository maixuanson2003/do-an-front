"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getListCollection } from "@/api/ApiCollection";
import { Music, Search, Headphones, Play, Star } from "lucide-react";

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [collection, setCollection] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const themeGradients = [
    "bg-gradient-to-r from-pink-500 to-purple-500",
    "bg-gradient-to-r from-blue-500 to-teal-400",
    "bg-gradient-to-r from-green-400 to-cyan-500",
    "bg-gradient-to-r from-yellow-400 to-orange-500",
    "bg-gradient-to-r from-indigo-500 to-purple-600",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-teal-400 to-blue-500",
    "bg-gradient-to-r from-amber-500 to-pink-500",
    "bg-gradient-to-r from-emerald-500 to-blue-600",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getListCollection();
        const dataWithGradients = data.map((item: any) => ({
          ...item,
          gradient:
            themeGradients[Math.floor(Math.random() * themeGradients.length)],
        }));
        setCollection(dataWithGradients);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCollections = collection.filter((col: any) =>
    col.NameCollection.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCollections = filteredCollections.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  const renderSkeletons = () => {
    return Array(itemsPerPage)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="rounded-2xl p-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-32"
        >
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 pt-20 z-0">
      <div className="relative w-full mx-auto z-0">
        {/* Header */}
        <div className="mb-12 text-center z-0">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-full mb-6 shadow-2xl z-0">
            <Music size={32} className="text-purple-400 mr-2 z-0" />
            <Headphones size={28} className="text-pink-400 z-0" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 z-0">
            🎵 Music Collections
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed z-0">
            Khám phá những bộ sưu tập âm nhạc được tuyển chọn đặc biệt từ khắp
            nơi trên thế giới
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-12 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl z-0"></div>
          <div className="relative z-0">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 z-0"
              size={20}
            />
            <Input
              placeholder="Tìm kiếm bộ sưu tập yêu thích..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
              className="pl-12 py-4 bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-2xl text-lg z-0"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-0">
            {renderSkeletons()}
          </div>
        ) : paginatedCollections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-0">
              {paginatedCollections.map((col: any, index: number) => (
                <div
                  key={index}
                  onClick={() => router.push(`/collection/${col.ID}`)}
                  className={`rounded-3xl p-8 text-white shadow-2xl hover:scale-110 hover:-rotate-1 transition-all duration-500 cursor-pointer ${col.gradient} group relative overflow-hidden z-0`}
                >
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0"></div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl z-0"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl z-0"></div>

                  <div className="relative z-0">
                    <div className="flex items-start justify-between mb-6 z-0">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform duration-300 z-0">
                        <Headphones className="text-white z-0" size={24} />
                      </div>
                      <div className="flex flex-col items-end z-0">
                        <span className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20 z-0">
                          {col.SongCount || "0"} tracks
                        </span>
                        <div className="flex items-center gap-1 mt-2 z-0">
                          <Star size={12} className="text-yellow-300 z-0" />
                          <span className="text-xs text-white/80 z-0">
                            Premium
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 z-0">
                      <h2 className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-300 line-clamp-2 z-0">
                        {col.NameCollection}
                      </h2>
                      <p className="text-sm text-white/90 line-clamp-3 leading-relaxed z-0">
                        {col.Description ||
                          "Thưởng thức những giai điệu tuyệt vời được tuyển chọn đặc biệt"}
                      </p>
                    </div>

                    {/* Hover Play */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center z-0">
                      <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 z-0">
                        <Play size={32} className="text-white ml-1 z-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-500 text-white rounded-full disabled:opacity-50"
              >
                Trang trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === i + 1
                      ? "bg-pink-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-purple-500 text-white rounded-full disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 z-0">
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-full p-8 inline-flex items-center justify-center mb-6 shadow-2xl z-0">
              <Search size={48} className="text-purple-400 z-0" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 z-0">
              Không tìm thấy bộ sưu tập nào
            </h3>
            <p className="text-gray-400 text-lg z-0">
              Thử tìm kiếm với từ khóa khác hoặc khám phá các bộ sưu tập mới
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform duration-300 shadow-lg z-0">
              Khám phá ngay
            </button>
          </div>
        )}
      </div>

      {/* Floating music notes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 text-purple-300/20 text-4xl animate-bounce -z-10">
          ♪
        </div>
        <div className="absolute top-40 right-20 text-pink-300/20 text-3xl animate-pulse -z-10">
          ♫
        </div>
        <div className="absolute bottom-32 left-20 text-cyan-300/20 text-5xl animate-bounce delay-1000 -z-10">
          ♪
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300/20 text-4xl animate-pulse delay-500 -z-10">
          ♫
        </div>
      </div>
    </div>
  );
}
