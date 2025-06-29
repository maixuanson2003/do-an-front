import React from "react";
import { useRouter } from "next/navigation";
import { Headphones, Play, Star } from "lucide-react";

interface CollectionCardProps {
  collection: {
    ID: string;
    NameCollection: string;
    Description?: string;
    SongCount?: number;
    gradient: string;
  };
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/collection/${collection.ID}`)}
      className={`rounded-3xl p-8 text-white shadow-2xl hover:scale-110 hover:-rotate-1 transition-all duration-500 cursor-pointer ${collection.gradient} group relative overflow-hidden z-0`}
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
            <div className="flex items-center gap-1 mt-2 z-0">
              <Star size={12} className="text-yellow-300 z-0" />
              <span className="text-xs text-white/80 z-0">Premium</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 z-0">
          <h2 className="text-2xl font-bold group-hover:translate-x-1 transition-transform duration-300 line-clamp-2 z-0">
            {collection.NameCollection}
          </h2>
          <p className="text-sm text-white/90 line-clamp-3 leading-relaxed z-0">
            {collection.Description ||
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
  );
}
