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
import { getListCountry } from "@/api/ApiCountry";
import { getListType } from "@/api/ApiSongType";
import { getListArtist } from "@/api/ApiArtist";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CreateAlbum } from "@/api/ApiAlbum";
import { useRouter } from "next/navigation";

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

const CreateAlbumForm = () => {
  const route = useRouter();
  const [albumData, setAlbumData] = useState({
    nameAlbum: "",
    description: "",
    releaseDay: "",
    artistOwner: "",
    artist: [] as number[],
  });
  const [artistOptions, setArtistOptions] = useState<any[]>([]);
  const [songTypeOptions, setSongTypeOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [songs, setSongs] = useState<SongMeta[]>([
    {
      NameSong: "",
      Description: "",
      ReleaseDay: "",
      Point: 0,
      Status: "",
      CountryId: 0,
      SongType: [],
      Artist: [],
    },
  ]);
  const [files, setFiles] = useState<(File | null)[]>([null]);

  useEffect(() => {
    const fetchData = async () => {
      const [countryRes, typeRes, artistRes] = await Promise.all([
        getListCountry(),
        getListType(),
        getListArtist(),
      ]);
      setCountryOptions(countryRes);
      setSongTypeOptions(typeRes);
      setArtistOptions(artistRes);
    };
    fetchData();
  }, []);

  const handleAlbumChange = (e: any) => {
    const { name, value } = e.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleSongChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedSongs = [...songs];
    updatedSongs[index] = { ...updatedSongs[index], [name]: value };
    setSongs(updatedSongs);
  };

  const handleSongTypeChange = (index: number, selected: number[]) => {
    const updatedSongs = [...songs];
    updatedSongs[index].SongType = selected;
    setSongs(updatedSongs);
  };

  const handleArtistChange = (index: number, selected: number[]) => {
    const updatedSongs = [...songs];
    updatedSongs[index].Artist = selected;
    setSongs(updatedSongs);
  };

  const handleCountryChange = (index: number, countryId: number) => {
    const updatedSongs = [...songs];
    updatedSongs[index].CountryId = countryId;
    setSongs(updatedSongs);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFiles = [...files];
    updatedFiles[index] = e.target.files ? e.target.files[0] : null;
    setFiles(updatedFiles);
  };

  const addSong = () => {
    setSongs([
      ...songs,
      {
        NameSong: "",
        Description: "",
        ReleaseDay: "",
        Point: 0,
        Status: "",
        CountryId: 0,
        SongType: [],
        Artist: [],
      },
    ]);
    setFiles([...files, null]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "album_request",
      JSON.stringify({
        ...albumData,
        releaseDay: new Date(albumData.releaseDay).toISOString(),
        song: songs.map((song) => ({
          ...song,
          ReleaseDay: new Date(song.ReleaseDay).toISOString(),
          Point: Number(song.Point),
        })),
      })
    );

    files.forEach((file) => {
      if (file) formData.append("song_file", file);
    });
    console.log(formData.get("album_request"));

    try {
      await CreateAlbum(formData);
      toast.success("Tạo album thành công!");
      route.push("/album");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo album.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label>Tên Album</Label>
          <Input
            name="nameAlbum"
            value={albumData.nameAlbum}
            onChange={handleAlbumChange}
            required
          />
        </div>
        <div>
          <Label>Mô tả</Label>
          <Textarea
            name="description"
            value={albumData.description}
            onChange={handleAlbumChange}
          />
        </div>
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
        <div>
          <Label>Chủ sở hữu nghệ sĩ</Label>
          <Input
            name="artistOwner"
            value={albumData.artistOwner}
            onChange={handleAlbumChange}
          />
        </div>
        <div>
          <Label>Nghệ sĩ tham gia trong album</Label>
          <ScrollArea className="h-40 rounded-md border p-2">
            <div className="grid grid-cols-2 gap-2">
              {artistOptions.map((artist) => (
                <label
                  key={artist.ID}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={artist.ID}
                    checked={albumData.artist.includes(artist.ID)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      setAlbumData((prev) => ({
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
      </div>

      {songs.map((song, idx) => (
        <div key={idx} className="p-4 border rounded-md space-y-4">
          <Label className="text-lg font-semibold">Bài hát {idx + 1}</Label>
          <Input
            name="NameSong"
            value={song.NameSong}
            onChange={(e) => handleSongChange(idx, e)}
            placeholder="Tên bài hát"
            required
          />
          <Input
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
            required
          />
          <Input
            type="number"
            name="Point"
            value={song.Point}
            onChange={(e) => handleSongChange(idx, e)}
            placeholder="Điểm"
          />

          <div>
            <Label>Quốc gia</Label>
            <Select
              onValueChange={(val) => handleCountryChange(idx, parseInt(val))}
              value={String(song.CountryId)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn quốc gia" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country.Id} value={String(country.Id)}>
                    {country.CountryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nghệ sĩ</Label>
            <div className="grid grid-cols-2 gap-2">
              {artistOptions.map((artist) => (
                <label key={artist.ID} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={song.Artist.includes(artist.ID)}
                    onChange={() => {
                      const selected = song.Artist.includes(artist.ID)
                        ? song.Artist.filter((id) => id !== artist.ID)
                        : [...song.Artist, artist.ID];
                      handleArtistChange(idx, selected);
                    }}
                  />
                  {artist.Name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Thể loại bài hát</Label>
            <div className="grid grid-cols-2 gap-2">
              {songTypeOptions.map((type: any, index: any) => (
                <label key={type.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={song.SongType.includes(type.id)}
                    onChange={() => {
                      const selected = song.SongType.includes(type.id)
                        ? song.SongType.filter((id) => id !== type.id)
                        : [...song.SongType, type.id];
                      handleSongTypeChange(idx, selected);
                    }}
                  />
                  {type.type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>File bài hát</Label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileChange(idx, e)}
            />
          </div>
        </div>
      ))}

      <Button type="button" onClick={addSong}>
        Thêm bài hát
      </Button>
      <Button type="submit">Tạo Album</Button>
    </form>
  );
};

export default CreateAlbumForm;
