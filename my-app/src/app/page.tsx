import Sidebar from "@/component/HomPage/SideBar";
import MainPage from "@/component/HomPage/MainPage";
import SongTable from "@/component/HomPage/SongTable";
import ArtistList from "@/component/HomPage/ArtistList";
import SongRecommend from "@/component/HomPage/SongRecommend";
export default function Home() {
  return (
    <div className="w-full bg-gradient-to-br from-black to-zinc-900">
      <MainPage />
      <SongRecommend />
      <SongTable />
      <ArtistList />
    </div>
  );
}
