"use client";

import { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  getListCollection,
  CreateCollection,
  DeleteCollection,
} from "@/api/ApiCollection";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const CollectionList = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [render, setRender] = useState(0);
  const itemsPerPage = 5;
  const route = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getListCollection();
        setCollections(data);
      } catch (err) {
        console.error("Lỗi khi lấy bộ sưu tập:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [render]);

  useEffect(() => {
    const filtered = collections.filter((col) =>
      col?.NameCollection?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollections(filtered);
    setCurrentPage(1); // reset về trang đầu khi tìm kiếm
  }, [searchTerm, collections]);

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;

    try {
      const newCollection = await CreateCollection(newCollectionName);
      setCollections([newCollection, ...collections]);
      setNewCollectionName("");
      setRender(render + 1);
      setOpenDialog(false);
    } catch (err) {
      alert(err);
      console.error("Lỗi khi tạo:", err);
    }
  };

  const handleViewDetail = (collection: any) => {
    route.push(`/collection/${collection.ID}`);
  };

  const handleDelete = async (collection: any) => {
    try {
      await DeleteCollection(collection.ID);
      setRender(render + 1);
    } catch (err) {
      alert(err);
    }
  };

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const currentData = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Header: Title + Search + Add */}
      <div className="flex flex-wrap justify-between items-center  mb-4">
        <h2 className="text-xl font-bold">Quản lý bộ sưu tập</h2>
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bộ sưu tập
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm bộ sưu tập mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label htmlFor="name">Tên bộ sưu tập</Label>
              <Input
                id="name"
                placeholder="Nhập tên bộ sưu tập"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : currentData.length === 0 ? (
        <p>Không tìm thấy bộ sưu tập nào.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {currentData.map((collection, index) => (
            <CollectionCard
              key={index}
              collection={collection}
              onViewDetail={handleViewDetail}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
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
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
