"use client";

import { useState, useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { getListCountry } from "@/api/ApiCountry";
import { getListType } from "@/api/ApiSongType";
import { getListArtist } from "@/api/ApiArtist";
import { GetSongById, UpdateSong } from "@/api/ApiSong";

interface Country {
  id: number;
  name: string;
}

const UpdateSongForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("songid");

  const [formData, setFormData] = useState({
    nameSong: "",
    description: "",
    releaseDay: "",
    point: 0,
    status: "public",
    countryId: "",
    songType: [] as number[],
    artist: [] as number[],
    file: null as File | null,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [songTypes, setSongTypes] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [countryRes, typeRes, artistRes] = await Promise.all([
        getListCountry(),
        getListType(),
        getListArtist(),
      ]);
      setCountries(countryRes);
      setSongTypes(typeRes);
      setArtists(artistRes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchSongData = async () => {
      const songRes = await GetSongById(id);
      let file = null;
      try {
        const response = await fetch(songRes.SongResource);
        if (!response.ok) throw new Error("File fetch lỗi");
        const blob = await response.blob();
        const filename = songRes.SongResource.split("/").pop() || "song.mp3";
        const fileType = blob.type || "audio/mpeg";
        file = new File([blob], filename, { type: fileType });
      } catch (e) {
        console.warn("Không lấy được file từ URL", e);
      }
      setFormData({
        nameSong: songRes.NameSong,
        description: songRes.Description,
        releaseDay: songRes.ReleaseDay?.split("T")[0] || "",
        point: songRes.Point,
        status: songRes.Status,
        countryId: songRes.CountryId.toString(),
        songType: (songRes.SongType || []).map((type: any) => type.Id),
        artist: (songRes.Artist || []).map((artist: any) => artist.ID),
        file: file,
      });
    };
    fetchSongData();
  }, [id]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleCheckboxChange = (
    id: number,
    field: "songType" | "artist",
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], id]
        : prev[field].filter((itemId) => itemId !== id),
    }));
  };

  const validateForm = () => {
    if (!formData.nameSong.trim()) {
      alert("Tên bài hát không được để trống.");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Mô tả không được để trống.");
      return false;
    }
    if (!formData.releaseDay.trim()) {
      alert("Ngày phát hành không được để trống.");
      return false;
    }
    if (!formData.countryId) {
      alert("Chưa chọn quốc gia.");
      return false;
    }
    if (formData.songType.length === 0) {
      alert("Cần chọn ít nhất một thể loại.");
      return false;
    }
    if (formData.artist.length === 0) {
      alert("Cần chọn ít nhất một nghệ sĩ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    const payload = {
      NameSong: formData.nameSong,
      Description: formData.description,
      ReleaseDay: new Date(formData.releaseDay).toISOString(),
      Point: Number(formData.point),
      Status: formData.status,
      CountryId: parseInt(formData.countryId),
      SongType: formData.songType,
      Artist: formData.artist,
    };

    data.append("songData", JSON.stringify(payload));
    data.append("file", formData.file ?? new Blob([]));

    await UpdateSong(data, id);
    router.push("/song");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tên bài hát</Label>
        <Input
          name="nameSong"
          value={formData.nameSong}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Mô tả</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Ngày phát hành</Label>
        <Input
          type="date"
          name="releaseDay"
          value={formData.releaseDay}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Điểm</Label>
        <Input
          type="number"
          name="point"
          value={formData.point}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Quốc gia</Label>
        <Select
          value={formData.countryId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, countryId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn quốc gia" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c: any) => (
              <SelectItem key={c.Id} value={c.Id.toString()}>
                {c.CountryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Thể loại</Label>
        <ScrollArea className="h-40 rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2">
            {songTypes.map((type: any) => (
              <div key={type.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`type-${type.id}`}
                  checked={formData.songType.includes(type.id)}
                  onChange={(e) =>
                    handleCheckboxChange(type.id, "songType", e.target.checked)
                  }
                />
                <label htmlFor={`type-${type.id}`}>{type.type}</label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label>Nghệ sĩ</Label>
        <ScrollArea className="h-40 rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2">
            {artists.map((artist: any) => (
              <div key={artist.ID} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`artist-${artist.ID}`}
                  checked={formData.artist.includes(artist.ID)}
                  onChange={(e) =>
                    handleCheckboxChange(artist.ID, "artist", e.target.checked)
                  }
                />
                <label htmlFor={`artist-${artist.ID}`}>{artist.Name}</label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label>File nhạc</Label>
        <Input type="file" accept=".mp3" onChange={handleFileChange} />
        {formData.file && (
          <p className="text-sm text-gray-600 mt-2">
            file hiện tại: {formData.file.name}
          </p>
        )}
      </div>

      <Button type="submit">Cập nhật bài hát</Button>
    </form>
  );
};

export default UpdateSongForm;
