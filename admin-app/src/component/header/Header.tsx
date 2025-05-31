"use client";

import { useRouter } from "next/navigation";
import { LogIn, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedUserId = localStorage.getItem("userid");
    setUserId(storedUserId);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    setUserId(null);
    router.refresh();
  };

  if (!hasMounted) return null;

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">🎛️ Trang quản lý</h1>

      <div className="flex items-center gap-3">
        <>
          <UserCircle className="text-blue-600" size={24} />
        </>
      </div>
    </header>
  );
};

export default Header;
