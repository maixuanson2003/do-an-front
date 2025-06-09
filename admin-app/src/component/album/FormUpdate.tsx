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
import { log } from "console";

export default function UpdateAlbumForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumId = searchParams.get("id");

  const [albumData, setAlbumData] = useState<any>(null);
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDay, setReleaseDay] = useState("");
  const [artistOwner, setArtistOwner] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [originalSongs, setOriginalSongs] = useState<any[]>([]);

  const [artistOptions, setArtistOptions] = useState<any[]>([]);
  const [songTypeOptions, setSongTypeOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [artistRes, typeRes, countryRes] = await Promise.all([
        getListArtist(),
        getListType(),
        getListCountry(),
      ]);
      setArtistOptions(artistRes);
      setSongTypeOptions(typeRes);
      setCountryOptions(countryRes);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (!albumId) return;
    const fetchAlbum = async () => {
      try {
        const data = await getAlbumById(albumId);
        setAlbumData(data);
        setAlbumName(data.NameAlbum || "");
        setDescription(data.Description || "");
        setReleaseDay(data.ReleaseDay?.split("T")[0] || "");
        setArtistOwner(data.ArtistOwner || "");

        const processedSongs = await Promise.all(
          (data.Song || []).map(async (song: any) => {
            let file = null;
            console.log(song.SongResource);

            if (song.SongResource) {
              try {
                const response = await fetch(song.SongResource);
                if (!response.ok) throw new Error("File fetch lỗi");
                const blob = await response.blob();
                const filename =
                  song.SongResource.split("/").pop() || "song.mp3";
                const fileType = blob.type || "audio/mpeg";
                file = new File([blob], filename, { type: fileType });
              } catch (e) {
                console.warn("Không lấy được file từ URL", e);
              }
            }
            console.log(file);

            return {
              ...song,
              ReleaseDay: song.ReleaseDay?.split("T")[0] || "",
              file,
            };
          })
        );

        setSongs(processedSongs);
        setOriginalSongs(processedSongs.map((s) => ({ ...s, file: null })));
      } catch {
        // ignore
      }
    };
    fetchAlbum();
  }, [albumId]);

  const handleSongChange = (idx: number, e: any) => {
    const updated = [...songs];
    updated[idx][e.target.name] = e.target.value;
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

  const handleCountryChange = (idx: number, countryId: number) => {
    const updated = [...songs];
    updated[idx].CountryId = countryId;
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

  // function isSongsChanged(original: any[], current: any[]) {
  //   if (original.length !== current.length) return true;
  //   for (let i = 0; i < original.length; i++) {
  //     const o = original[i];
  //     const c = current[i];
  //     if (
  //       o.NameSong !== c.NameSong ||
  //       o.Description !== c.Description ||
  //       o.ReleaseDay !== c.ReleaseDay ||
  //       o.Point !== c.Point ||
  //       o.Status !== c.Status ||
  //       o.CountryId !== c.CountryId
  //     ) return true;
  //     if (
  //       o.Artist.length !== c.Artist.length ||
  //       o.Artist.some((id) => !c.Artist.includes(id))
  //     ) return true;
  //     if (
  //       o.SongType.length !== c.SongType.length ||
  //       o.SongType.some((id) => !c.SongType.includes(id))
  //     ) return true;
  //     if (c.file) return true;
  //   }
  //   return false;
  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateAlbum(albumId, {
        NameAlbum: albumName,
        Description: description,
        ReleaseDay: new Date(releaseDay).toISOString(),
        ArtistOwner: artistOwner,
      });

      const formData = new FormData();
      formData.append(
        "songs",
        JSON.stringify(
          songs.map((song) => ({
            NameSong: song.NameSong,
            Description: song.Description,
            ReleaseDay: new Date(song.ReleaseDay).toISOString(),
            Point: Number(song.Point),
            Status: song.Status,
            CountryId: song.CountryId,
            Artist: song.Artist,
            SongType: song.SongType,
          }))
        )
      );
      songs.forEach((song) => {
        if (song.file) formData.append("file", song.file);
      });
      await fetch(
        `http://localhost:8080/api/update/song/album?albumid=${albumId}`,
        { method: "POST", body: formData }
      );

      alert("Cập nhật album thành công!");
      router.push("/album");
    } catch {
      alert("Cập nhật album thất bại!");
    }
  };

  if (!albumId) return <p>Không tìm thấy albumId trong URL</p>;
  if (!albumData) return <p>Đang tải dữ liệu album...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Tên Album</Label>
        <Input
          value={albumName ?? ""}
          onChange={(e) => setAlbumName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Mô tả</Label>
        <Textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label>Ngày phát hành</Label>
        <Input
          type="date"
          value={releaseDay ?? ""}
          onChange={(e) => setReleaseDay(e.target.value)}
        />
      </div>
      <div>
        <Label>Chủ sở hữu nghệ sĩ</Label>
        <Input
          value={artistOwner ?? ""}
          onChange={(e) => setArtistOwner(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Danh sách bài hát</Label>
        {songs.map((song, idx) => (
          <div key={idx} className="p-4 border rounded space-y-3">
            <Label>Bài hát {idx + 1}</Label>
            <label htmlFor="">{song.ReleaseDay}</label>
            <Input
              name="NameSong"
              value={song.NameSong ?? ""}
              onChange={(e) => handleSongChange(idx, e)}
              required
              placeholder="Tên bài hát"
            />
            <Textarea
              name="Description"
              value={song.Description ?? ""}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Mô tả"
            />
            <Input
              type="date"
              name="ReleaseDay"
              value={song.ReleaseDay ?? ""}
              onChange={(e) => handleSongChange(idx, e)}
            />
            <Input
              type="number"
              name="Point"
              value={song.Point ?? ""}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Điểm"
            />
            <Input
              name="Status"
              value={song.Status ?? ""}
              onChange={(e) => handleSongChange(idx, e)}
              placeholder="Trạng thái"
            />

            <div>
              <Label>Quốc gia</Label>
              <Select
                value={String(song.CountryId ?? "")}
                onValueChange={(val) => handleCountryChange(idx, parseInt(val))}
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

            <div>
              <Label>Nghệ sĩ</Label>
              <ScrollArea className="h-20 border p-2">
                {artistOptions.map((artist) => (
                  <div key={artist.ID} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(song.Artist) &&
                        song.Artist.includes(artist.ID)
                      }
                      onChange={() =>
                        handleCheckboxChange(idx, "Artist", artist.ID)
                      }
                    />
                    <label>{artist.Name}</label>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div>
              <Label>Thể loại bài hát</Label>
              <ScrollArea className="h-20 border p-2">
                {songTypeOptions.map((type) => (
                  <div key={type.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(song.SongType) &&
                        song.SongType.includes(type.id)
                      }
                      onChange={() =>
                        handleCheckboxChange(idx, "SongType", type.id)
                      }
                    />
                    <label>{type.type}</label>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div>
              <Label>File nhạc</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(idx, e)}
              />
              {song.file && <p>Đã chọn file: {song.file.name}</p>}
            </div>

            <Button
              variant="destructive"
              onClick={() => handleRemoveSong(idx)}
              type="button"
            >
              Xóa bài hát
            </Button>
          </div>
        ))}

        <Button onClick={handleAddSong} type="button">
          Thêm bài hát
        </Button>
      </div>

      <Button type="submit">Cập nhật Album</Button>
    </form>
  );
}
