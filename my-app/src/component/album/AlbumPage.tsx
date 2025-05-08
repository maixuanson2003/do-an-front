import AlbumDetailPage from "./AlbumDetail";
interface SongResponse {
  id: number;
  title: string;
  duration: string;
}

interface ArtistResponse {
  id: number;
  name: string;
}

interface AlbumResponse {
  id: number;
  nameAlbum: string;
  description: string;
  releaseDay: string;
  artistOwner: string;
  createDay: string;
  updateDay: string;
  song: SongResponse[];
  artist: ArtistResponse[];
}
const mockAlbum: AlbumResponse = {
  id: 1,
  nameAlbum: "Tình Ca Mùa Đông",
  description: "Album tập hợp những bản tình ca mùa đông lãng mạn và sâu lắng.",
  releaseDay: "2024-12-15",
  artistOwner: "Minh Hằng",
  createDay: "2024-12-01",
  updateDay: "2024-12-10",
  artist: [
    { id: 1, name: "Minh Hằng" },
    { id: 2, name: "Noo Phước Thịnh" },
    { id: 3, name: "Bích Phương" },
  ],
  song: [
    { id: 101, title: "Mùa Đông Yêu Thương", duration: "03:45" },
    { id: 102, title: "Giấc Mơ Tuyết Trắng", duration: "04:15" },
    { id: 103, title: "Lặng Thầm Một Tình Yêu", duration: "03:30" },
  ],
};
export default function AlbumPage() {
  return <AlbumDetailPage />;
}
