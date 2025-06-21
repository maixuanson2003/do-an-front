"use client";
import React, { useEffect, useState } from "react";
import { getListCollection } from "@/api/ApiCollection";

// Components
import CollectionHeader from "./CollectionHeader";
import SearchBar from "./SearchBar";
import CollectionCard from "./CollectionCard";
import CollectionSkeleton from "./CollectionSkeleton";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import FloatingNotes from "./FloatingNote";

// Types
interface Collection {
  ID: string;
  NameCollection: string;
  Description?: string;
  SongCount?: number;
  gradient: string;
}

// Constants
const THEME_GRADIENTS = [
  "bg-gradient-to-r from-pink-500 to-purple-500",
  "bg-gradient-to-r from-blue-500 to-teal-400",
  "bg-gradient-to-r from-green-400 to-cyan-500",
  "bg-gradient-to-r from-yellow-400 to-orange-500",
  "bg-gradient-to-r from-indigo-500 to-purple-600",
  "bg-gradient-to-r from-red-500 to-pink-500",
  "bg-gradient-to-r from-teal-400 to-blue-500",
  "bg-gradient-to-r from-amber-500 to-pink-500",
  "bg-gradient-to-r from-emerald-500 to-blue-600",
];

const ITEMS_PER_PAGE = 8;

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch collections data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getListCollection();
        const dataWithGradients = data.map((item: any) => ({
          ...item,
          gradient:
            THEME_GRADIENTS[Math.floor(Math.random() * THEME_GRADIENTS.length)],
        }));
        setCollections(dataWithGradients);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter collections based on search
  const filteredCollections = collections.filter((col) =>
    col.NameCollection.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCollections = filteredCollections.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);

  // Handle search with pagination reset
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Handle explore button
  const handleExplore = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 pt-20 z-0">
      <div className="relative w-full mx-auto z-0">
        <CollectionHeader />

        <SearchBar value={search} onChange={handleSearch} />

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-0">
            <CollectionSkeleton count={ITEMS_PER_PAGE} />
          </div>
        ) : paginatedCollections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-0">
              {paginatedCollections.map((collection, index) => (
                <CollectionCard
                  key={`${collection.ID}-${index}`}
                  collection={collection}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState onExplore={handleExplore} />
        )}
      </div>

      <FloatingNotes />
    </div>
  );
}
