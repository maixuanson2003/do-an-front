"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getListCountry } from "@/api/ApiCountry";
import { getListType } from "@/api/ApiSongType";
import { getListArtist } from "@/api/ApiArtist";
import { getAlbumById, updateAlbum } from "@/api/ApiAlbum";
import { DownLoad } from "@/api/ApiSong";

/* --------------------------------------------------------- */

export default function UpdateAlbumForm() {
  const router = useRouter();
  const albumId = useSearchParams().get("id");

  /* ---------- STATE ---------- */
  const [albumData, setAlbumData] = useState<any>(null);
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDay, setReleaseDay] = useState("");
  const [artistOwner, setArtistOwner] = useState("");
  const [albumArtists, setAlbumArtists] = useState<number[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [originalSongs, setOriginalSongs] = useState<any[]>([]);

  const [artistOptions, setArtistOptions] = useState<any[]>([]);
  const [songTypeOptions, setSongTypeOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  /* 👉 file gửi lên + preview ảnh */
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  /* ---------- LOAD OPTIONS (nghệ sĩ, thể loại, quốc gia) ---------- */
  useEffect(() => {
    (async () => {
      const [artists, types, countries] = await Promise.all([
        getListArtist(),
        getListType(),
        getListCountry(),
      ]);
      setArtistOptions(artists);
      setSongTypeOptions(types);
      setCountryOptions(countries);
    })();
  }, []);

  /* ---------- LOAD ALBUM ---------- */
  useEffect(() => {
    if (!albumId) return;
    (async () => {
      try {
        const data = await getAlbumById(albumId);
        setAlbumData(data);

        /* --- thông tin cơ bản --- */
        setAlbumName(data.NameAlbum || "");
        setDescription(data.Description || "");
        setReleaseDay(data.ReleaseDay?.split("T")[0] || "");
        setArtistOwner(data.ArtistOwner || "");
        setAlbumArtists((data.Artist || []).map((a: any) => a.ID));
        /* --- load ảnh bìa thành File & preview --- */
        if (data.Image) {
          try {
            const blob = await DownLoad(data.Image);
            const filename = data.Image.split("/").pop() || "album.jpg";
            const fileType = blob.type || "image/jpeg";
            const fileImg = new File([blob], filename, { type: fileType });
            setAlbumImage(fileImg); // file để submit
            setImagePreviewUrl(URL.createObjectURL(blob)); // ảnh hiển thị
          } catch {
            /* ignore lỗi tải ảnh */
          }
        }

        /* --- danh sách bài hát --- */
        const processedSongs = await Promise.all(
          (data.Song || []).map(async (song: any) => {
            let file = null;
            if (song.SongResource) {
              try {
                const blob = await DownLoad(song.SongResource);
                const fname = song.SongResource.split("/").pop() || "song.mp3";
                const ftype = blob.type || "audio/mpeg";
                file = new File([blob], fname, { type: ftype });
              } catch {
                /* ignore */
              }
            }
            return {
              ...song,
              ReleaseDay: song.ReleaseDay?.split("T")[0] || "",
              file,
              Artist: Array.isArray(song.Artist)
                ? song.Artist.map((a: any) => a.ID)
                : [],
              SongType: Array.isArray(song.SongType)
                ? song.SongType.map((t: any) => t.Id)
                : [],
            };
          })
        );

        setSongs(processedSongs);
        setOriginalSongs(processedSongs.map((s) => ({ ...s, file: null })));
      } catch {
        /* ignore */
      }
    })();
  }, [albumId]);

  /* ---------- HANDLERS ---------- */
  const handleAlbumFilterChange = (e: any) => {
    const v = e.target.value;
    setArtistOwner(v);
    setSuggestions(
      v
        ? artistOptions.filter((a) =>
            a.Name.toLowerCase().includes(v.toLowerCase())
          )
        : []
    );
  };
  const handleSelectSuggestion = (artist: any) => {
    setArtistOwner(artist.Name);
    setSuggestions([]);
  };

  const handleSongChange = (idx: number, e: any) => {
    const updated = [...songs];
    updated[idx][e.target.name] = e.target.value;
    setSongs(updated);
  };
  const handleStatusChange = (idx: number, val: string) => {
    const updated = [...songs];
    updated[idx].Status = val;
    setSongs(updated);
  };
  const handleCheckboxChange = (
    idx: number,
    key: "Artist" | "SongType",
    id: number
  ) => {
    const updated = [...songs];
    const list: number[] = updated[idx][key] || [];
    updated[idx][key] = list.includes(id)
      ? list.filter((i) => i !== id)
      : [...list, id];
    setSongs(updated);
  };
  const handleCountryChange = (idx: number, id: number) => {
    const updated = [...songs];
    updated[idx].CountryId = id;
    setSongs(updated);
  };
  const handleFileChange = (idx: number, e: any) => {
    const updated = [...songs];
    updated[idx].file = e.target.files?.[0] || null;
    setSongs(updated);
  };
  const handleAddSong = () => {
    setSongs([
      ...songs,
      {
        NameSong: "",
        Description: "",
        ReleaseDay: "",
        Point: "",
        Status: "",
        CountryId: "",
        Artist: [],
        SongType: [],
        file: null,
      },
    ]);
  };
  const handleRemoveSong = (idx: number) => {
    const updated = [...songs];
    updated.splice(idx, 1);
    setSongs(updated);
  };

  /* --- ảnh bìa thay đổi --- */
  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlbumImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      /* --- cập nhật album --- */
      const formUpdate = new FormData();
      formUpdate.append(
        "albumrequest",
        JSON.stringify({
          NameAlbum: albumName,
          Description: description,
          ReleaseDay: new Date(releaseDay).toISOString(),
          ArtistOwner: artistOwner,
          Artist: albumArtists,
        })
      );
      if (albumImage) formUpdate.append("image", albumImage);
      await updateAlbum(albumId, formUpdate);

      /* --- cập nhật bài hát --- */
      const formSongs = new FormData();
      formSongs.append(
        "songs",
        JSON.stringify(
          songs.map((s) => ({
            ID: s.ID,
            NameSong: s.NameSong,
            Description: s.Description,
            ReleaseDay: new Date(s.ReleaseDay).toISOString(),
            Point: Number(s.Point),
            Status: s.Status,
            CountryId: s.CountryId,
            Artist: s.Artist,
            SongType: s.SongType,
          }))
        )
      );
      songs.forEach((s) => {
        if (s.file) formSongs.append("file", s.file);
      });
      await fetch(
        `http://localhost:8080/api/update/song/album?albumid=${albumId}`,
        { method: "POST", body: formSongs }
      );

      alert("Cập nhật album thành công!");
      router.push("/album");
    } catch {
      alert("Cập nhật album thất bại!");
    }
  };

  /* ---------- RENDER ---------- */
  if (!albumId) return <p>Không tìm thấy albumId trong URL</p>;
  if (!albumData) return <p>Đang tải dữ liệu album...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ---------- thông tin album ---------- */}
      <div>
        <Label>Tên Album</Label>
        <Input
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Mô tả</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label>Ngày phát hành</Label>
        <Input
          type="date"
          value={releaseDay}
          onChange={(e) => setReleaseDay(e.target.value)}
        />
      </div>

      <div>
        <Label>Ảnh bìa album</Label>
        <input type="file" accept="image/*" onChange={handleAlbumImageChange} />
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Ảnh bìa album"
            className="mt-2 w-40 h-40 object-cover rounded-lg shadow"
          />
        )}
      </div>

      {/* ---------- nghệ sĩ sở hữu ---------- */}
      <div className="relative">
        <Label>Nghệ sĩ sở hữu</Label>
        <input
          value={artistOwner}
          onChange={handleAlbumFilterChange}
          className="w-full rounded border px-3 py-2 text-sm outline-none"
          placeholder="Nhập tên nghệ sĩ…"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full rounded border bg-white shadow">
            {suggestions.map((a: any) => (
              <li
                key={a.ID}
                onClick={() => handleSelectSuggestion(a)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              >
                {a.Name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <Label>Nghệ sĩ tham gia trong album</Label>
        <ScrollArea className="h-40 rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2">
            {artistOptions.map((a: any) => (
              <label key={a.ID} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={albumArtists.includes(a.ID)}
                  onChange={(e) =>
                    setAlbumArtists((prev) =>
                      e.target.checked
                        ? [...prev, a.ID]
                        : prev.filter((id) => id !== a.ID)
                    )
                  }
                />
                {a.Name}
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ---------- danh sách bài hát ---------- */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Danh sách bài hát</Label>

        {songs.map((song, idx) => (
          <div key={idx} className="space-y-3 rounded border p-4">
            <Label>Bài hát {idx + 1}</Label>

            <Input
              name="NameSong"
              value={song.NameSong}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Tên bài hát"
              required
            />
            <Textarea
              name="Description"
              value={song.Description}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Mô tả"
            />
            <Input
              type="date"
              name="ReleaseDay"
              value={song.ReleaseDay}
              onChange={(e) => handleSongChange(idx, e)}
            />
            <Input
              type="number"
              name="Point"
              value={song.Point}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Điểm"
            />

            {/* trạng thái */}
            <div>
              <Label>Trạng thái</Label>
              <Select
                value={song.Status}
                onValueChange={(val) => handleStatusChange(idx, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Công khai</SelectItem>
                  <SelectItem value="private">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* quốc gia */}
            <div>
              <Label>Quốc gia</Label>
              <Select
                value={String(song.CountryId || "")}
                onValueChange={(val) => handleCountryChange(idx, +val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((c) => (
                    <SelectItem key={c.Id} value={String(c.Id)}>
                      {c.CountryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* nghệ sĩ */}
            <div>
              <Label>Nghệ sĩ</Label>
              <ScrollArea className="h-80 border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {artistOptions.map((a) => (
                    <label
                      key={a.ID}
                      className="flex items-center gap-2 rounded border p-2"
                    >
                      <input
                        type="checkbox"
                        checked={song.Artist.includes(a.ID)}
                        onChange={() =>
                          handleCheckboxChange(idx, "Artist", a.ID)
                        }
                      />
                      {a.Name}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* thể loại */}
            <div>
              <Label>Thể loại</Label>
              <ScrollArea className="h-80 border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {songTypeOptions.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 rounded border p-2"
                    >
                      <input
                        type="checkbox"
                        checked={song.SongType.includes(t.id)}
                        onChange={() =>
                          handleCheckboxChange(idx, "SongType", t.id)
                        }
                      />
                      {t.type}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* file nhạc */}
            <div>
              <Label>File nhạc</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(idx, e)}
              />
              {song.file && (
                <p className="text-sm text-gray-600">
                  Đã chọn: {song.file.name}
                </p>
              )}
            </div>
            {!song.ID && (
              <Button
                variant="destructive"
                type="button"
                onClick={() => handleRemoveSong(idx)}
              >
                Xóa bài hát
              </Button>
            )}
          </div>
        ))}

        <Button type="button" onClick={handleAddSong}>
          Thêm bài hát
        </Button>
      </div>

      <Button type="submit" className="mt-4">
        Cập nhật Album
      </Button>
    </form>
  );
}
