"use client";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addNewPlayList, getPlayListByUserId } from "@/api/ApiPlaylist";
import { useAuthStore } from "@/store/useAuthStore";

const username = "Maixuanson";

export default function Sidebar() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playListData, setPlayListData] = useState<any[]>([]);
  const [update, setUpdate] = useState(1);
  const isLogin = useAuthStore((state) => state.isLogin);

  const playlists = [
    {
      ID: 1,
      Name: "Nhạc Việt Nam Hay Nhất",
      CreateDay: new Date("2025-01-15T08:30:00Z"),
    },
    {
      ID: 2,
      Name: "Playlist Tập Thể Dục",
      CreateDay: new Date("2025-02-10T14:45:00Z"),
    },
    {
      ID: 3,
      Name: "Nhạc Thư Giãn Buổi Tối",
      CreateDay: new Date("2025-03-05T20:15:00Z"),
    },
    {
      ID: 4,
      Name: "Top Hits 2025",
      CreateDay: new Date("2025-03-30T12:00:00Z"),
    },
    {
      ID: 5,
      Name: "Nhạc Làm Việc Tập Trung",
      CreateDay: new Date("2025-04-01T09:00:00Z"),
    },
    {
      ID: 6,
      Name: "Nhạc Trữ Tình Bolero",
      CreateDay: new Date("2025-03-18T10:20:00Z"),
    },
    {
      ID: 7,
      Name: "EDM Party Mix",
      CreateDay: new Date("2025-02-28T22:00:00Z"),
    },
    {
      ID: 8,
      Name: "Acoustic Coffee",
      CreateDay: new Date("2025-04-03T16:30:00Z"),
    },
  ];

  const isShow = () => {
    if (isLogin && playListData.length > 0) {
      return playListData;
    }
    return playlists;
  };

  const handleCreatePlaylist = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) {
      console.error("Chưa có user id trong localStorage");
      return;
    }
    if (newPlaylistName.trim() !== "") {
      try {
        await addNewPlayList(newPlaylistName, userId);
        setNewPlaylistName("");
        setUpdate((prev) => prev + 1);
        setShowModal(false);
      } catch (error) {
        console.error("Lỗi khi tạo playlist:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userid");
      if (isLogin && userId) {
        try {
          const data = await getPlayListByUserId(userId);
          if (data && data.length > 0) {
            setPlayListData(data);
          } else {
            console.warn("Playlist trả về rỗng hoặc không hợp lệ");
          }
        } catch (error) {
          console.error("Lỗi fetch playlist:", error);
        }
      }
    };
    fetchData();
  }, [isLogin, update]); // chú ý thêm cả isLogin vào dependency

  return (
    <aside className="w-full h-full bg-black text-white p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">My Library</h2>

      <div className="flex gap-2 mb-4 items-center">
        <Button
          variant="ghost"
          className="bg-white text-black px-4 py-2 rounded-full"
        >
          Playlists
        </Button>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Plus
              onClick={() => setShowModal(true)}
              className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white"
            />
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Thêm Playlist Mới</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên playlist..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleCreatePlaylist}>Tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-4 text-gray-400">
        <Search className="w-5 h-5" />
        <span>Recents</span>
      </div>

      <div className="flex flex-col gap-2 overflow-auto">
        {isShow().map((item, index) => (
          <div
            onClick={() => {
              router.push(`/playlist?playlistid=${item.ID}`);
            }}
            key={index}
            className="flex items-center gap-2 p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
          >
            <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
              🎵
            </div>
            <div>
              <p className="text-white text-sm">{item.Name}</p>
              <p className="text-gray-400 text-xs">{username}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
