"use client";

import { useEffect, useState } from "react";
import { getAlbumById, updateAlbum } from "@/api/ApiAlbum";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AlbumUpdateForm() {
  const param = useSearchParams();
  const id = param.get("id");
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    NameAlbum: "",
    Description: "",
    ReleaseDay: "",
    ArtistOwner: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbumById(Number(id))
      .then((data) => {
        setFormData({
          NameAlbum: data.NameAlbum,
          Description: data.Description,
          ReleaseDay: data.ReleaseDay?.split("T")[0] || "",
          ArtistOwner: data.ArtistOwner,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load album failed:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const releaseDayISO = new Date(formData.ReleaseDay).toISOString();

      await updateAlbum(id, {
        NameAlbum: formData.NameAlbum,
        Description: formData.Description,
        ReleaseDay: releaseDayISO,
        ArtistOwner: formData.ArtistOwner,
      });

      alert("Cập nhật thành công!");
      router.push("/album");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Lỗi khi cập nhật album.");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Cập nhật Album</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Tên Album</label>
        <input
          type="text"
          name="NameAlbum"
          value={formData.NameAlbum}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mô tả</label>
        <textarea
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Ngày phát hành</label>
        <input
          type="date"
          name="ReleaseDay"
          value={formData.ReleaseDay}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Chủ sở hữu nghệ sĩ</label>
        <input
          type="text"
          name="ArtistOwner"
          value={formData.ArtistOwner}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cập nhật Album
      </button>
    </form>
  );
}
