"use client";

import { Mail, UserCircle, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ArtistCard = ({
  artist,
  onEdit,
  onDelete,
}: {
  artist: any;
  onEdit: (artist: any) => void;
  onDelete: (artist: any) => void;
}) => {
  const route = useRouter();
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-500" />
            {artist.Name}
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Ngày sinh: {artist.BirthDay}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Quốc gia: {artist.Country}
          </p>
          <p className="text-sm">{artist.Description}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            route.push(`/artist/formupdate?artistid=${artist.ID}`);
          }}
          className="flex items-center gap-1"
        >
          <Edit size={16} />
          Sửa
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(artist)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          Xoá
        </Button>
      </div>
    </div>
  );
};

export default ArtistCard;
