"use client";
import React, { useState, useEffect } from "react";
import { getAllReview, updateReview, deleteReview } from "@/api/ApiReview";
import UpdateStatusModal from "./UpdateReview";

const PAGE_SIZE = 5;

const ReviewList = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("PUBLISH");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReview();
      setReviews(data);
    } catch (err) {
      alert(err);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (id: number, status: string) => {
    setSelectedReviewId(id);
    setSelectedStatus(status);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      const updated = reviews.filter((r) => r.Id !== id);
      setReviews(updated);
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      if (!selectedReviewId) return;

      await updateReview(selectedReviewId, newStatus);
      alert("Cập nhật trạng thái thành công");

      const updated = reviews.map((r) =>
        r.Id === selectedReviewId ? { ...r, Status: newStatus } : r
      );
      setReviews(updated);
    } catch (err: any) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      PUBLISH: { class: "bg-green-100 text-green-800", text: "Đã xuất bản" },
      NOT_PUBLISH: { class: "bg-red-100 text-red-800", text: "Chưa xuất bản" },
    };
    const config = statusConfig[status] || statusConfig["NOT_PUBLISH"];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full py-8">
      <div className="bg-white w-full shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Danh sách đánh giá
          </h2>
          <p className="text-gray-600 mt-1">
            Tổng cộng: {reviews.length} đánh giá
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReviews.map((review: any) => (
                <tr key={review.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{review.Id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {review.UserName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={review.Content}>
                      {review.Content}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getStatusBadge(review.Status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(review.CreateAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleOpenModal(review.Id, review.Status)
                        }
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-xs"
                      >
                        Cập nhật
                      </button>
                      <button
                        onClick={() => handleDelete(review.Id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs"
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 p-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      <UpdateStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdateStatus}
        currentStatus={selectedStatus}
      />
    </div>
  );
};

export default ReviewList;
