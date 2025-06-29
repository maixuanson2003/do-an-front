"use client";
import React, { useEffect, useState } from "react";
import SongCard from "./SongCard";
import { GetAllSong, SearchSong, FilterSong, GetListSong } from "@/api/ApiSong";
import { getListArtist } from "@/api/ApiArtist";
import { getListType } from "@/api/ApiSongType";
import {
  getReviewBySong,
  CreateReview,
  deleteReview,
  getReviewForUser,
} from "@/api/ApiReview";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import LoginRequiredDialog from "../toast/LoginToast";
import { useAudioPlayer } from "../music/AudioPlayerContext";

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
  const [allSongs, setAllSongs] = useState<SongItem[]>([]); // Lưu toàn bộ danh sách bài hát
  const [displayedSongs, setDisplayedSongs] = useState<SongItem[]>([]); // Bài hát hiển thị trên trang hiện tại
  const [searchKeyword, setSearchKeyword] = useState("");
  const [artistId, setArtistId] = useState<number[]>([]);
  const [typeId, setTypeId] = useState<number[]>([]);
  const [reviewUser, setReviewUser] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState<any>([]);
  const [allArtists, setAllArtists] = useState<any>([]);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [review, setReview] = useState<any>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(7);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const [likeChange, setLikeChange] = useState<any>(0);
  const [listSong, setListSong] = useState<SongItem[]>([]);
  const { playSong, setListToPlay } = useAudioPlayer();

  // Function để cập nhật phân trang dựa trên danh sách bài hát hiện tại
  const updatePagination = (songList: SongItem[]) => {
    const totalSongs = songList.length;
    const totalPagesCount = Math.ceil(totalSongs / itemsPerPage);
    setTotalPages(totalPagesCount);

    // Đảm bảo page không vượt quá tổng số trang
    const currentPage = page > totalPagesCount ? 1 : page;
    if (currentPage !== page) {
      setPage(currentPage);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const songsForCurrentPage = songList.slice(startIndex, endIndex);
    setDisplayedSongs(songsForCurrentPage);
  };

  useEffect(() => {
    updatePagination(allSongs);
  }, [page, itemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAllSong(); // Không truyền page nữa, lấy toàn bộ
        setAllSongs(data);
        updatePagination(data);
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

    const fetchReviewByUser = async () => {
      const userid = localStorage.getItem("userid");
      const data = await getReviewForUser(userid);
      setReviewUser(data);
    };

    fetchReviewByUser();
    fetchTypeData();
    fetchArtistData();
    fetchData();
  }, []);

  useEffect(() => {
    const fetchListSong = async () => {
      const data = await GetListSong();
      console.log(data);
      setListSong(data);
    };
    fetchListSong();
  }, []);

  useEffect(() => {
    const fetchReviewBySong = async (songId: any) => {
      if (selectedSong) {
        const data = await getReviewBySong(songId);
        setReview(data);
      }
    };
    fetchReviewBySong(selectedSong?.SongData.ID);
  }, [selectedSong, submitting]);

  // Hàm kiểm tra xem user hiện tại có phải là chủ sở hữu của review không
  const isUserOwnerOfReview = (reviewId: any) => {
    return reviewUser.some((userReview: any) => userReview.Id === reviewId);
  };

  const handleDeleteReview = async (Id: any) => {
    const data = await deleteReview(Id);
    const fetchReviewBySong = async (songId: any) => {
      if (selectedSong) {
        const data = await getReviewBySong(songId);
        setReview(data);
      }
    };
    fetchReviewBySong(selectedSong?.SongData.ID);
  };

  const searchSongs = async (keyword: any) => {
    if (!keyword.trim()) {
      // Nếu không có từ khóa, hiển thị lại toàn bộ danh sách
      setPage(1);
      updatePagination(allSongs);
      return;
    }
    setLoading(true);
    try {
      const data = await SearchSong(keyword);
      setAllSongs(data);
      setPage(1);
      updatePagination(data);
    } catch (err) {
      console.error("Tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await FilterSong(artistId, typeId);
        setAllSongs(data);
        setPage(1); // Reset về trang 1 khi lọc
        updatePagination(data);
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
          const data = await GetAllSong(); // Không truyền page
          setAllSongs(data);
          updatePagination(data);
        } catch (error) {
          console.error("Lỗi khi tải tất cả dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }
  }, [artistId, typeId, likeChange]);

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
    if (!isLogin) {
      setLoginDialogOpen(true);
      return;
    }
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
    } catch (error) {
      alert("❌ Gửi bình luận thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaySongList = (Song: any[]) => {
    const songList = Song.map((s) => ({
      Id: s.SongData.ID,
      name: s.SongData.NameSong,
      artist: "",
      url: s.SongData.SongResource,
    }));
    setListToPlay(songList);
  };

  // Xử lý phân trang
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const reloadAfterLike = (song: any) => {
    console.log(song);
    setLikeChange(likeChange + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
          🎧 Discover Amazing Music
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handlePlaySongList(listSong)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 active:scale-95"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            Phát tất cả
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm bài hát hoặc nghệ sĩ..."
            className="w-full p-4 bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              searchSongs(e.target.value);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl -z-10"></div>
        </div>

        {/* Bộ lọc */}
        <div className="mb-8 bg-black/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">🎵 Bộ lọc</h2>
            <button
              className="text-purple-400 hover:text-pink-400 transition-colors duration-300 text-sm font-medium"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label={expanded ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}
            >
              {expanded ? "Thu gọn ▲" : "Mở rộng ▼"}
            </button>
          </div>

          {/* Phần filter chỉ hiện khi expanded = true */}
          {expanded && (
            <div className="mt-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-4 w-full">
                <div className="flex flex-wrap gap-3">
                  <h3 className="text-purple-300 font-medium mb-2 w-full">
                    Nghệ sĩ:
                  </h3>
                  {allArtists.map((artist: any) => (
                    <button
                      key={artist.ID}
                      className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 hover:scale-105 ${
                        artistId.includes(artist.ID)
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg"
                          : "bg-black/20 text-gray-300 border-gray-600 hover:bg-purple-500/20 hover:border-purple-400"
                      }`}
                      onClick={() => handleArtistFilter(artist.ID)}
                    >
                      {artist.Name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <h3 className="text-cyan-300 font-medium mb-2 w-full">
                    Thể loại:
                  </h3>
                  {genres.map((genre: any) => (
                    <button
                      key={genre.id}
                      className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 hover:scale-105 ${
                        typeId.includes(genre.id)
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg"
                          : "bg-black/20 text-gray-300 border-gray-600 hover:bg-cyan-500/20 hover:border-cyan-400"
                      }`}
                      onClick={() => handleGenreFilter(genre.id)}
                    >
                      {genre.type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trạng thái loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent shadow-lg"></div>
            <p className="mt-4 text-purple-300 text-lg">Đang tải nhạc hay...</p>
          </div>
        )}

        {/* Danh sách bài hát */}
        <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading && displayedSongs && displayedSongs.length > 0
            ? displayedSongs.map((song) => (
                <SongCard
                  key={song.SongData.ID}
                  song={song}
                  onCommentClick={handleCommentClick}
                  onLikeClick={reloadAfterLike}
                />
              ))
            : !loading && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-gray-400 text-lg">
                    Không tìm thấy bài hát nào.
                  </p>
                </div>
              )}
        </div>

        {/* Phân trang */}
        {!loading && allSongs.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center">
            <div className="flex space-x-2 items-center bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-purple-500/20">
              {/* Nút Previous */}
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  page === 1
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-500 hover:scale-105 shadow-lg"
                } border border-purple-500/30`}
              >
                <ChevronLeft size={16} />
                <span className="ml-1">Trước</span>
              </button>

              {/* Các nút số trang */}
              <div className="flex space-x-2">
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      page === pageNumber
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg"
                        : "bg-black/20 text-gray-300 border-gray-600 hover:bg-purple-500/20 hover:border-purple-400"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* Nút Next */}
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  page === totalPages
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-500 hover:scale-105 shadow-lg"
                } border border-purple-500/30`}
              >
                <span className="mr-1">Tiếp</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Hiển thị thông tin trang hiện tại */}
        {!loading && allSongs.length > 0 && totalPages > 1 && (
          <div className="text-center mt-4 text-purple-300">
            Trang {page} / {totalPages} - Hiển thị {displayedSongs.length} /{" "}
            {allSongs.length} bài hát
          </div>
        )}

        {/* 💬 Khung bình luận bên phải */}
        {selectedSong && isLogin && (
          <div className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-gradient-to-b from-gray-900 to-purple-900 border-l border-purple-500/30 shadow-2xl z-50 p-6 overflow-y-auto backdrop-blur-md">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  💬 Bình luận về:{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedSong.SongData.NameSong}
                  </span>
                </h2>
                <button
                  onClick={closeCommentPanel}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Danh sách bình luận */}
              <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
                {/* Mỗi comment */}
                {review.length > 0 ? (
                  review.map((item: any) => (
                    <div key={item.Id} className="flex gap-3 items-start group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">
                        {item.UserName[0]}
                      </div>
                      <div className="flex-1 bg-black/30 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-purple-500/20 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-purple-300">
                            {item.UserName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-200">{item.Content}</p>

                        {/* Chỉ hiển thị nút xóa nếu user hiện tại là chủ sở hữu của bình luận */}
                        {isUserOwnerOfReview(item.Id) && (
                          <button
                            onClick={() => handleDeleteReview(item.Id)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎤</div>
                    <p className="text-gray-400">
                      Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </p>
                  </div>
                )}
              </div>

              {/* Nhập bình luận */}
              <div className="border-t border-purple-500/20 pt-6">
                <textarea
                  className="w-full p-4 bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none shadow-lg"
                  placeholder="Chia sẻ cảm nhận của bạn về bài hát này..."
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  disabled={submitting}
                  onClick={handleSubmitComment}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 w-full disabled:opacity-50 hover:scale-105 shadow-lg"
                >
                  🚀 {submitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoginRequiredDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </div>
  );
};

export default SongListPage;
