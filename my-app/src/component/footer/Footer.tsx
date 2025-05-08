import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center p-6 bg-[#121212] text-gray-400 text-sm">
      <div className="flex gap-6 mb-4">
        <Button variant="ghost" className="text-gray-400 hover:text-black">
          Chính sách
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-black">
          Liên hệ
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-black">
          Điều khoản sử dụng
        </Button>
      </div>
      <div className="text-xs">© 2025 MyMusic. All rights reserved.</div>
    </footer>
  );
}
