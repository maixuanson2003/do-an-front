"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getUserById, UpdateUser } from "@/api/ApiUser";

export default function EditUserForm() {
  const param = useSearchParams();
  const id = param.get("userid");
  const router = useRouter();

  const [formData, setFormData] = useState({
    Username: "",
    FullName: "",
    Phone: "",
    Email: "",
    Address: "",
    Gender: "",
    Age: "",
  });

  const [loading, setLoading] = useState(true);

  // 🟡 Fetch user data to prefill form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);

        setFormData((prev) => ({
          ...prev,
          Username: res.Username || "",
          FullName: res.FullName || "",
          Phone: res.Phone || "",
          Email: res.Email || "",
          Address: res.Address || "",
          Gender: res.Gender || "",
          Age: res.Age || "",
        }));
      } catch (err) {
        alert("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await UpdateUser(formData, id);
      alert("User updated successfully");
      router.push("/user");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading user data...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="Username"
          placeholder="Username"
          value={formData.Username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="FullName"
          placeholder="Full Name"
          value={formData.FullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="Phone"
          placeholder="Phone"
          value={formData.Phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="Address"
          placeholder="Address"
          value={formData.Address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="Gender"
          value={formData.Gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="Age"
          placeholder="Age"
          value={formData.Age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
