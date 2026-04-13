"use client";
import  { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faHistory, faExclamationTriangle, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '@clerk/nextjs';

export default function DownloadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
        const token = await getToken();
      try {
        const response = await fetch("http://localhost:5000/student/downloads", {
            headers : {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Failed to fetch download history.");
        
        const result = await response.json();
        if (result.success) {
          setHistory(result.data);
        } else {
          throw new Error(result.message || "Something went wrong");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleReDownload = (url) => {
    console.log("Downloading from:", url);
    // Logic to trigger actual download could go here
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3772FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-black p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-black mb-2 flex items-center gap-3">
              <FontAwesomeIcon icon={faHistory} className="text-[#3772FF] text-3xl" />
              Download History
            </h1>
            <p className="text-gray-600 max-w-md">
              Manage and quickly re-download your academic resources.
            </p>
          </div>
          <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200 self-start md:self-auto">
            <span className="text-[#3772FF] font-bold text-lg">{history.length}</span>
            <span className="text-gray-500 ml-2 font-medium italic text-sm text-nowrap">items found</span>
          </div>
        </header>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* List Section */}
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-5 shadow-sm border border-transparent hover:border-[#3772FF] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#EFEFEF] p-4 rounded-lg text-[#3772FF] group-hover:bg-[#3772FF] group-hover:text-white transition-colors">
                    <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-[#3772FF] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-tight">
                      By {item.author}
                    </p>
                    <div className="mt-1 md:hidden">
                       <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold uppercase">
                        {formatDate(item.downloaded_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Downloaded</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(item.downloaded_at)}</p>
                  </div>

                  <button 
                    onClick={() => handleReDownload(item.file_download_url)}
                    className="bg-[#3772FF] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-100"
                    title="Download Again"
                  >
                    <FontAwesomeIcon icon={faCloudDownloadAlt} className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <FontAwesomeIcon icon={faHistory} className="text-gray-200 text-6xl mb-4" />
              <p className="text-gray-400 font-medium italic">No download history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};