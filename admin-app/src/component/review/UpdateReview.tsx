"use client";
import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newStatus: string) => void;
  currentStatus: string;
}

const UpdateStatusModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpdate,
  currentStatus,
}) => {
  console.log(currentStatus);

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus, isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[320px]">
        <h2 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="PUBLISH">Đã xuất bản</option>
          <option value="NOT_PUBLISH">Chưa xuất bản</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={() => onUpdate(selectedStatus)}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
