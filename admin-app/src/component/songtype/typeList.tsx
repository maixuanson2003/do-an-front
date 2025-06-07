"use client";

import { useEffect, useState } from "react";
import {
  getListType,
  createType,
  deleteType,
  updateType,
} from "../../api/ApiSongType";

interface SongType {
  id: number;
  type: string;
  create: string;
}

export default function SongTypePage() {
  const [types, setTypes] = useState<SongType[]>([]);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchData = async () => {
    const data = await getListType();
    setTypes(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newType.trim()) return;
    await createType(newType);
    setNewType("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xoá?")) {
      await deleteType(id);
      fetchData();
    }
  };

  const startEditing = (id: number, currentType: string) => {
    setEditingId(id);
    setEditValue(currentType);
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    await updateType(id, editValue);
    setEditingId(null);
    setEditValue("");
    fetchData();
  };

  // Phân trang
  const totalPages = Math.ceil(types.length / itemsPerPage);
  const currentItems = types.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Quản lý Thể loại Bài hát (SongType)
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tên thể loại mới"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Thêm
        </button>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Tên thể loại</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Không có dữ liệu.
              </td>
            </tr>
          ) : (
            currentItems.map((type, index) => (
              <tr key={type.id}>
                <td className="p-2 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-2 border">
                  {editingId === type.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    type.type
                  )}
                </td>
                <td className="p-2 border">
                  {new Date(type.create).toLocaleDateString()}
                </td>
                <td className="p-2 border flex gap-2">
                  {editingId === type.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(type.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(type.id, type.type)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 items-center">
        <p>
          Trang {currentPage} / {totalPages}
        </p>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
