"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function EditDissertation() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const [data, setData] = useState({
    title: "",
    author_name: "",
    abstract: "",
    methodology: "",
    supervisor: "",
    license: "",
    citations: "",
    campus_id: "",
    faculty_id: "",
    course_id: "",
    image_url: "",
  });

  const [campuses, setCampuses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);

  // =========================
  // 📡 FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`http://localhost:5000/admin/dissertations/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const result = await res.json();

        const d = result.dissertation;

        setData({
          ...d,
          course_id: d.courses_id,
        });

        setCampuses(result.campuses);
        setFaculties(result.faculties);
        setCourses(result.courses);
        setImages(result.images);

        // filter initial
        setFilteredFaculties(
          result.faculties.filter(f => f.campus_id === d.campus_id)
        );

        setFilteredCourses(
          result.courses.filter(c => c.faculty_id === d.faculty_id)
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // 🔄 DROPDOWN HANDLERS
  // =========================
  const handleCampusChange = (e) => {
    const campusId = Number(e.target.value);

    setData({ ...data, campus_id: campusId, faculty_id: "", course_id: "" });

    const facs = faculties.filter(f => f.campus_id === campusId);
    setFilteredFaculties(facs);
    setFilteredCourses([]);
  };

  const handleFacultyChange = (e) => {
    const facultyId = Number(e.target.value);

    setData({ ...data, faculty_id: facultyId, course_id: "" });

    const crs = courses.filter(c => c.faculty_id === facultyId);
    setFilteredCourses(crs);
  };

  // =========================
  // 🎯 SUBMIT
  // =========================
    const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    try {
        const res = await fetch(
        `http://localhost:5000/admin/dissertations/${id}`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        }
        );

        const result = await res.json();

        if (!res.ok) {
        toast.error(result.message || "Update failed");
        return;
        }

        // console.log("✅ UPDATED:", data);

        toast.success("🎉 Dissertation updated successfully");

    } catch (err) {
        console.error("❌ Update error:", err);
        toast.error("Something went wrong");
    }
    };
  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#EFEFEF" }}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6 text-black">
          ✏️ Edit Dissertation
        </h1>

        {/* ================= IMAGE SLIDER ================= */}
        <div className="mb-6">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {images.length > 0 && (
              <img
                src={images[currentImage]?.image_url}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* thumbnails */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.image_url}
                onClick={() => {
                  setCurrentImage(i);
                  setData({ ...data, image_url: img.image_url });
                }}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  currentImage === i ? "border-[#3772FF]" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="grid gap-4">

          <input placeholder="Title" value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="p-3 border rounded"/>

          <input placeholder="Author"
            value={data.author_name}
            onChange={(e) => setData({ ...data, author_name: e.target.value })}
            className="p-3 border rounded"/>

          <textarea placeholder="Abstract"
            value={data.abstract}
            onChange={(e) => setData({ ...data, abstract: e.target.value })}
            className="p-3 border rounded"/>

          <input placeholder="Methodology"
            value={data.methodology}
            onChange={(e) => setData({ ...data, methodology: e.target.value })}
            className="p-3 border rounded"/>

          <input placeholder="Supervisor"
            value={data.supervisor}
            onChange={(e) => setData({ ...data, supervisor: e.target.value })}
            className="p-3 border rounded"/>

          {/* ================= DROPDOWNS ================= */}
          <select value={data.campus_id} onChange={handleCampusChange} className="p-3 border rounded">
            <option value="">Select Campus</option>
            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={data.faculty_id} onChange={handleFacultyChange} className="p-3 border rounded">
            <option value="">Select Faculty</option>
            {filteredFaculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>

          <select value={data.course_id}
            onChange={(e) => setData({ ...data, course_id: Number(e.target.value) })}
            className="p-3 border rounded">
            <option value="">Select Course</option>
            {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <textarea placeholder="License"
            value={data.license}
            onChange={(e) => setData({ ...data, license: e.target.value })}
            className="p-3 border rounded"/>

          <textarea placeholder="Citations"
            value={data.citations}
            onChange={(e) => setData({ ...data, citations: e.target.value })}
            className="p-3 border rounded"/>

          {/* BUTTON */}
          <button
            type="submit"
            className="py-3 text-white font-semibold rounded"
            style={{ backgroundColor: "#3772FF" }}
          >
            Update Dissertation
          </button>

        </form>
      </div>
    </div>
  );
}