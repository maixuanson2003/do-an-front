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

  const [files, setFiles] = useState<File[]>([]);

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
    updatedSongs[index] = {
      ...updatedSongs[index],
      [name as keyof SongMeta]: value,
    };
    setSongs(updatedSongs);
  };
  const handleSongTypeChange = (songIndex: number, selected: number[]) => {
    const updatedSongs = [...songs];
    updatedSongs[songIndex].SongType = selected;
    setSongs(updatedSongs);
  };
  const handleFileChange = (index: number, e: any) => {
    const selectedFiles = [...files];
    selectedFiles[index] = e.target.files[0];
    setFiles(selectedFiles);
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
    setFiles([...files, null as any]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "album_request",
      JSON.stringify({
        ...albumData,
        releaseDay: new Date(albumData.releaseDay).toISOString(),
        song: songs.map((song) => ({
          ...song,
          releaseDay: new Date(song.ReleaseDay).toISOString(),
        })),
      })
    );
    console.log(formData);

    files.forEach((file, idx) => {
      if (file) formData.append("song_file", file);
    });

    const res = await fetch("/api/album/create", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Tạo album thất bại");
    } else {
      alert("Tạo album thành công");
    }
  };
  const handleArtistChange = (songIndex: number, selected: number[]) => {
    const updatedSongs = [...songs];
    updatedSongs[songIndex].Artist = selected;
    setSongs(updatedSongs);
  };
  const handleCountryChange = (index: number, countryId: number) => {
    const updatedSongs = [...songs];
    updatedSongs[index].CountryId = countryId;
    setSongs(updatedSongs);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {songs.map((song, idx) => (
        <div key={idx} className="p-4 border rounded-md space-y-3">
          <Label>Bài hát {idx + 1}</Label>
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
          <div className="w-full">
            <Label>Quốc gia</Label>
            <Select
              onValueChange={(value) =>
                handleCountryChange(idx, parseInt(value))
              }
              value={String(song.CountryId)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn quốc gia" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country.id} value={String(country.id)}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nghệ sĩ</Label>
            <div className="flex flex-col gap-2">
              {artistOptions.map((artist) => (
                <label key={artist.ID} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={songs[idx].Artist.includes(artist.ID)}
                    onChange={(e) => {
                      const selected = songs[idx].Artist.includes(artist.ID)
                        ? songs[idx].Artist.filter((id) => id !== artist.ID)
                        : [...songs[idx].Artist, artist.id];
                      handleArtistChange(idx, selected);
                    }}
                  />
                  <span>{artist.Name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Thể loại bài hát</Label>
            <div className="flex flex-col gap-2">
              {songTypeOptions.map((type) => (
                <label key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={songs[idx].SongType.includes(type.ID)}
                    onChange={(e) => {
                      const selected = songs[idx].SongType.includes(type.id)
                        ? songs[idx].SongType.filter((id) => id !== type.id)
                        : [...songs[idx].SongType, type.ID];
                      handleSongTypeChange(idx, selected);
                    }}
                  />
                  <span>{type.type}</span>
                </label>
              ))}
            </div>
          </div>

          <Label>File nhạc</Label>
          <Input
            type="file"
            accept=".mp3"
            onChange={(e) => handleFileChange(idx, e)}
            required
          />
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
