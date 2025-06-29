"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ChevronRight,
  Filter,
  Star,
  MapPin,
  Sparkles,
  Music,
} from "lucide-react";
import { getListArtist, searchArtist, FilterArtist } from "@/api/ApiArtist";
import { getListCountry } from "@/api/ApiCountry";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ArtistList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [artists, setArtists] = useState<any>([]);
  const [regions, setRegions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(artists.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtists = artists.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [artistData, countryData] = await Promise.all([
          getListArtist(),
          getListCountry(),
        ]);
        setArtists(artistData);
        setRegions(countryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchArtist = async (searchTerm: string) => {
    setSearch(searchTerm);
    setCurrentPage(1);
    if (searchTerm.trim() === "") {
      const data = await getListArtist();
      setArtists(data);
      return;
    }
    const data = await searchArtist(searchTerm);
    setArtists(data);
  };

  const handleFilterArtist = async (country: any) => {
    setSelectedRegion(country);
    setCurrentPage(1);
    const data = await FilterArtist(country.Id);
    setArtists(data);
  };

  const clearFilters = async () => {
    setSelectedRegion(null);
    setSearch("");
    setCurrentPage(1);
    const data = await getListArtist();
    setArtists(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Floating Music Notes Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Music className="absolute top-20 left-20 w-6 h-6 text-white/20 animate-bounce delay-500" />
          <Music className="absolute top-32 right-32 w-4 h-4 text-white/15 animate-bounce delay-1000" />
          <Sparkles className="absolute bottom-40 left-40 w-5 h-5 text-white/25 animate-pulse delay-300" />
          <Star className="absolute top-40 left-1/2 w-4 h-4 text-white/20 animate-pulse delay-700" />
        </div>

        <div className="relative z-10 px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">
                Khám phá tài năng
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Nghệ Sĩ Tài Năng
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Khám phá thế giới âm nhạc qua những nghệ sĩ xuất sắc từ khắp nơi
              trên thế giới
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Input
                  placeholder="Tìm kiếm nghệ sĩ yêu thích của bạn..."
                  value={search}
                  onChange={(e) => handleSearchArtist(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-md border-none rounded-2xl shadow-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 transition-all duration-300 group-hover:shadow-xl"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {selectedRegion && (
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-md">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedRegion.CountryName}
                  <button
                    onClick={clearFilters}
                    className="ml-2 hover:text-red-200 text-lg"
                  >
                    ×
                  </button>
                </Badge>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc theo khu vực
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80 bg-white/95 backdrop-blur-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-gray-800">
                      🌍 Lọc theo khu vực
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                      Chọn quốc gia hoặc khu vực bạn quan tâm để khám phá nghệ
                      sĩ
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                      {regions.map((region: any) => (
                        <Badge
                          key={region.Id}
                          onClick={() => handleFilterArtist(region)}
                          variant={
                            selectedRegion?.Id === region.Id
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-4 py-3 text-sm justify-start hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                        >
                          <MapPin className="w-3 h-3 mr-2" />
                          {region.CountryName}
                        </Badge>
                      ))}
                    </div>
                    {selectedRegion && (
                      <Button
                        variant="ghost"
                        className="mt-6 w-full text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                        onClick={clearFilters}
                      >
                        🗑️ Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Khu vực:
            </span>
            {regions.slice(0, 8).map((region: any) => (
              <Badge
                key={region.Id}
                onClick={() => handleFilterArtist(region)}
                variant={
                  selectedRegion?.Id === region.Id ? "default" : "outline"
                }
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                {region.CountryName}
              </Badge>
            ))}
            {regions.length > 8 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Badge variant="outline" className="cursor-pointer">
                    +{regions.length - 8} khác
                  </Badge>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Tất cả khu vực</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 grid grid-cols-1 gap-2">
                    {regions.map((region: any) => (
                      <Badge
                        key={region.Id}
                        onClick={() => handleFilterArtist(region)}
                        variant={
                          selectedRegion?.Id === region.Id
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer justify-start"
                      >
                        {region.CountryName}
                      </Badge>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {selectedRegion && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[80%] mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentArtists.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-8">
              <Search className="h-16 w-16 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy nghệ sĩ nào
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc của bạn
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-3 rounded-xl text-lg font-medium"
            >
              🎵 Xem tất cả nghệ sĩ
            </Button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRegion
                    ? `Nghệ sĩ từ ${selectedRegion.CountryName}`
                    : "Tất cả nghệ sĩ"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {artists.length} nghệ sĩ
                </p>
              </div>
            </div>

            {/* Artist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentArtists.map((artist: any, index: number) => (
                <div
                  key={artist.ID}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* ẢNH ĐẠI DIỆN */}
                  <div className="relative h-48 overflow-hidden">
                    {artist.Image ? (
                      /* ẢNH TỪ API */
                      <img
                        src={artist.Image}
                        alt={artist.Name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Fallback gradient nếu chưa có ảnh */
                      <div className="h-full w-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                        <User className="w-16 h-16 text-white/70 drop-shadow-lg" />
                      </div>
                    )}

                    {/* Mờ khi hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Thông tin nghệ sĩ */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {artist.Name}
                    </h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{artist.Country}</span>
                    </div>

                    <Button
                      onClick={() => router.push(`/artist/${artist.ID}`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl py-3 font-medium transition-all duration-300 group-hover:shadow-lg"
                    >
                      Khám phá <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  variant="outline"
                  className="rounded-xl px-6"
                >
                  ← Trước
                </Button>

                <div className="flex gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum =
                      currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        className={`w-10 h-10 rounded-xl ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  variant="outline"
                  className="rounded-xl px-6"
                >
                  Sau →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
