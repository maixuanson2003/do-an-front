"use client";

import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DeleteUser, getAllUser, exportUserExcel } from "@/api/ApiUser";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 5;

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();
        setUsers(data);
        setFilteredUsers(data); // khởi tạo dữ liệu lọc ban đầu
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [render]);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.Username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset lại trang khi filter
  }, [searchKeyword, users]);

  const handleDelete = async (id: any) => {
    try {
      await DeleteUser(id);
      alert("Xóa người dùng thành công!");
      setRender(render + 1);
    } catch (err) {
      alert("Lỗi khi xóa người dùng");
    }
  };

  const handleExport = async () => {
    const data = await exportUserExcel();
    const downloadUrl = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "users.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý người dùng</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Tìm kiếm theo tên hoặc email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleExport} variant="outline">
            📥 Xuất Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Đang tải người dùng...</p>
      ) : filteredUsers.length === 0 ? (
        <p>Không tìm thấy người dùng phù hợp.</p>
      ) : (
        <>
          <div className="flex flex-col flex-wrap gap-4">
            {paginatedUsers.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onEdit={() => router.push(`/user/formupdate?userid=${user.ID}`)}
                onDelete={() => handleDelete(user.ID)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trang trước
            </Button>
            <span className="px-2 py-1 border rounded">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
