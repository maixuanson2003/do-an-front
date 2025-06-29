"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getListCountry } from "@/api/ApiCountry";
import { getArtistById, UpdateArtist } from "@/api/ApiArtist";
import { DownLoad } from "@/api/ApiSong";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Kiểu dữ liệu quốc gia trả về từ API
 */
interface Country {
  Id: number;
  CountryName: string;
}

const UpdateArtistForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("artistid");

  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [description, setDescription] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * B1. Lấy danh sách quốc gia
   * B2. Lấy chi tiết artist (nếu có id)
   * B3. Từ CountryName tìm ra Id tương ứng, set lên state
   * B4. Lấy file ảnh gốc (từ URL) -> chuyển thành File -> set vào image state
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryList = await getListCountry();
        setCountries(countryList);
        if (id) {
          const res = await getArtistById(Number(id));
          const artist = res.artist;

          setName(artist.Name);
          setBirthDay(artist.BirthDay?.slice(0, 10) ?? "");
          setDescription(artist.Description);

          // map CountryName -> Id
          const matched = countryList.find(
            (c: any) => c.CountryName === artist.Country
          );
          setCountryId(matched ? matched.Id : null);

          // 3️⃣ Lấy url ảnh & preview
          if (artist.Image) {
            setPreviewUrl(artist.Image);

            // 4️⃣ Convert image URL -> File để submit multipart ngay cả khi user không đổi ảnh
            try {
              const response = await DownLoad(artist.Image);

              const filename = artist.Image.split("/").pop() || "artist.jpg";
              const file = new File([response], filename, {
                type: response.type,
              });
              setImage(file);
            } catch (err) {
              console.error("Cannot fetch image to File:", err);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  /**
   * Người dùng tự chọn ảnh mới
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * Submit: luôn gửi multipart vì image luôn có giá trị (đã preload)
   */
  const handleSubmit = async () => {
    if (!countryId) {
      alert("Vui lòng chọn quốc gia");
      return;
    }

    const artistRequest = {
      name,
      birthDay,
      description,
      countryId,
    };

    // Luôn xây formData vì image chắc chắn tồn tại
    const formData = new FormData();
    formData.append("artistrequest", JSON.stringify(artistRequest));
    if (image) formData.append("image", image);

    await UpdateArtist(formData, id);
    router.push("/artist");
  };

  return (
    <div className="space-y-4 w-full mx-auto">
      {/* Name */}
      <div>
        <Label htmlFor="name">Tên nghệ sĩ</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Birth day */}
      <div>
        <Label htmlFor="birthDay">Ngày sinh</Label>
        <Input
          id="birthDay"
          type="date"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Country select */}
      <div>
        <Label>Quốc gia</Label>
        <Select
          value={countryId ? countryId.toString() : ""}
          onValueChange={(value) => setCountryId(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn quốc gia" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.Id} value={country.Id.toString()}>
                {country.CountryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image upload */}
      <div>
        <Label htmlFor="image">Ảnh nghệ sĩ</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="preview"
            className="mt-2 h-40 rounded-lg object-cover"
          />
        )}
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit}>Cập nhật nghệ sĩ</Button>
    </div>
  );
};

export default UpdateArtistForm;
