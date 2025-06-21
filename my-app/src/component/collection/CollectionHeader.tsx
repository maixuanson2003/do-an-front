import React from "react";
import { Music, Headphones } from "lucide-react";

export default function CollectionHeader() {
  return (
    <div className="mb-12 text-center z-0">
      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-full mb-6 shadow-2xl z-0">
        <Music size={32} className="text-purple-400 mr-2 z-0" />
        <Headphones size={28} className="text-pink-400 z-0" />
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 z-0">
        🎵 Music Collections
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed z-0">
        Khám phá những bộ sưu tập âm nhạc được tuyển chọn đặc biệt từ khắp nơi
        trên thế giới
      </p>
    </div>
  );
}
