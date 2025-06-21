import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm bộ sưu tập yêu thích...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-lg mx-auto mb-12 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl z-0"></div>
      <div className="relative z-0">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 z-0"
          size={20}
        />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 py-4 bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-2xl text-lg z-0"
        />
      </div>
    </div>
  );
}
