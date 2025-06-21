import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  onExplore?: () => void;
}

export default function EmptyState({ onExplore }: EmptyStateProps) {
  return (
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
      {onExplore && (
        <button
          onClick={onExplore}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform duration-300 shadow-lg z-0"
        >
          Khám phá ngay
        </button>
      )}
    </div>
  );
}
