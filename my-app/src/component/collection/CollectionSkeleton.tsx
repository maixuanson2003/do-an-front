import React from "react";

interface CollectionSkeletonProps {
  count?: number;
}

export default function CollectionSkeleton({
  count = 8,
}: CollectionSkeletonProps) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="rounded-2xl p-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-32"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
    </>
  );
}
