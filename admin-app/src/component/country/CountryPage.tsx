"use client";

import { useState, useEffect } from "react";
import {
  getListCountry,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../api/ApiCountry";

interface Country {
  Id: number;
  CountryName: string;
  CreateAt: string;
}

export default function CountryPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchData = async () => {
    const data = await getListCountry();
    setCountries(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newCountry.trim()) return;
    await createCountry(newCountry);
    setNewCountry("");
    fetchData();
  };

  const startEditing = (id: number, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    await updateCountry(id, editValue);
    setEditingId(null);
    setEditValue("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xoá country này?")) {
      await deleteCountry(id);
      fetchData();
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = countries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý Quốc gia (Country)</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tên quốc gia mới"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
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
            <th className="p-2 border">Tên quốc gia</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {countries.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Không có dữ liệu.
              </td>
            </tr>
          ) : (
            currentItems.map((country, index) => (
              <tr key={country.Id}>
                <td className="p-2 border text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-2 border">
                  {editingId === country.Id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    country.CountryName
                  )}
                </td>
                <td className="p-2 border">
                  {new Date(country.CreateAt).toLocaleDateString()}
                </td>
                <td className="p-2 border flex gap-2">
                  {editingId === country.Id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(country.Id)}
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
                        onClick={() =>
                          startEditing(country.Id, country.CountryName)
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(country.Id)}
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

      {/* Pagination controls */}
      {countries.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Trang trước
          </button>

          <span>
            Trang {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
