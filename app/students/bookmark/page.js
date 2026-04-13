"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBookmark, 
  faArrowRight, 
  faDownload, 
  faGraduationCap,
  faExclamationCircle 
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '@clerk/nextjs';

 export default function BookmarksPage () {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/student/bookmarks", {
            headers : {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Failed to load bookmarks");
        
        const result = await response.json();
        if (result.success) {
          setBookmarks(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleView = (id) => {
    router.push(`/students/dissertations/${id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-[#3772FF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-black p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black flex items-center gap-3">
              <FontAwesomeIcon icon={faBookmark} className="text-[#3772FF]" />
              Saved Dissertations
            </h1>
            <p className="text-gray-600 font-medium">
              Manage your collection of academic research and saved papers.
            </p>
          </div>
          
          <div className="bg-white border-2 border-[#3772FF] px-6 py-2 rounded-xl self-start">
            <span className="text-2xl font-black text-[#3772FF]">{bookmarks.length}</span>
            <span className="ml-2 font-bold text-sm uppercase tracking-tighter">Items Saved</span>
          </div>
        </header>

        {error && (
          <div className="bg-white border-l-4 border-red-500 p-4 mb-8 shadow-sm flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
            <p className="font-bold text-red-500">{error}</p>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {bookmarks.map((item) => (
            <div 
              key={item.bookmark_id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row border border-gray-100 group"
            >
              {/* LEFT: Image and Course Overlay */}
              <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 text-white">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-[#3772FF]" />
                    <span className="text-xs font-bold uppercase tracking-wide">{item.course}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Content and Actions */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl md:text-2xl font-black leading-tight group-hover:text-[#3772FF] transition-colors">
                      {item.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-4">
                    <span>{item.author}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <span>{item.year}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 italic">
                    "{item.abstract}"
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleView(item.dissertation_id)}
                    className="bg-[#3772FF] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    View Dissertation
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(item.file_download_url, '_blank')}
                    className="bg-[#EFEFEF] text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-[#3772FF]" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}

          {bookmarks.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
               <p className="text-gray-400 font-bold">Your collection is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
