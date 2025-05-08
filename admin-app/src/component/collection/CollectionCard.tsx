"use client";

import { CalendarClock, FileMusic, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollectionCard = ({
  collection,
  onViewDetail,
  onDelete,
}: {
  collection: any;
  onViewDetail: (collection: any) => void;
  onDelete: (collection: any) => void;
}) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white flex flex-col justify-between w-full">
      <div>
        <div className="flex items-center gap-2 text-lg font-semibold text-blue-600 mb-2">
          <FileMusic size={20} />
          {collection.NameCollection}
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Tạo lúc: {new Date(collection.CreateAt).toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Cập nhật: {new Date(collection.UpdateAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onViewDetail(collection)}
          className="flex items-center gap-1"
        >
          <Eye size={16} />
          Xem chi tiết
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(collection)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          Xoá
        </Button>
      </div>
    </div>
  );
};

export default CollectionCard;
