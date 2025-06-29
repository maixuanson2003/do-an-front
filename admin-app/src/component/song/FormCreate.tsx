"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getListCountry } from "@/api/ApiCountry";
import { getListType } from "@/api/ApiSongType";
import { getListArtist } from "@/api/ApiArtist";
import { CreateSong } from "@/api/ApiSong";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface Country {
  id: number;
  name: string;
}

const CreateSongForm = () => {
  const route = useRouter();
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
  const [songTypes, setSongType] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [countryRes, typeRes, artistRes] = await Promise.all([
        getListCountry(),
        getListType(),
        getListArtist(),
      ]);
      setCountries(countryRes);
      setSongType(typeRes);
      setArtists(artistRes);
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };
  const validateFormData = (formData: any): string[] => {
    const errors: string[] = [];

    // Tên bài hát: required, min 2, max 100
    if (!formData.nameSong.trim()) {
      errors.push("Tên bài hát là bắt buộc.");
    } else if (formData.nameSong.length < 2 || formData.nameSong.length > 100) {
      errors.push("Tên bài hát phải từ 2 đến 100 ký tự.");
    }

  
    if (formData.description.length > 500) {
      errors.push("Mô tả không được vượt quá 500 ký tự.");
    }

    if (!formData.releaseDay) {
      errors.push("Ngày phát hành là bắt buộc.");
    }

   
    const point = Number(formData.point);
    if (isNaN(point) || point < 0 || point > 5) {
      errors.push("Điểm phải là một số từ 0 đến 5.");
    }

    if (!formData.countryId || isNaN(Number(formData.countryId))) {
      errors.push("Phải chọn quốc gia.");
    }
    if (!formData.songType.length) {
      errors.push("Phải chọn ít nhất một thể loại.");
    } else if (formData.songType.some((id: any) => id <= 0)) {
      errors.push("Thể loại không hợp lệ.");
    }
    if (!formData.artist.length) {
      errors.push("Phải chọn ít nhất một nghệ sĩ.");
    } else if (formData.artist.some((id: any) => id <= 0)) {
      errors.push("Nghệ sĩ không hợp lệ.");
    }

    return errors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    const data = new FormData();
    const songPayload = {
      NameSong: formData.nameSong,
      Description: formData.description,
      ReleaseDay: new Date(formData.releaseDay).toISOString(),
      Point: Number(formData.point),
      Status: formData.status,
      CountryId: parseInt(formData.countryId),
      SongType: formData.songType,
      Artist: formData.artist,
    };
    data.append("songData", JSON.stringify(songPayload));
    if (formData.file) {
      data.append("file", formData.file);
    }

    const datas = await CreateSong(data);
    route.push("/song");
    console.log("Form gửi:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <Label>Tên bài hát</Label>
        <Input
          name="nameSong"
          value={formData.nameSong}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Mô tả</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Ngày phát hành</Label>
        <Input
          type="date"
          name="releaseDay"
          value={formData.releaseDay}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Điểm</Label>
        <Input
          type="number"
          name="point"
          value={formData.point}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(val) => setFormData({ ...formData, status: val })}
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

      <div>
        <Label>Quốc gia</Label>
        <Select
          value={formData.countryId}
          onValueChange={(val) => setFormData({ ...formData, countryId: val })}
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
              <label key={type.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={type.id}
                  checked={formData.songType.includes(type.id)}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      songType: e.target.checked
                        ? [...prev.songType, id]
                        : prev.songType.filter((tid) => tid !== id),
                    }));
                  }}
                />
                {type.type}
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label>Nghệ sĩ</Label>
        <ScrollArea className="h-40 rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2">
            {artists.map((artist: any) => (
              <label
                key={artist.ID}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={artist.ID}
                  checked={formData.artist.includes(artist.ID)}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      artist: e.target.checked
                        ? [...prev.artist, id]
                        : prev.artist.filter((aid) => aid !== id),
                    }));
                  }}
                />
                {artist.Name}
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label>File nhạc</Label>
        <Input type="file" accept=".mp3" onChange={handleFileChange} />
      </div>

      <Button type="submit">Tạo bài hát</Button>
    </form>
  );
};

export default CreateSongForm;
