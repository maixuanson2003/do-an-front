"use client";

import { Search, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  addNewPlayList,
  getPlayListByUserId,
  deletePlaylist,
} from "@/api/ApiPlaylist";
import { useAuthStore } from "@/store/useAuthStore";
import LoginRequiredDialog from "../toast/LoginToast";

const username = "Maixuanson";

export default function Sidebar() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playListData, setPlayListData] = useState<any[]>([]);
  const [update, setUpdate] = useState(1);
  const isLogin = useAuthStore((state) => state.isLogin);

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

  const handleShowModal = () => {
    if (isLogin) {
      setShowModal(true);
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handleDeletePlaylist = async (playlistId: string | number) => {
    try {
      await deletePlaylist(playlistId);
      setUpdate((prev) => prev + 1);
    } catch (error) {
      console.error("Lỗi khi xoá playlist:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userid");
      if (isLogin && userId) {
        try {
          const data = await getPlayListByUserId(userId);
          if (data && Array.isArray(data)) {
            setPlayListData(data);
          } else {
            setPlayListData([]);
          }
        } catch (error) {
          console.error("Lỗi fetch playlist:", error);
        }
      }
    };
    fetchData();
  }, [isLogin, update]);

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
          <Plus
            onClick={handleShowModal}
            className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white"
          />

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
        {playListData.length === 0 ? (
          <p className="text-gray-400 italic text-sm">
            Bạn chưa có playlist nào. Hãy tạo một playlist mới!
          </p>
        ) : (
          playListData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              <div
                onClick={() => {
                  router.push(`/playlist?playlistid=${item.ID}`);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
                  🎵
                </div>
                <div>
                  <p className="text-white text-sm">{item.Name}</p>
                  <p className="text-gray-400 text-xs">{username}</p>
                </div>
              </div>

              <Trash
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => handleDeletePlaylist(item.ID)}
              />
            </div>
          ))
        )}
      </div>

      <LoginRequiredDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </aside>
  );
}
