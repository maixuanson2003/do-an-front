"use client";

import React, { useState } from "react";
import { Music, Send, Play, Headphones, Volume2, Star } from "lucide-react";
import { useAudioPlayer } from "@/component/music/AudioPlayerContext";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      content:
        "👋 Xin chào! Tôi là trợ lý âm nhạc AI. Hãy hỏi tôi gợi ý về âm nhạc bạn muốn nghe hôm nay nhé!",
    },
  ]);
  const [showPlayAll, setShowPlayAll] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { playSong, setListToPlay } = useAudioPlayer();

  const handlePlaySongList = (Song: any[]) => {
    let songList = Song.map((s) => ({
      Id: s.ID,
      name: s.NameSong,
      artist: "",
      url: s.SongResource,
    }));
    setListToPlay(songList);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");

    try {
      const res = await fetch(
        "http://localhost:8080/api/chatbot/song?message=" +
          encodeURIComponent(currentInput),
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSongs(data);
        setShowPlayAll(true);
        setMessages((prev) => [...prev, { role: "bot", content: data }]);
      } else {
        setSongs([]);
        setShowPlayAll(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "😔 Xin lỗi, mình không tìm thấy bài hát nào phù hợp với yêu cầu của bạn. Hãy thử một từ khóa khác nhé!",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Trợ lý âm nhạc AI
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Khám phá thế giới âm nhạc với AI thông minh
          </p>
        </div>

        {/* Chat Messages */}
        <div className="w-full max-w-4xl space-y-6 mb-8 max-h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl backdrop-blur-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white"
                    : "bg-black/20 border border-gray-600/30 text-gray-100"
                }`}
              >
                {msg.role === "bot" && Array.isArray(msg.content) ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Headphones className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-medium">
                        Tìm thấy {msg.content.length} bài hát cho bạn
                      </span>
                    </div>
                    {msg.content.map((song: any) => (
                      <div
                        key={song.ID}
                        className="bg-black/30 backdrop-blur-sm p-5 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {song.NameSong}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {song.Description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">
                              {song.Point}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              <span>
                                {formatNumber(song.ListenAmout)} lượt nghe
                              </span>
                            </div>
                          </div>
                          <div className="text-purple-400">ID: {song.ID}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-100">
                    {msg.content}
                  </pre>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/20 backdrop-blur-sm border border-gray-600/30 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent"></div>
                  <span className="text-gray-300">AI đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Play All */}
        {showPlayAll && songs.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => {
                handlePlaySongList(songs);
              }}
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Play className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-medium">Phát nhạc ngay</span>
            </button>
          </div>
        )}

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div className="bg-black/20 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-2 shadow-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isLoading && handleSend()
                }
                placeholder="Hỏi gì đó về âm nhạc... (ví dụ: Gợi ý nhạc để thư giãn)"
                className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed group"
              >
                <Send className="w-5 h-5 group-hover:animate-pulse" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {["Nhạc thư giãn", "Nhạc sôi động", "Nhạc buồn", "Nhạc happy"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-gray-600/30 hover:border-purple-500/50 text-gray-300 hover:text-white rounded-full text-sm transition-all duration-300"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
