"use client";
import React, { useEffect, useState } from "react";
import SongCard from "./SongCard";
import { GetAllSong, SearchSong, FilterSong } from "@/api/ApiSong";
import { getListArtist } from "@/api/ApiArtist";
import { getListType } from "@/api/ApiSongType";
import { getReviewBySong, CreateReview } from "@/api/ApiReview";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Artist = {
  id: number;
  name: string;
  description: string;
};

type SongData = {
  ID: number;
  NameSong: string;
  Description: string;
  ReleaseDay: string;
  CreateDay: string;
  UpdateDay: string;
  Point: number;
  LikeAmount: number;
  Status: string;
  CountryId: number;
  ListenAmout: number;
  AlbumId: number | null;
  SongResource: string;
};

type SongItem = {
  SongData: SongData;
  artist: Artist[];
};

const SongListPage: React.FC = () => {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [artistId, setArtistId] = useState<number[]>([]);
  const [typeId, setTypeId] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState<any>([]);
  const [allArtists, setAllArtists] = useState<any>([]);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [review, setReview] = useState<any>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Phân trang
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10); // Số bài hát mỗi trang, có thể thay đổi theo API

  useEffect(() => {
    const fetchData = async (pages: number) => {
      setLoading(true);
      try {
        const data = await GetAllSong(pages);
        setSongs(data);

        // Tính toán tổng số trang (giả sử API có trả về tổng số bài hát)
        // Nếu API không trả về tổng số bài hát, bạn có thể giữ một số trang cố định
        // hoặc tính toán dựa vào số lượng dữ liệu trong mỗi phản hồi
        // Ví dụ: nếu số lượng item < itemsPerPage, đó có thể là trang cuối cùng
        if (data.length === 0 && page > 1) {
          setPage(page - 1); // Quay lại trang trước nếu trang hiện tại không có dữ liệu
        } else {
          // Ước tính tổng số trang nếu API không cung cấp
          // Giả định có ít nhất 5 trang nếu trang hiện tại có dữ liệu
          setTotalPages(Math.max(page + 4, totalPages));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTypeData = async () => {
      const data = await getListType();
      setGenres(data);
    };

    const fetchArtistData = async () => {
      const data = await getListArtist();
      setAllArtists(data);
    };

    fetchTypeData();
    fetchArtistData();
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const fetchReviewBySong = async (songId: any) => {
      if (selectedSong) {
        const data = await getReviewBySong(songId);
        setReview(data);
      }
    };
    fetchReviewBySong(selectedSong?.SongData.ID);
  }, [selectedSong, submitting]);

  const searchSongs = async (keyword: any) => {
    setLoading(true);
    try {
      const data = await SearchSong(keyword);
      setSongs(data);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await FilterSong(artistId, typeId);
        setSongs(data);
        setPage(1); // Reset về trang 1 khi lọc
      } catch (error) {
        console.error("Lỗi khi lọc dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId.length > 0 || typeId.length > 0) {
      fetchData();
    } else if (artistId.length === 0 && typeId.length === 0) {
      const fetchAllData = async () => {
        setLoading(true);
        try {
          const data = await GetAllSong(page);
          setSongs(data);
        } catch (error) {
          console.error("Lỗi khi tải tất cả dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }
  }, [artistId, typeId]);

  const handleArtistFilter = (id: number) => {
    setArtistId((prev) =>
      prev.includes(id) ? prev.filter((artist) => artist !== id) : [...prev, id]
    );
  };

  const handleGenreFilter = (id: number) => {
    setTypeId((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

  const handleCommentClick = (song: SongItem) => {
    setSelectedSong(song);
  };

  const closeCommentPanel = () => {
    setSelectedSong(null);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedSong) return;

    const userId = localStorage.getItem("userid");
    const payload = {
      UserId: userId,
      SongId: selectedSong.SongData.ID,
      Content: commentText.trim(),
    };

    try {
      setSubmitting(true);
      await CreateReview(payload);
      setCommentText("");
      alert("✅ Gửi bình luận thành công!");
    } catch (error) {
      alert("❌ Gửi bình luận thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý phân trang
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số nút trang tối đa hiển thị

    // Tính toán phạm vi trang hiển thị
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Điều chỉnh lại nếu không đủ trang ở phía cuối
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        🎧 Danh sách bài hát
      </h1>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm bài hát hoặc nghệ sĩ..."
        className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          searchSongs(e.target.value);
        }}
      />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-6">
        {allArtists.map((artist: any) => (
          <button
            key={artist.ID}
            onClick={() => handleArtistFilter(artist.ID)}
            className={`px-4 py-1 rounded-full border ${
              artistId.includes(artist.ID)
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            } hover:shadow transition text-sm`}
          >
            🎙 {artist.Name}
          </button>
        ))}
        {genres.map((genre: any) => (
          <button
            key={genre.id}
            onClick={() => handleGenreFilter(genre.id)}
            className={`px-4 py-1 rounded-full border ${
              typeId.includes(genre.id)
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700"
            } hover:shadow transition text-sm`}
          >
            🎵 {genre.type}
          </button>
        ))}
      </div>

      {/* Trạng thái loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Danh sách bài hát */}
      <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading && songs && songs.length > 0
          ? songs.map((song) => (
              <SongCard
                key={song.SongData.ID}
                song={song}
                onCommentClick={handleCommentClick}
              />
            ))
          : !loading && (
              <p className="text-gray-500 col-span-full text-center py-8">
                Không tìm thấy bài hát.
              </p>
            )}
      </div>

      {/* Phân trang */}
      {!loading && songs.length > 0 && (
        <div className="mt-8 flex justify-center items-center">
          <div className="flex space-x-2 items-center">
            {/* Nút Previous */}
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`flex items-center px-3 py-2 rounded-md ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } border shadow-sm transition`}
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Trước</span>
            </button>

            {/* Các nút số trang */}
            <div className="flex space-x-1">
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-4 py-2 rounded-md border ${
                    page === pageNumber
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } transition`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Nút Next */}
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`flex items-center px-3 py-2 rounded-md ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } border shadow-sm transition`}
            >
              <span className="mr-1">Tiếp</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị thông tin trang hiện tại */}
      {!loading && songs.length > 0 && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Trang {page} / {totalPages}
        </div>
      )}

      {/* 💬 Khung bình luận bên phải */}
      {selectedSong && (
        <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white border-l shadow-2xl z-50 p-6 overflow-y-auto transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              💬 Bình luận về:{" "}
              <span className="text-green-600">
                {selectedSong.SongData.NameSong}
              </span>
            </h2>
            <button
              onClick={closeCommentPanel}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Danh sách bình luận */}
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-1 custom-scroll">
            {/* Mỗi comment */}
            {review.length > 0 ? (
              review.map((item: any) => (
                <div key={item.Id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    {item.UserName[0]}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {item.UserName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{item.Content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </p>
            )}
          </div>

          {/* Nhập bình luận */}
          <div className="border-t pt-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
              placeholder="Viết bình luận..."
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              disabled={submitting}
              onClick={handleSubmitComment}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition w-full disabled:opacity-50"
            >
              🚀 {submitting ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongListPage;
