"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ArtistCard from "./ArtistCard";
import { getListArtist } from "@/api/ApiArtist";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ArtistList = () => {
  const [artists, setArtists] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsPerView = 4; // Maximum number of artists to show at once

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getListArtist();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // If API data is empty, use sample data
  const displayArtists =
    artists.length > 0
      ? artists
      : [
          {
            ID: 1,
            Name: "Sơn Tùng M-TP",
            Description: "Pop",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 2,
            Name: "Noo Phước Thịnh",
            Description: "Pop",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 3,
            Name: "Đen Vâu",
            Description: "Rap",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 4,
            Name: "Mỹ Tâm",
            Description: "Pop",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 5,
            Name: "Jack",
            Description: "Pop/Rap",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 6,
            Name: "Minh Hằng",
            Description: "Pop",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 7,
            Name: "Hoàng Thùy Linh",
            Description: "Pop",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
          {
            ID: 8,
            Name: "Soobin Hoàng Sơn",
            Description: "Pop/R&B",
            Image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
          },
        ];

  const maxIndex = Math.max(0, displayArtists.length - itemsPerView);

  const scrollPrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const scrollNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  };

  // Effect to handle smooth scrolling when currentIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      const scrollAmount =
        (sliderRef.current.scrollWidth / displayArtists.length) * currentIndex;
      sliderRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [currentIndex, displayArtists.length]);

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6">
      <div className="w-full mx-auto">
        {/* Header with title and navigation buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Star className="text-yellow-500 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Nghệ sĩ nổi bật</h2>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white rounded-full h-10 w-10"
              onClick={scrollPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white rounded-full h-10 w-10"
              onClick={scrollNext}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Artist slider */}
        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden gap-4 pb-4 scroll-smooth"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {displayArtists.map((artist: any, index: number) => (
              <div
                key={artist.ID || index}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
              >
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.ceil(displayArtists.length / itemsPerView),
            }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? "w-6 bg-white"
                    : "w-2 bg-gray-600"
                }`}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => {
              route.push("/artist");
            }}
            variant="outline"
            className="border-white/20 hover:bg-white/10 text-black"
          >
            Xem tất cả nghệ sĩ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistList;
