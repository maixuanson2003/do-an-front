"use client";

import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAllUser } from "@/api/ApiUser"; // gọi API từ backend Go

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();
        setUsers(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý người dùng</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {loading ? (
        <p>Đang tải người dùng...</p>
      ) : users.length === 0 ? (
        <p>Không có người dùng nào.</p>
      ) : (
        <div className="flex flex-col flex-wrap gap-4">
          {users.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              onEdit={(u) => console.log("Sửa:", u)}
              onDelete={(u) => console.log("Xoá:", u)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
