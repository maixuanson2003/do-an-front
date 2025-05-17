"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ChevronRight, Filter } from "lucide-react";
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
  const itemsPerPage = 8;
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Danh sách nghệ sĩ
        </h1>
        <p className="text-indigo-100 mb-6">
          Khám phá những nghệ sĩ tài năng từ khắp nơi trên thế giới
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Input
            placeholder="Tìm kiếm nghệ sĩ..."
            value={search}
            onChange={(e) => handleSearchArtist(e.target.value)}
            className="pl-10 bg-white/10 backdrop-blur-md border-none text-white placeholder:text-white/70 focus-visible:ring-white/30"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
        </div>

        {/* Mobile Filter Button and Active Filter Display */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {selectedRegion && (
              <Badge className="bg-white/20 hover:bg-white/30 text-white">
                {selectedRegion.CountryName}
                <button
                  onClick={clearFilters}
                  className="ml-2 hover:text-red-200"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-none text-white hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72">
              <SheetHeader>
                <SheetTitle>Lọc theo khu vực</SheetTitle>
                <SheetDescription>
                  Chọn quốc gia hoặc khu vực bạn quan tâm
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-2">
                  {regions.map((region: any) => (
                    <Badge
                      key={region.Id}
                      onClick={() => handleFilterArtist(region)}
                      variant={
                        selectedRegion?.Id === region.Id ? "default" : "outline"
                      }
                      className="mr-2 mb-2 cursor-pointer px-3 py-1 text-sm"
                    >
                      {region.CountryName}
                    </Badge>
                  ))}
                </div>
                {selectedRegion && (
                  <Button
                    variant="ghost"
                    className="mt-4 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={clearFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white border-b p-4">
        <div className="container mx-auto">
          <h3 className="font-medium mb-2 text-gray-700">Khu vực:</h3>
          <div className="flex flex-wrap gap-2">
            {regions.map((region: any) => (
              <Badge
                key={region.Id}
                onClick={() => handleFilterArtist(region)}
                variant={
                  selectedRegion?.Id === region.Id ? "default" : "outline"
                }
                className="cursor-pointer"
              >
                {region.CountryName}
              </Badge>
            ))}
            {selectedRegion && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
              <div key={skeleton} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-xl"></div>
                <div className="bg-white p-4 rounded-b-xl">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentArtists.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Không tìm thấy nghệ sĩ
            </h3>
            <p className="text-gray-500 mt-1">
              Hãy thử tìm kiếm với từ khóa khác
            </p>
            <Button onClick={clearFilters} className="mt-4">
              Xem tất cả nghệ sĩ
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentArtists.map((artist: any) => (
                <div
                  key={artist.ID}
                  className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-6 flex items-center justify-center">
                    <div className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                      {artist.Name}
                    </h2>
                    <p className="text-sm text-gray-500">{artist.Country}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Button
                        onClick={() => router.push(`/artist/${artist.ID}`)}
                        variant="default"
                        className="group-hover:bg-indigo-700 transition-colors duration-300"
                      >
                        Xem thêm
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                variant="outline"
              >
                Trang trước
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                variant="outline"
              >
                Trang sau
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
