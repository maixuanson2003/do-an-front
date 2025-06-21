"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type LoginRequiredDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginRequiredDialog({
  open,
  onClose,
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login"); // Điều hướng đến trang login
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        </DialogHeader>
        <p>Bạn cần đăng nhập để sử dụng chức năng này.</p>
        <DialogFooter>
          <Button onClick={handleLogin}>Đăng nhập</Button>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
