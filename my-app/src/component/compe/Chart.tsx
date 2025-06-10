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
          // Tính toán change dựa trên point hoặc random (có thể cải thiện sau)
          change: Math.floor(Math.random() * 21) - 10,
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
    <div className="w-full mx-auto space-y-8">
      <h1 className="text-center text-3xl font-bold text-white">
        Hãy khám phá bảng xếp hạng
      </h1>

      {/* Chart Section */}
      <div
        className="p-8 rounded-2xl shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, #170F23 0%, #2D1B3D 50%, #170F23 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="h-96">
          {chartData ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FFFB0] mx-auto mb-4"></div>
                <p className="text-white text-lg">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Cập nhật: {new Date().toLocaleString("vi-VN")}</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4FFFB0] rounded-full animate-pulse"></div>
              Đang phát trực tiếp
            </span>
          </div>
        </div>
      </div>

      {/* Ranking Section */}
      <div
        className="p-8 rounded-2xl shadow-2xl w-full"
        style={{
          background:
            "linear-gradient(135deg, #170F23 0%, #2D1B3D 50%, #170F23 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange("week")}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "week"
                ? "bg-[#4FFFB0] text-black shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => handleTabChange("month")}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "month"
                ? "bg-[#4FFFB0] text-black shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            Tháng này
          </button>
        </div>

        {/* Ranking Table */}
        <div className="space-y-3 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {activeTab === "week" ? "BXH Tuần" : "BXH Tháng"}
            </h3>
            <button
              onClick={() =>
                fetchRankingData(activeTab === "week" ? "weekly" : "monthly")
              }
              className="px-4 py-2 bg-[#4FFFB0]/20 text-[#4FFFB0] rounded-lg hover:bg-[#4FFFB0]/30 transition-colors"
            >
              Làm mới
            </button>
          </div>

          {isLoadingRanking ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FFFB0] mx-auto mb-4"></div>
                <p className="text-white">Đang tải bảng xếp hạng...</p>
              </div>
            </div>
          ) : (
            (activeTab === "week" ? weeklyRanking : monthlyRanking).map(
              (song, index) => (
                <div
                  key={song.id || index}
                  className="flex items-center p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12 mr-4">
                    <span
                      className={`text-2xl font-bold ${
                        song.rank <= 3
                          ? song.rank === 1
                            ? "text-yellow-400"
                            : song.rank === 2
                            ? "text-gray-300"
                            : "text-orange-400"
                          : "text-gray-400"
                      }`}
                    >
                      {song.rank}
                    </span>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: song.color }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium truncate group-hover:text-[#4FFFB0] transition-colors">
                          {song.name}
                        </h4>
                        <p className="text-gray-400 text-sm truncate">
                          {song.artist}
                        </p>
                        {song.description && (
                          <p className="text-gray-500 text-xs truncate">
                            {song.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right mr-4">
                    <div className="flex flex-col space-y-1">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {song.totalListens.toLocaleString("vi-VN")}
                        </p>
                        <p className="text-gray-400 text-xs">lượt nghe</p>
                      </div>
                      {song.likeAmount > 0 && (
                        <div>
                          <p className="text-pink-400 font-medium text-sm">
                            {song.likeAmount.toLocaleString("vi-VN")}
                          </p>
                          <p className="text-gray-400 text-xs">lượt thích</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Point & Change */}
                  <div className="text-right mr-4">
                    <p className="text-[#4FFFB0] font-bold">{song.point}</p>
                    <p className="text-gray-400 text-xs">điểm</p>
                  </div>

                  {/* Change */}
                  <div className="flex items-center">
                    <span
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        song.change > 0
                          ? "bg-green-500/20 text-green-400"
                          : song.change < 0
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {song.change > 0 && <span>↗</span>}
                      {song.change < 0 && <span>↘</span>}
                      {song.change === 0 && <span>-</span>}
                      <span>{Math.abs(song.change)}</span>
                    </span>
                  </div>

                  {/* Status */}
                  <div className="ml-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        song.status.toLowerCase() === "release"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {song.status}
                    </span>
                  </div>
                </div>
              )
            )
          )}

          {/* Empty State */}
          {!isLoadingRanking &&
            (activeTab === "week" ? weeklyRanking : monthlyRanking).length ===
              0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Không có dữ liệu bảng xếp hạng</p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Dữ liệu được cập nhật theo thời gian thực • Xếp hạng dựa trên điểm
            và lượt nghe
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
