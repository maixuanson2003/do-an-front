// components/ArtistList.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListArtist, searchArtist, FilterArtist } from "@/api/ApiArtist";
import { getListCountry } from "@/api/ApiCountry";
import { getArtistById } from "@/api/ApiArtist";

const ARTISTS = [
  { name: "Sơn Tùng M-TP", region: "Việt Nam", image: "/artists/sontung.jpg" },
  { name: "Taylor Swift", region: "Âu Mỹ", image: "/artists/taylor.jpg" },
  {
    name: "Châu Kiệt Luân",
    region: "Trung Quốc",
    image: "/artists/jaychou.jpg",
  },
  { name: "Mlee", region: "Việt Nam", image: "/artists/mlee.jpg" },
];

const REGIONS = ["Tất cả", "Việt Nam", "Âu Mỹ", "Trung Quốc"];

export default function ArtistList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const [artist, setArtist] = useState<any>([]);
  const [region, setRegion] = useState<any>([]);

  const filteredArtists = ARTISTS.filter((artist) => {
    const matchName = artist.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion =
      selectedRegion === "Tất cả" || artist.region === selectedRegion;
    return matchName && matchRegion;
  });
  const handleSearchArtist = async (key: any) => {
    const data = await searchArtist(key);
    setArtist(data);
  };
  const handleFilterArtist = async (countryid: any) => {
    const data = await FilterArtist(countryid);
    setArtist(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getListArtist();
      setArtist(data);
    };
    const fetchDataCountry = async () => {
      const data = await getListCountry();
      setRegion(data);
    };
    fetchDataCountry();
    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách nghệ sĩ</h1>
      <Input
        placeholder="Tìm kiếm nghệ sĩ..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearchArtist(e.target.value);
        }}
        className="mb-4"
      />
      <div className="flex gap-2 flex-wrap mb-6">
        {region.map((region: any) => (
          <Badge
            key={region.Id}
            onClick={() => {
              setSelectedRegion(region);
              handleFilterArtist(region.Id);
            }}
            variant={selectedRegion === region ? "default" : "outline"}
            className="cursor-pointer"
          >
            {region.CountryName}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artist.map((artist: any) => (
          <div
            key={artist.ID}
            className="rounded-2xl bg-white shadow p-4 hover:shadow-lg transition"
          >
            <img
              // src={artist.image}
              alt={artist.name}
              className="rounded-xl h-40 w-full object-cover mb-3"
            />
            <h2 className="font-semibold text-lg">{artist.Name}</h2>
            <p className="text-sm text-gray-500">{artist.Country}</p>
            <Button
              onClick={() => {
                router.push(`/artist/${artist.ID}`);
              }}
              variant="default"
              className="mt-3 w-full"
            >
              Xem thêm
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
