"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { getListCountry } from "@/api/ApiCountry";
import { getListType } from "@/api/ApiSongType";
import { getListArtist } from "@/api/ApiArtist";
import { CreateAlbum } from "@/api/ApiAlbum";

/* ---------- TYPES ---------- */
interface SongMeta {
  NameSong: string;
  Description: string;
  ReleaseDay: string;
  Point: number;
  Status: string;
  CountryId: number;
  SongType: number[];
  Artist: number[];
}

/* ---------- COMPONENT ---------- */
export default function CreateAlbumForm() {
  const router = useRouter();

  /* Album fields --------------------------------------------------- */
  const [albumData, setAlbumData] = useState({
    nameAlbum: "",
    description: "",
    releaseDay: "",
    artistOwner: "",
    artist: [] as number[],
  });
  const [albumImage, setAlbumImage] = useState<File | null>(null);

  /* Lists for selects --------------------------------------------- */
  const [artistOptions, setArtistOptions] = useState<any[]>([]);
  const [songTypeOptions, setSongTypeOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  /* Songs & files -------------------------------------------------- */
  const emptySong: SongMeta = {
    NameSong: "",
    Description: "",
    ReleaseDay: "",
    Point: 0,
    Status: "",
    CountryId: 0,
    SongType: [],
    Artist: [],
  };
  const [songs, setSongs] = useState<SongMeta[]>([emptySong]);
  const [files, setFiles] = useState<(File | null)[]>([null]);

  /* ---------- EFFECT: fetch dropdown data ---------- */
  useEffect(() => {
    async function fetchData() {
      const [countryRes, typeRes, artistRes] = await Promise.all([
        getListCountry(),
        getListType(),
        getListArtist(),
      ]);
      setCountryOptions(countryRes);
      setSongTypeOptions(typeRes);
      setArtistOptions(artistRes);
    }
    fetchData();
  }, []);

  /* ---------- HANDLERS (Album) ---------- */
  const handleAlbumChange = (e: any) =>
    setAlbumData({ ...albumData, [e.target.name]: e.target.value });

  const handleAlbumFilterChange = (e: any) => {
    const value = e.target.value;
    setAlbumData((p) => ({ ...p, artistOwner: value }));
    const filtered = artistOptions.filter((a) =>
      a.Name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filtered : []);
  };

  const handleSelectSuggestion = (artist: any) => {
    setAlbumData((p) => ({ ...p, artistOwner: artist.Name }));
    setSuggestions([]);
  };

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAlbumImage(e.target.files[0]);
  };

  /* ---------- HANDLERS (Song blocks) ---------- */
  const handleSongChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSongs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [name]: value } : s))
    );
  };

  const handleCountryChange = (idx: number, val: number) =>
    setSongs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, CountryId: val } : s))
    );

  const handleStatusChange = (idx: number, val: string) =>
    setSongs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, Status: val } : s))
    );

  const handleArtistChange = (idx: number, arr: number[]) =>
    setSongs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, Artist: arr } : s))
    );

  const handleSongTypeChange = (idx: number, arr: number[]) =>
    setSongs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, SongType: arr } : s))
    );

  const handleFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) =>
    setFiles((prev) =>
      prev.map((f, i) => (i === idx ? e.target.files?.[0] ?? null : f))
    );

  const addSong = () => {
    setSongs((p) => [...p, emptySong]);
    setFiles((p) => [...p, null]);
  };
  const removeSong = (idx: number) => {
    setSongs((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ---------- VALIDATE ---------- */
  function validate(): string[] {
    const err: string[] = [];
    if (!albumData.nameAlbum.trim()) err.push("Tên album là bắt buộc.");
    if (!albumImage) err.push("Phải chọn ảnh bìa album.");
    songs.forEach((s, i) => {
      if (!s.NameSong.trim()) err.push(`Bài ${i + 1}: thiếu tên.`);
      if (!files[i]) err.push(`Bài ${i + 1}: thiếu file nhạc.`);
    });
    return err;
  }

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) return errs.forEach((m) => toast.error(m));

    const formData = new FormData();
    formData.append(
      "album_request",
      JSON.stringify({
        ...albumData,
        releaseDay: new Date(albumData.releaseDay).toISOString(),
        song: songs.map((s) => ({
          ...s,
          ReleaseDay: new Date(s.ReleaseDay).toISOString(),
          Point: Number(s.Point),
        })),
      })
    );
    if (albumImage) formData.append("image", albumImage);
    files.forEach((f) => f && formData.append("song_file", f));

    try {
      await CreateAlbum(formData);
      toast.success("Tạo album thành công!");
      router.push("/album");
    } catch {
      toast.error("Có lỗi xảy ra khi tạo album.");
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ==== Album info ==== */}
      <div className="grid gap-4">
        {/* Tên album */}
        <div>
          <Label>Tên Album</Label>
          <Input
            name="nameAlbum"
            value={albumData.nameAlbum}
            onChange={handleAlbumChange}
            required
          />
        </div>

        {/* Mô tả */}
        <div>
          <Label>Mô tả</Label>
          <Textarea
            name="description"
            value={albumData.description}
            onChange={handleAlbumChange}
          />
        </div>

        {/* Ngày phát hành */}
        <div>
          <Label>Ngày phát hành</Label>
          <Input
            type="date"
            name="releaseDay"
            value={albumData.releaseDay}
            onChange={handleAlbumChange}
            required
          />
        </div>

        {/* Ảnh bìa */}
        <div>
          <Label>Ảnh bìa album</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAlbumImageChange}
          />
        </div>

        {/* Nghệ sĩ sở hữu (input + gợi ý) */}
        <div className="relative">
          <Label>Nghệ sĩ sở hữu</Label>
          <Input
            name="artistOwner"
            value={albumData.artistOwner}
            onChange={handleAlbumFilterChange}
            placeholder="Nhập tên nghệ sĩ..."
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow">
              {suggestions.map((a: any) => (
                <li
                  key={a.ID}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50"
                  onClick={() => handleSelectSuggestion(a)}
                >
                  {a.Name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nghệ sĩ tham gia */}
        <div>
          <Label>Nghệ sĩ tham gia trong album</Label>
          <ScrollArea className="h-40 rounded-md border p-2">
            <div className="grid grid-cols-2 gap-2">
              {artistOptions.map((a) => (
                <label key={a.ID} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={albumData.artist.includes(a.ID)}
                    onChange={(e) =>
                      setAlbumData((prev) => ({
                        ...prev,
                        artist: e.target.checked
                          ? [...prev.artist, a.ID]
                          : prev.artist.filter((id) => id !== a.ID),
                      }))
                    }
                  />
                  {a.Name}
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* ==== Song blocks ==== */}
      {songs.map((song, idx) => (
        <div key={idx} className="rounded-md border p-4 space-y-4">
          <Label className="font-semibold">Bài hát {idx + 1}</Label>
          <Input
            name="NameSong"
            placeholder="Tên bài hát"
            value={song.NameSong}
            onChange={(e) => handleSongChange(idx, e)}
            required
          />
          <Input
            name="Description"
            placeholder="Mô tả"
            value={song.Description}
            onChange={(e) => handleSongChange(idx, e)}
          />
          <Input
            type="date"
            name="ReleaseDay"
            value={song.ReleaseDay}
            onChange={(e) => handleSongChange(idx, e)}
            required
          />
          <Input
            type="number"
            name="Point"
            placeholder="Điểm"
            value={song.Point}
            onChange={(e) => handleSongChange(idx, e)}
          />

          {/* Quốc gia */}
          <div>
            <Label>Quốc gia</Label>
            <Select
              value={String(song.CountryId)}
              onValueChange={(v) => handleCountryChange(idx, Number(v))}
            >
              <SelectTrigger className="w-full">
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

          {/* Nghệ sĩ */}
          <div>
            <Label>Nghệ sĩ</Label>
            <div className="grid grid-cols-2 gap-2">
              {artistOptions.map((a) => (
                <label key={a.ID} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={song.Artist.includes(a.ID)}
                    onChange={() => {
                      const next = song.Artist.includes(a.ID)
                        ? song.Artist.filter((id) => id !== a.ID)
                        : [...song.Artist, a.ID];
                      handleArtistChange(idx, next);
                    }}
                  />
                  {a.Name}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={song.Status}
              onValueChange={(v) => handleStatusChange(idx, v)}
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

          {/* Song types */}
          <div>
            <Label>Thể loại</Label>
            <div className="grid grid-cols-2 gap-2">
              {songTypeOptions.map((t: any) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={song.SongType.includes(t.id)}
                    onChange={() => {
                      const next = song.SongType.includes(t.id)
                        ? song.SongType.filter((id) => id !== t.id)
                        : [...song.SongType, t.id];
                      handleSongTypeChange(idx, next);
                    }}
                  />
                  {t.type}
                </label>
              ))}
            </div>
          </div>

          {/* File mp3 */}
          <div>
            <Label>File bài hát</Label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileChange(idx, e)}
            />
          </div>
          {songs.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeSong(idx)}
            >
              Xóa bài hát
            </Button>
          )}
        </div>
      ))}

      {/* ==== Buttons ==== */}
      <div className="flex gap-4">
        <Button type="button" onClick={addSong}>
          Thêm bài hát
        </Button>
        <Button type="submit">Tạo Album</Button>
      </div>
    </form>
  );
}
