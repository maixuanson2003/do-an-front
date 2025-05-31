"use client";

import { CreateUser } from "@/api/ApiUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    age: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await CreateUser(formData);
      router.push("/user");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.fullName}
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={formData.address}
          className="w-full p-2 border rounded"
        />
        <select
          name="gender"
          onChange={handleChange}
          value={formData.gender}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          value={formData.age}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
