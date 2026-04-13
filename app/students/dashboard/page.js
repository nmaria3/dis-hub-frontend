"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDownload, 
  faBookmark, 
  faEye, 
  faSearch, 
  faChartLine, 
  faClock, 
  faFire,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isSignedIn, isLoaded, } = useAuth();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if(!isSignedIn)
    {
      console.log("User not logged in");
      return;
    }
    const fetchAnalytics = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/student/dashboard/analytics", {
          headers : {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          }
        });
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isSignedIn]);

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);

    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds} secs ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  if (loading) return <div className="p-10 text-center font-bold">Initializing Dashboard...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Failed to load analytics.</div>;

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-black p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black">Welcome back, {user?.firstName}😄👋</h1>
            <p className="text-gray-500 mt-1">Continue your research journey and explore new academic frontiers</p>
          </div>
          <Link href="/browse">
            <button className="bg-[#3772FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <FontAwesomeIcon icon={faSearch} />
              Start New Search
            </button>
          </Link>
        </div>

        {/* 1. Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={faDownload} 
            title="Total Downloads" 
            value={data.downloads.total} 
            subtitle={`${data.downloads.this_month} this month`} 
          />
          <StatCard 
            icon={faBookmark} 
            title="Saved Dissertations" 
            value={data.bookmarks.total} 
            subtitle={
              data.bookmarks.latest
                ? `Last saved: ${timeAgo(data.bookmarks.latest)}`
                : "No bookmarks yet"
            }
          />
          <StatCard 
            icon={faEye} 
            title="Monthly Views" 
            value={data.views.this_month} 
            subtitle="Active research mode" 
          />
        </div>

        {/* 2. Middle Section: Recent Downloads & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Downloads */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[#3772FF]" /> Recent Downloads
              </h2>
              <Link href="/students/download-history" className="text-[#3772FF] text-sm font-bold hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {data.recentDownloads.slice(0, 5).map((dl, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#EFEFEF]/50 rounded-xl hover:bg-[#EFEFEF] transition-colors border border-transparent hover:border-[#3772FF]/20">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{dl.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{dl.author_name} • {dl.course}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xs font-black text-[#3772FF]">{dl.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Stats & Activity */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-[#3772FF]">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Most Downloaded</h3>
              <h4 className="font-bold text-lg leading-tight mb-2">{data.topDissertation.title}</h4>
              <div className="flex items-end gap-2 text-[#3772FF]">
                <span className="text-3xl font-black">{data.topDissertation.downloads}</span>
                <span className="text-sm font-bold mb-1 pb-1">downloads ({data.topDissertation.percentage}%)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-[#3772FF]" /> Activity (Past 7 Days)
              </h3>
              <div className="flex justify-between gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                   const isActive = i === 4 || i === 5; // Simulating active days based on API
                   return (
                     <div key={i} className="flex flex-col items-center gap-2">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isActive ? 'bg-[#3772FF] text-white shadow-md' : 'bg-[#EFEFEF] text-gray-400'}`}>
                         {isActive ? '✓' : ''}
                       </div>
                       <span className="text-[10px] font-bold text-gray-400">{day}</span>
                     </div>
                   );
                })}
              </div>
              <p className="mt-4 text-xs font-bold text-gray-500 italic text-center">Active for {data.activity.days_active} days this week</p>
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Bookmarks & Trending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookmarks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-black flex items-center gap-2">
                <FontAwesomeIcon icon={faBookmark} className="text-[#3772FF]" /> Saved Dissertations
              </h2>
              <Link href="/students/bookmark" className="text-[#3772FF] text-sm font-bold hover:underline">View all</Link>
            </div>
            {data.recentBookmarks.slice(0, 5).map((bm) => (
              <Link href={`/students/dissertations/${bm.dissertation_id}`} key={bm.dissertation_id}>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-transparent hover:border-[#3772FF] transition-all mb-4 block group">
                  <span className="text-[10px] font-black text-[#3772FF] uppercase">{bm.course}</span>
                  <h3 className="font-bold text-lg group-hover:text-[#3772FF] transition-colors">{bm.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2 italic">"{bm.abstract}"</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Trending */}
          <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faFire} className="text-orange-500" /> Trending Weekly
            </h2>
            <div className="space-y-6">
              {data.trending.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span className="text-2xl font-black text-[#EFEFEF] italic">{index + 1}</span>
                  <div>
                    <h4 className="font-bold text-sm leading-tight hover:text-[#3772FF] cursor-pointer line-clamp-2">{item.title}</h4>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faEye} /> {item.views}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faDownload} /> {item.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for Top Stat Cards
const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div className="bg-[#EFEFEF] w-10 h-10 rounded-lg flex items-center justify-center text-[#3772FF] group-hover:bg-[#3772FF] group-hover:text-white transition-colors">
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{subtitle}</span>
    </div>
    <div className="mt-4 relative z-10">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black mt-1">{value}</h3>
    </div>
    {/* Decorative Background Icon */}
    <FontAwesomeIcon 
      icon={icon} 
      className="absolute -bottom-4 -right-4 text-gray-50 text-7xl transform rotate-12 group-hover:text-blue-50 transition-colors" 
    />
  </div>
);