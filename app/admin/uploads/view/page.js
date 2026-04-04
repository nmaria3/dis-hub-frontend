"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ManageDissertations() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  // =========================
  // 📡 FETCH DATA
  // =========================
  const fetchDissertations = async () => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/admin/get-dissertations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.message);
        return;
      }

      setData(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDissertations();
  }, []);

  // =========================
  // 🔍 SEARCH (MULTI FIELD)
  // =========================
  const searchedData = useMemo(() => {
    return data.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.title?.toLowerCase().includes(query) ||
        item.supervisor?.toLowerCase().includes(query) ||
        item.academic?.course?.name?.toLowerCase().includes(query) ||
        item.academic?.campus?.name?.toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  // =========================
  // 🎯 FILTER (FACULTY)
  // =========================
  const filteredData = useMemo(() => {
    if (!filter) return searchedData;

    return searchedData.filter(
      (item) => item.academic?.faculty?.name === filter
    );
  }, [searchedData, filter]);

  // =========================
  // 🔃 SORT
  // =========================
  const sortedData = useMemo(() => {
    let sorted = [...filteredData];

    if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "year") {
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return sorted;
  }, [filteredData, sort]);

  // =========================
  // ✏️ ACTIONS
  // =========================
  const handleEdit = (item) => {
    console.log("✏️ Edit:", item.id, item.title);
    
    router.push(`/admin/uploads/edit/${item.id}`)
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = confirm(`Delete "${title}"?`);

    if (!confirmDelete) return;

    try {
      const token = await getToken();

      const res = await fetch(
        `http://localhost:5000/admin/delete-dissertation/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success(data.message || "Dissertation was deleted successfully")

      console.log("✅ Deleted:", data);

      // 🔄 REFRESH DATA
      fetchDissertations();

    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong");
    }
  };

  // =========================
  // 🎓 UNIQUE FILTER OPTIONS
  // =========================
  const facultyOptions = [
    ...new Set(data.map((d) => d.academic?.faculty?.name).filter(Boolean)),
  ];

  return (
    <div style={{ backgroundColor: "#EFEFEF" }} className="min-h-screen p-4 md:p-8">

      {/* ========================= */}
      {/* 🧾 HEADER */}
      {/* ========================= */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
          Manage Dissertations
        </h1>

        <p className="text-sm md:text-base text-gray-700 max-w-2xl">
          Oversee the academic lineage of Dis-Hub. Curate, validate and maintain the highest standards of research documentation.
        </p>
      </div>

      {/* ========================= */}
      {/* 🔍 CONTROLS */}
      {/* ========================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search by title, supervisor, course or campus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg outline-none"
        />

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Sort</option>
          <option value="title">Title A-Z</option>
          <option value="year">Newest</option>
        </select>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Faculties</option>
          {facultyOptions.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* ========================= */}
      {/* 📦 CARDS */}
      {/* ========================= */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {sortedData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >

            {/* 🖼️ IMAGE (SQUARE) */}
            <div className="relative w-full aspect-square bg-gray-200">
              <Image
                src={item.image_url || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-1">

              <h2 className="text-lg font-semibold text-black mb-1 line-clamp-2">
                {item.title}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                👤 {item.author_name}
              </p>

              <p className="text-xs text-gray-500 mb-1">
                🎓 {item.academic?.course?.name || "No course"}
              </p>

              <p className="text-xs text-gray-500 mb-2">
                📍 {item.academic?.campus?.name || "No campus"}
              </p>

              <p className="text-xs text-gray-500 mb-2">
                🧑‍🏫 {item.supervisor}
              </p>

              <p className="text-sm text-gray-700 line-clamp-3 flex-1">
                {item.abstract}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 py-2 rounded-lg text-white text-sm font-semibold"
                  style={{ backgroundColor: "#3772FF" }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="flex-1 py-2 rounded-lg border text-sm font-semibold"
                  style={{
                    borderColor: "#3772FF",
                    color: "#3772FF",
                  }}
                >
                  🗑️ Delete
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* EMPTY */}
      {sortedData.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No dissertations found.
        </div>
      )}
    </div>
  );
}