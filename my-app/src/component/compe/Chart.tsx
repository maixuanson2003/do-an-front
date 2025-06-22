"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  } | null>(null);
  const [weeklyRanking, setWeeklyRanking] = useState<any[]>([]);
  const [monthlyRanking, setMonthlyRanking] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  // Fetch chart data (giữ nguyên code cũ)
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/song/week/chart"
        );
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          const labels = [
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
            "Chủ Nhật",
          ];

          const colors: any = [
            { border: "#4FFFB0", bg: "rgba(79, 255, 176, 0.1)" },
            { border: "#FF6B9D", bg: "rgba(255, 107, 157, 0.1)" },
            { border: "#FFE66D", bg: "rgba(255, 230, 109, 0.1)" },
            { border: "#A8E6CF", bg: "rgba(168, 230, 207, 0.1)" },
            { border: "#FF8B94", bg: "rgba(255, 139, 148, 0.1)" },
          ];

          const datasets = data.data.map((song: any, index: any) => ({
            label: song.name,
            data: song.listen_per_day,
            borderColor: colors[index % colors.length].border,
            backgroundColor: colors[index % colors.length].bg,
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: colors[index % colors.length].border,
            pointBorderColor: "#170F23",
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#170F23",
            pointHoverBorderColor: colors[index % colors.length].border,
            pointHoverBorderWidth: 3,
            fill: false,
            borderDash: [],
          }));

          setChartData({ labels, datasets });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chart:", error);
      }
    };

    fetchChartData();
  }, []);

  // Fetch ranking data từ API mới
  const fetchRankingData = async (range: string) => {
    setIsLoadingRanking(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/compe/song/top?range=${range}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const colors = ["#4FFFB0", "#FF6B9D", "#FFE66D", "#A8E6CF", "#FF8B94"];

        const rankingData = data.data.map((song: any, index: number) => ({
          rank: index + 1,
          id: song.ID,
          name: song.NameSong,
          artist: song.Artist || "Nghệ sĩ", // Có thể cần thêm field này từ API
          description: song.Description,
          totalListens: song.ListenAmout || 0,
          likeAmount: song.LikeAmount || 0,
          point: song.Point || 0,
          releaseDay: new Date(song.ReleaseDay).toLocaleDateString("vi-VN"),
          status: song.Status,
          color: colors[index % colors.length],
          songResource: song.SongResource,
        }));

        if (range === "week") {
          setWeeklyRanking(rankingData);
        } else {
          setMonthlyRanking(rankingData);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ranking:", error);
    } finally {
      setIsLoadingRanking(false);
    }
  };

  // Load ranking data khi component mount và khi tab thay đổi
  useEffect(() => {
    fetchRankingData("week");
    fetchRankingData("month");
  }, []);

  // Refresh data khi tab thay đổi
  const handleTabChange = (tab: "week" | "month") => {
    setActiveTab(tab);
    const range = tab === "week" ? "weekly" : "monthly";
    fetchRankingData(range);
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: { size: 12, family: "Inter" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "biểu đồ lượt nghe trong tuần",
        color: "#fff",
        font: { size: 20, weight: "bold", family: "Inter" },
        padding: { bottom: 30 },
      },
      tooltip: {
        backgroundColor: "rgba(23, 15, 35, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#4FFFB0",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${
              context.dataset.label
            }: ${context.parsed.y.toLocaleString()} lượt nghe`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#A0A0A0",
          font: { size: 11, family: "Inter" },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#A0A0A0",
          font: { size: 11, family: "Inter" },
          padding: 10,
          callback: function (value: any) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + "K";
            }
            return value;
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="w-full p-8 mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Hãy khám phá bảng xếp hạng
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Theo dõi xu hướng âm nhạc hot nhất hiện tại
          </p>
        </div>

        {/* Chart Section */}
        <div className="relative group w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="h-96 md:h-[500px]">
              {chartData ? (
                <Line data={chartData} options={options} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-cyan-400/30 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white text-xl font-medium">
                      Đang tải dữ liệu...
                    </p>
                    <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gradient-to-r from-transparent via-white/10 to-transparent">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Cập nhật: {new Date().toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">
                    Đang phát trực tiếp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-12 p-2 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/5">
              <button
                onClick={() => handleTabChange("week")}
                className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  activeTab === "week"
                    ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-black shadow-lg shadow-cyan-400/25 scale-105"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-102"
                }`}
              >
                🗓️ Tuần này
              </button>
              <button
                onClick={() => handleTabChange("month")}
                className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  activeTab === "month"
                    ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-black shadow-lg shadow-cyan-400/25 scale-105"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-102"
                }`}
              >
                📅 Tháng này
              </button>
            </div>

            {/* Ranking Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {activeTab === "week" ? "🏆 BXH Tuần" : "🏆 BXH Tháng"}
                </h3>
                <p className="text-gray-400">
                  {activeTab === "week"
                    ? "Top bài hát hot nhất tuần này"
                    : "Top bài hát được yêu thích nhất tháng"}
                </p>
              </div>
              <button
                onClick={() =>
                  fetchRankingData(activeTab === "week" ? "weekly" : "monthly")
                }
                className="px-6 py-3 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-cyan-400 rounded-xl hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-300 border border-cyan-400/30 backdrop-blur-sm font-medium"
              >
                🔄 Làm mới
              </button>
            </div>

            {/* Ranking Content */}
            <div className="space-y-4">
              {isLoadingRanking ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-400/30 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white text-lg font-medium">
                      Đang tải bảng xếp hạng...
                    </p>
                  </div>
                </div>
              ) : (
                (activeTab === "week" ? weeklyRanking : monthlyRanking).map(
                  (song, index) => (
                    <div key={song.id || index} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                      <div className="relative flex items-center p-6 rounded-2xl bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer transform group-hover:scale-[1.02]">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-16 h-16 mr-6 relative">
                          {song.rank <= 3 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full blur-md opacity-60"></div>
                          )}
                          <div
                            className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-2 ${
                              song.rank === 1
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black border-yellow-300 shadow-lg shadow-yellow-400/50"
                                : song.rank === 2
                                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black border-gray-200 shadow-lg shadow-gray-400/50"
                                : song.rank === 3
                                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white border-orange-300 shadow-lg shadow-orange-400/50"
                                : "bg-gray-700/50 text-gray-300 border-gray-600"
                            }`}
                          >
                            {song.rank}
                          </div>
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0 mr-6">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-1 h-16 rounded-full shadow-lg"
                              style={{
                                backgroundColor: song.color,
                                boxShadow: `0 0 20px ${song.color}40`,
                              }}
                            ></div>
                            <div className="flex-1 space-y-1">
                              <h4 className="text-white font-bold text-lg truncate group-hover:text-cyan-400 transition-colors duration-300">
                                {song.name}
                              </h4>
                              <p className="text-gray-400 text-base truncate font-medium">
                                👨‍🎤 {song.artist}
                              </p>
                              {song.description && (
                                <p className="text-gray-500 text-sm truncate">
                                  📝 {song.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                          {/* Listen Count */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-lg">🎧</span>
                              <p className="text-white font-bold text-lg">
                                {song.totalListens.toLocaleString("vi-VN")}
                              </p>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">
                              lượt nghe
                            </p>
                          </div>

                          {/* Like Count */}
                          {song.likeAmount > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center space-x-1">
                                <span className="text-lg">❤️</span>
                                <p className="text-pink-400 font-bold text-lg">
                                  {song.likeAmount.toLocaleString("vi-VN")}
                                </p>
                              </div>
                              <p className="text-gray-400 text-xs font-medium">
                                lượt thích
                              </p>
                            </div>
                          )}

                          {/* Points */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-lg">⭐</span>
                              <p className="text-cyan-400 font-bold text-lg">
                                {song.point}
                              </p>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">
                              điểm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}

              {/* Empty State */}
              {!isLoadingRanking &&
                (activeTab === "week" ? weeklyRanking : monthlyRanking)
                  .length === 0 && (
                  <div className="text-center py-20">
                    <div className="space-y-4">
                      <div className="text-6xl">🎵</div>
                      <p className="text-gray-400 text-xl">
                        Không có dữ liệu bảng xếp hạng
                      </p>
                      <p className="text-gray-500">Vui lòng thử lại sau</p>
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-white/10 to-transparent text-center">
              <div className="space-y-2">
                <p className="text-gray-400 font-medium">
                  ⚡ Dữ liệu được cập nhật theo thời gian thực
                </p>
                <p className="text-gray-500 text-sm">
                  📊 Xếp hạng dựa trên điểm số và lượt nghe • 🎯 Thuật toán
                  thông minh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
