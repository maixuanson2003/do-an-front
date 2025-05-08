"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getListCollection } from "@/api/ApiCollection";

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [collection, setCollection] = useState<any[]>([]);

  // Danh sách các màu có thể gán ngẫu nhiên
  const themeColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getListCollection();
      // Gán màu ngẫu nhiên cho từng collection
      const dataWithColors = data.map((item: any) => ({
        ...item,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
      }));
      setCollection(dataWithColors);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tuyển tập Ca khúc</h1>
      <Input
        placeholder="Tìm kiếm bộ sưu tập..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {collection
          .filter((col) =>
            col.NameCollection.toLowerCase().includes(search.toLowerCase())
          )
          .map((col) => (
            <div
              key={col.id}
              onClick={() => {
                router.push(`/collection/${col.id}`);
              }}
              className={`rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer ${col.color}`}
            >
              <h2 className="text-lg font-semibold">{col.NameCollection}</h2>
            </div>
          ))}
      </div>
    </div>
  );
}
