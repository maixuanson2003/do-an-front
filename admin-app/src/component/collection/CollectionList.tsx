"use client";

import { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getListCollection, CreateCollection } from "@/api/ApiCollection";
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

const CollectionList = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [render, setRender] = useState<any>(0);

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

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;

    try {
      const newCollection = await CreateCollection(newCollectionName); // Gọi API tạo
      setCollections([newCollection, ...collections]);
      setNewCollectionName("");
      setRender(render + 1);
      setOpenDialog(false);
    } catch (err) {
      console.error("Lỗi khi tạo:", err);
    }
  };

  const handleViewDetail = (collection: any) => {
    console.log("Xem chi tiết:", collection);
  };

  const handleDelete = (collection: any) => {
    console.log("Xoá:", collection);
  };

  return (
    <div className="space-y-4">
      {/* Title + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý bộ sưu tập</h2>

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
                onChange={(e: any) => setNewCollectionName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách collection */}
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : collections.length === 0 ? (
        <p>Không có bộ sưu tập nào.</p>
      ) : (
        <div className="flex flex-col flex-wrap gap-4">
          {collections?.map((collection: any, index: any) => (
            <CollectionCard
              key={index}
              collection={collection}
              onViewDetail={handleViewDetail}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionList;
