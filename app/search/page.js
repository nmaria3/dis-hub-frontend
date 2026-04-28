"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';

export default function BrowsePage() {
  const [dissertations, setDissertations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  // Filter States
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    campus: "",
    faculty: "",
    course: ""
  });
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/get-dissertations`);
        const result = await response.json();
        setDissertations(result.data);
        setFilteredData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and Sort Logic
useEffect(() => {
  const searchText = search.toLowerCase();

  let updatedList = dissertations.filter((item) => {
    const title = item?.title ?? "";
    const author = item?.author_name ?? "";
    const year = item?.year != null ? item.year.toString() : "";
    const campus = item?.academic?.campus?.name ?? "";
    const faculty = item?.academic?.faculty?.name ?? "";
    const course = item?.academic?.course?.name ?? "";

    const matchesSearch =
      title.toLowerCase().includes(searchText) ||
      author.toLowerCase().includes(searchText);

    const matchesYear = filters.year ? year === filters.year : true;
    const matchesCampus = filters.campus ? campus === filters.campus : true;
    const matchesFaculty = filters.faculty ? faculty === filters.faculty : true;
    const matchesCourse = filters.course ? course === filters.course : true;

    return (
      matchesSearch &&
      matchesYear &&
      matchesCampus &&
      matchesFaculty &&
      matchesCourse
    );
  });

  updatedList.sort((a, b) => {
    if (sortBy === "year") {
      return Number(b?.year ?? 0) - Number(a?.year ?? 0);
    }

    const valueA = String(a?.[sortBy] ?? "");
    const valueB = String(b?.[sortBy] ?? "");

    return valueA.localeCompare(valueB);
  });

  setFilteredData(updatedList);
}, [search, filters, sortBy, dissertations]);

  const handleView = (id) => {
    console.log("Viewing Dissertation ID:", id);
    if (isSignedIn) {
      router.push(`/students/dissertations/${id}`);
    } else {
      toast.info("Please login to view details.");
    }
  };

  const handleDownload = async(id, file) => {
    if (!isSignedIn) {
        toast.info("Please login to download");
        window.location.href = "/auth/sign-in";
        return;
    }

    const token = await getToken();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/track/download`,
        {
            method: "POST",
            headers: {
                Authorization : `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body : JSON.stringify({file_id : id})
        }
    );

    if(res.ok)
    {
        const data = await res.json();
        console.log(data.message);
        setTimeout(() => {
            window.location.href=download_url;
        }, 1500);
    }
    else
    {
        console.log("Failed to download!!!");
        return;
    }

    // 🔥 trigger download
    const link = document.createElement("a");
    link.href = file.download_url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-black p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#D00000]">Browse Dissertations</h1>
        <p className="text-gray-600 mt-2">Explore academic research and findings from our top students.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg border-b border-[#D00000] pb-2">Search & Filters</h2>
            
            <input 
              type="text" 
              placeholder="Search title or author..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#D00000] outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select 
                className="w-full p-2 bg-white border border-gray-300 rounded"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="author_name">Author</option>
                <option value="year">Newest Year</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <select className="p-2 bg-white border border-gray-300 rounded" onChange={(e) => setFilters({...filters, year: e.target.value})}>
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>

              <select className="p-2 bg-white border border-gray-300 rounded" onChange={(e) => setFilters({...filters, campus: e.target.value})}>
                <option value="">All Campuses</option>
                <option value="Nkozi">Nkozi</option>
              </select>

              <select className="p-2 bg-white border border-gray-300 rounded" onChange={(e) => setFilters({...filters, faculty: e.target.value})}>
                <option value="">All Faculties</option>
                <option value="Science">Science</option>
                <option value="Law">Law</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Vertical/Horizontal Line */}
        <div className="border-t lg:border-l border-[#D00000] opacity-30"></div>

        {/* Card Grid */}
        <main className="flex-1">
          {loading ? (
            <p>Loading records...</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow">
                  {/* Rectangular Image */}
                  <div className="w-full md:w-40 h-48 md:h-auto relative">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-[#D00000] uppercase">{item.academic.course?.name || "General"}</span>
                        <span className="text-xs text-gray-400">{item.year}</span>
                      </div>
                      <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">By {item.author_name}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 italic">
                        "{item.abstract}"
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleView(item.id)}
                        className="flex-1 bg-[#D00000] text-white py-2 px-4 rounded text-sm font-semibold hover:bg-[#D00000]/70 transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownload(item.id, item.file)}
                        className="flex-1 border border-[#D00000] text-[#D00000] py-2 px-4 rounded text-sm font-semibold hover:bg-[#D00000] hover:text-white transition-all"
                      >
                        {isSignedIn ? "Download" : "Login to Download"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filteredData.length === 0 && (
            <div className="text-center py-20 text-gray-500">No dissertations match your search.</div>
          )}
        </main>
      </div>
    </div>
  );
};