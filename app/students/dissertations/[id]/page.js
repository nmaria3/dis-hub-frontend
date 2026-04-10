"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faDownload, 
  faBookmark, 
  faShareAlt, 
  faFilePdf, 
  faInfoCircle,
  faBalanceScale,
  faQuoteRight,
  faFlask
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';

export default function DissertationViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetching Dissertation Details
        const detailsRes = await fetch(`http://localhost:5000/student/dissertation/${id}`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`
            }
        });
        const detailsJson = await detailsRes.json();
        
        // Fetching Stats
        const statsRes = await fetch(`http://localhost:5000/student/dissertation/${id}/stats`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`
            }
        });
        const statsJson = await statsRes.json();

        const handleViewPDF = async (detailsJson) => {
            const token = await getToken();

            const res = await fetch(
                "http://localhost:5000/student/track/view",
                {
                    method: "POST",
                    headers: {
                        Authorization : `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({file_id : detailsJson.dissertation.id})
                }
            );

            const data = await res.json();

            console.log(data.message);

        };

        async function fetchBookmarkStatus(detailsJson) {    
            try {
                const token = await getToken();
    
                const res = await fetch(`http://localhost:5000/student/bookmark/${detailsJson.dissertation.id}`, {
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                });
    
                const data = await res.json();
                setBookmarked(data.bookmarked);
    
            } catch (err) {
                console.error("Bookmark fetch error:", err);
            }
        }


        setData(detailsJson);
        setStats(statsJson);
        handleViewPDF(detailsJson);
        fetchBookmarkStatus(detailsJson);
      } catch (error) {
        console.error("Error fetching dissertation data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]);
  

  if (loading) return <div className="p-10 text-center">Loading Dissertation...</div>;
  if (!data) return <div className="p-10 text-center">Dissertation not found.</div>;

  const { dissertation, campuses, faculties, courses } = data;
  const citationData = JSON.parse(dissertation.citations);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

    const formatToEAT = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString("en-UG", {
            timeZone: "Africa/Kampala",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleViewPDF = (url) => {
        window.open(url, "_blank", "noopener, noreferrer");
    }

    const handleDownloadPDF = async (file_id, download_url) => {
        const token = await getToken();

        const res = await fetch(
            "http://localhost:5000/student/track/download",
            {
                method: "POST",
                headers: {
                    Authorization : `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({file_id : file_id})
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
    }

    const handleBookmark = async (file_id) => {
    try {
        const token = await getToken();

        const res = await fetch("http://localhost:5000/student/track/bookmark", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ file_id })
        });

        const data = await res.json();

        setBookmarked(data.bookmarked); // 🔥 update UI instantly
        toast.success(data.message);

    } catch (err) {
        toast.error(data.message)
        console.error("Bookmark error:", err);
    }
    };

  // Helper to find names from IDs
  const campusName = campuses.find(c => c.id === dissertation.campus_id)?.name;
  const facultyName = faculties.find(f => f.id === dissertation.faculty_id)?.name;
  const courseName = courses.find(c => c.id === dissertation.courses_id)?.name;

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 space-y-8">
          <section>
            <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
              {dissertation.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-gray-600 font-medium">
              <span>By {dissertation.author_name}</span>
              <span className="text-[#3772FF]">•</span>
              <span>Year of Publishing: {dissertation.year}</span>
            </div>
          </section>

          {/* Featured Image */}
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={dissertation.image_url} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'VIEWS', value: stats?.views, icon: faEye },
              { label: 'DOWNLOADS', value: stats?.downloads, icon: faDownload },
              { label: 'BOOKMARKS', value: stats?.bookmarks, icon: faBookmark },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center border-b-4 border-[#3772FF]">
                <FontAwesomeIcon icon={stat.icon} className="text-[#3772FF] text-xl mb-2" />
                <span className="text-2xl font-bold">{stat.value || 0}</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Abstract */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faInfoCircle} className="text-[#3772FF]" /> Abstract
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{dissertation.abstract}</p>
          </div>

          {/* Methodology */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#3772FF]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faFlask} className="text-[#3772FF]" /> Research Methodology
            </h2>
            <p className="text-gray-700 italic">{dissertation.methodology}</p>
          </div>

          {/* Citations */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faQuoteRight} className="text-[#3772FF]" /> Citations
            </h2>
            <div className="space-y-4">
              {['apa', 'mla', 'harvard'].map((format) => (
                <div key={format} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[10px] font-black text-[#3772FF] uppercase">{format}</span>
                  <p className="text-sm mt-1 text-gray-600">{citationData[format]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* License */}
          <div className="p-6 rounded-xl border border-dashed border-gray-400 text-gray-500">
            <h2 className="text-sm font-bold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faBalanceScale} /> License & Copyright
            </h2>
            <p className="text-xs whitespace-pre-line">{dissertation.license}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Card & Metadata */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-8">
            <div className="space-y-3 mb-6">
              {/* Inverted Button (Outline) */}
              <button onClick={() => handleViewPDF(dissertation.file_url)} className="w-full py-3 border-2 border-[#3772FF] text-[#3772FF] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                <FontAwesomeIcon icon={faFilePdf} /> View Full PDF
              </button>
              
              {/* Primary Button */}
              <button onClick={() => handleDownloadPDF(dissertation.id, dissertation.file_download_url)}  className="w-full py-3 bg-[#3772FF] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                <FontAwesomeIcon icon={faDownload} /> Download PDF
              </button>

              <div className="flex gap-2">
                <button 
                onClick={() => handleBookmark(dissertation.id)} 
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                    ${bookmarked 
                    ? "bg-green-100 text-green-700 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                `}
                >
                <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                {bookmarked ? "Saved" : "Save"}
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" /> Share
                </button>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="space-y-4">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Metadata</h3>
              
              <div className="space-y-3">
                <MetaItem label="File Size" value={dissertation.file_size} />
                <MetaItem label="Pages" value={dissertation.pages} />
                <MetaItem label="Campus" value={campusName} />
                <MetaItem label="Faculty" value={facultyName} />
                <MetaItem label="Course" value={courseName} />
                <MetaItem label="Supervisor" value={dissertation.supervisor} />
                <MetaItem label="University" value="Uganda Martyrs University" />
                <MetaItem label="Platform" value="Dis-Hub" />
                <MetaItem label="Last Updated" value={formatToEAT(dissertation.updated_at)} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Small component for metadata rows
const MetaItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
    <p className="text-sm font-medium text-black">{value || 'N/A'}</p>
  </div>
);
