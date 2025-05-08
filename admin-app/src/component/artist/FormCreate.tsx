"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getListCountry } from "@/api/ApiCountry";
import { CreateArtist } from "@/api/ApiArtist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Country {
  id: number;
  name: string;
}

const CreateArtistForm = () => {
  const route = useRouter();
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [description, setDescription] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    // Giả sử bạn gọi API để lấy danh sách quốc gia
    const fetchCountries = async () => {
      const res = await getListCountry();
      setCountries(res);
    };

    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    const newArtist = {
      name,
      birthDay,
      description,
      countryId,
    };
    const data = await CreateArtist(newArtist);
    route.push("/artist");
  };

  return (
    <div className="space-y-4 w-full mx-auto">
      <div>
        <Label htmlFor="name">Tên nghệ sĩ</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="birthDay">Ngày sinh</Label>
        <Input
          id="birthDay"
          type="date"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label>Quốc gia</Label>
        <Select onValueChange={(value) => setCountryId(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn quốc gia" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country: any) => (
              <SelectItem key={country.Id} value={country.Id.toString()}>
                {country.CountryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit}>Tạo nghệ sĩ</Button>
    </div>
  );
};

export default CreateArtistForm;
