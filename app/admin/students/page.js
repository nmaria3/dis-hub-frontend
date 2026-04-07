"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function StudentsDirectory() {
  const { getToken } = useAuth();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  // =========================
  // 📥 FETCH DATA
  // =========================
  useEffect(() => {
    async function fetchStudents() {
      const token = await getToken();

      const res = await fetch(
        "http://localhost:5000/admin/get-student/activity",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setStudents(data.data);
        setFiltered(data.data);
        setCount(data.count);

        const activeCount = data.data.filter(
          (s) => s.status === "online"
        ).length;

        setActive(activeCount);
      }
    }

    fetchStudents();
    setInterval(async () => {
        await fetchStudents();
    }, 60000);
  }, [getToken]);

  // =========================
  // 🔍 SEARCH + FILTER + SORT
  // =========================
  useEffect(() => {
    let temp = [...students];

    // 🔍 SEARCH
    if (search) {
      const s = search.toLowerCase();

      temp = temp.filter((u) =>
        [
          u.full_name,
          u.campus_name,
          u.faculty_name,
          u.course_name,
          u.phone_number,
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }

    // 🎯 FILTER STATUS
    if (filterStatus) {
      temp = temp.filter((u) => u.status === filterStatus);
    }

    // 📊 SORT
    if (sortBy === "name") {
      temp.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    if (sortBy === "recent") {
      temp.sort(
        (a, b) =>
          new Date(b.last_seen_eat || 0) -
          new Date(a.last_seen_eat || 0)
      );
    }

    setFiltered(temp);
  }, [search, filterStatus, sortBy, students]);

  // =========================
  // 🧹 ACTIONS
  // =========================

    const handleDelete = async (user) => {
        try {
            const confirmPrompt = confirm("Are you sure you wanna delete the user from Dis-Hub. This Action is PERMANENT and can't be undone!!!");
        
            if (!confirmPrompt)
            {
                console.log("Deletion Aborted!!!");
                return
            }

            const token = await getToken();

            const res = await fetch("http://localhost:5000/admin/delete-user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: user.id,
                clerkId: user.clerkid,
            }),
            });

            const data = await res.json();

            console.log(data);

            toast.success(data.message || "Student Deleted Successfully");

            if (res.ok) {
            // remove from UI instantly
            setFiltered((prev) => prev.filter((u) => u.id !== user.id));
            setStudents((prev) => prev.filter((u) => u.id !== user.id));
            }
        } catch (err) {
            console.error(err);
        }
    };

  const handleDisable = (id) => {
    console.log("Disable user:", id);
    alert("Still in Testing Mode")
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Students Directory
        </h1>

        <p className="text-gray-600 mt-2 mb-6">
          Manage the Scholar Community on Dis-Hub
        </p>

        {/* ========================= */}
        {/* 📊 STATS */}
        {/* ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600">Total number of students</h3>
            <p className="text-4xl font-bold text-[#3772FF] mt-2">
              {count}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600">Active</h3>
            <p className="text-4xl font-bold text-[#3772FF] mt-2">
              {active}
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* 🔍 SEARCH / FILTER / SORT */}
        {/* ========================= */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid gap-3 md:grid-cols-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by name, campus, course..."
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#3772FF]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTER */}
          <select
            className="p-3 border rounded-lg"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          {/* SORT */}
          <select
            className="p-3 border rounded-lg"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="name">Name (A-Z)</option>
            <option value="recent">Recently Active</option>
          </select>
        </div>

        {/* ========================= */}
        {/* 👥 USERS */}
        {/* ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-3">
                <img
                  src={u.image_url}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{u.full_name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {u.email}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    u.status === "online"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {u.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-4 text-sm space-y-1 break-words">
                <p><strong>ID:</strong> {u.id}</p>
                <p><strong>Clerk ID:</strong> {u.clerkid}</p>
                <p><strong>Role:</strong> {u.role}</p>
                <p><strong>Phone:</strong> {u.phone_number || "N/A"}</p>
                <p><strong>Campus:</strong> {u.campus_name || "N/A"}</p>
                <p><strong>Faculty:</strong> {u.faculty_name || "N/A"}</p>
                <p><strong>Course:</strong> {u.course_name || "N/A"}</p>
              </div>

              {/* DATES */}
              <div className="mt-3 text-xs text-gray-500">
                <p>
                  Last Seen:{" "}
                  {u.last_seen_eat
                    ? new Date(u.last_seen_eat).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  Last Sign-in:{" "}
                  {new Date(u.last_sign_in_at).toLocaleString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDelete(u)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleDisable(u.id)}
                  className="flex-1 text-white py-2 rounded"
                  style={{ backgroundColor: "#3772FF" }}
                >
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}