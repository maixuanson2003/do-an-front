import ArtistCard from "./ArtistCard";
const artists = [
  {
    name: "Sơn Tùng M-TP",
    genre: "Pop",
    image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
  },
  {
    name: "Noo Phước Thịnh",
    genre: "Pop",
    image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
  },
  {
    name: "Đen Vâu",
    genre: "Rap",
    image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
  },
  {
    name: "Mỹ Tâm",
    genre: "Pop",
    image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpgg",
  },
  {
    name: "Minh Hằng",
    genre: "Pop",
    image: "https://i.ytimg.com/vi/0fHsaJMmjDc/maxresdefault.jpg",
  },
  // Thêm ảnh cho các ca sĩ ở đây
];

const ArtistList = () => {
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold  mb-8">Nghệ sĩ nổi bật</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist, index) => (
          <ArtistCard key={index} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default ArtistList;
