"use client";

import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeleteUser, getAllUser } from "@/api/ApiUser"; // gọi API từ backend Go
import { useRouter } from "next/navigation";

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(0);
  const router = useRouter();

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
  }, [render]);
  const handleDelete = async (id: any) => {
    try {
      const res = await DeleteUser(id);
      alert("delete success");
      setRender(render + 1);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý người dùng</h2>
        <Button onClick={() => router.push("/user/formadd")}>
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
              onEdit={(u) => router.push(`/user/formupdate?userid=${user.ID}`)}
              onDelete={(u) => handleDelete(user.ID)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
