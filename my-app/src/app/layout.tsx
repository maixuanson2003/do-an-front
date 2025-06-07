"use client";
import MusicPlayerBar from "@/component/music/MusicPlayerBar";
import Header from "@/component/header/Header";
import Footer from "@/component/footer/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/component/HomPage/SideBar";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";
import { AudioPlayerProvider } from "@/component/music/AudioPlayerContext";
import AudioPlayer from "@/component/music/AudioPlayer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
function LoginAndRegister(children: any) {
  return <div>{children}</div>;
}
function MainPage(children: any) {
  return (
    <>
      <AudioPlayerProvider>
        <Header />
        <div className="w-full flex">
          <div className="w-[15%]">
            <Sidebar />
          </div>
          <div className="w-[85%]">{children}</div>
        </div>
        <AudioPlayer />
        <Footer />
      </AudioPlayerProvider>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname != "/login" &&
        pathname != "/register" &&
        pathname != "/forgotpassword"
          ? MainPage(children)
          : LoginAndRegister(children)}
      </body>
    </html>
  );
}
