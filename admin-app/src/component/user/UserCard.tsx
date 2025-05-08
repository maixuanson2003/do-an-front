"use client";

import {
  Mail,
  Phone,
  UserCircle,
  MapPin,
  UserRoundCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UserCard = ({
  user,
  onEdit,
  onDelete,
}: {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-500" />
            {user.FullName}
          </div>
          <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
            {user.Role}
          </span>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user.Email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> {user.Phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {user.Address}
          </p>
          <p className="flex items-center gap-2">
            <UserRoundCheck className="w-4 h-4" /> {user.Gender} - {user.Age}{" "}
            tuổi
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onEdit(user)}
          className="flex items-center gap-1"
        >
          <Pencil size={16} />
          Sửa
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(user)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          Xoá
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
