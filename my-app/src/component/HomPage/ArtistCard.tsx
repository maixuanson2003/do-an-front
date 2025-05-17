"use client";

import { useState } from "react";
import { Play, User, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ArtistProps = {
  artist: {
    ID?: number;
    Name?: string;
    name?: string;
    Description?: string;
    genre?: string;
    Image?: string;
    image?: string;
  };
};

const ArtistCard = ({ artist }: ArtistProps) => {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  // Handle different prop naming conventions
  const name = artist.Name || artist.name || "Unknown Artist";
  const genre = artist.Description || artist.genre || "Various Genres";
  const image = artist.Image || artist.image;
  const id = artist.ID || 0;

  // Check if image exists and is valid
  const hasValidImage =
    image && !image.includes("undefined") && !image.endsWith("jpgg");

  return (
    <div
      className="relative group rounded-xl overflow-hidden transition-all duration-300 h-64"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />

      {hasValidImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-gray-800 flex items-center justify-center">
          <User className="w-16 h-16 text-white/30" />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 flex flex-col h-full justify-end transition-all duration-300">
        <div
          className={`transform transition-all duration-500 ${
            isHovering ? "translate-y-0" : "translate-y-2"
          }`}
        >
          <h3 className="font-bold text-xl text-white drop-shadow-md mb-1">
            {name}
          </h3>
          <p className="text-gray-300 text-sm mb-4 opacity-80">{genre}</p>

          <div
            className={`flex items-center space-x-3 transform transition-all duration-500 ${
              isHovering
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-black border-white/40 hover:bg-white/20 hover:border-white"
              onClick={() => id && router.push(`/artist/${id}`)}
            >
              Hồ sơ
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div
        className={`absolute top-4 right-4 rounded-full bg-black/30 backdrop-blur-sm p-2 z-20 transition-all duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <Music className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};

export default ArtistCard;
