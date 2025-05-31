"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Headphones, Radio, Mic, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Thư Viện Nhạc Đa Dạng",
    description:
      "Khám phá hàng triệu bài hát từ mọi thể loại âm nhạc trên thế giới",
    icon: <Music className="w-8 h-8" />,
    color: "from-pink-500 to-rose-400",
    src: "/song",
  },
  {
    title: "Tuyển tập âm nhạc chất lượng",
    description: "Trải nghiệm âm thanh chất lượng cao với nhiều chủ đề",
    icon: <Headphones className="w-8 h-8" />,
    color: "from-purple-500 to-indigo-500",
    src: "/collection",
  },
  {
    title: "Tìm kiếm các nghệ sĩ",
    description: "Tìm kiếm các nghệ sĩ",
    icon: <Radio className="w-8 h-8" />,
    color: "from-blue-400 to-cyan-500",
    src: "/artist",
  },
  {
    title: "Tạo playList cho riêng mình",
    description: "Tạo playList cho riêng mình",
    icon: <Mic className="w-8 h-8" />,
    color: "from-emerald-400 to-teal-500",
    src: "",
  },
];

export default function MainPage() {
  const route = useRouter();
  return (
    <div className="p-6 w-full space-y-12 text-white">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Âm Nhạc Không Giới Hạn
        </h1>
        <p className="text-xl text-zinc-100 max-w-2xl mx-auto mb-8">
          Nền tảng âm nhạc hàng đầu Việt Nam với kho nhạc phong phú và trải
          nghiệm nghe nhạc tuyệt vời
        </p>
        <Button className="bg-white text-purple-600 hover:bg-zinc-100 font-semibold text-lg px-6 py-6 h-auto rounded-full">
          Khám Phá Ngay
        </Button>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Tính Năng Nổi Bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl transition-all bg-gradient-to-br ${feature.color} text-white h-full`}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 bg-white/20 p-3 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-zinc-100 mb-4 flex-grow">
                  {feature.description}
                </p>
                {feature.src != "" && (
                  <Button
                    onClick={() => {
                      route.push(feature.src);
                    }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-full mt-auto"
                  >
                    Tìm hiểu thêm <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-cyan-500 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Sẵn Sàng Trải Nghiệm?</h2>
        <p className="mb-6 text-lg">
          Đăng ký ngay hôm nay để trải nghiệm âm nhạc không giới hạn
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={() => {
              route.push("/register");
            }}
            className="bg-white text-blue-600 hover:bg-zinc-100 font-semibold px-6"
          >
            Đăng Ký Miễn Phí
          </Button>
        </div>
      </div>
    </div>
  );
}
