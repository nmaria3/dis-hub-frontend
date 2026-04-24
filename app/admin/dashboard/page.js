"use client"

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBook, 
  faUsers, 
  faDownload, 
  faPlus, 
  faUserGraduate, 
  faFileUpload 
} from "@fortawesome/free-solid-svg-icons";
import NotificationBell from "@/app/components/NotificationBell";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { isLoaded, getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    async function fetchDashboardData() {
      try {
        const token = await getToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        setDashboardData(result); // ✅ FIX
      } catch (error) {
        console.error("Error fetching admin analytics:", error);
      }
    }

    fetchDashboardData();
  }, [isLoaded]);

  if (!dashboardData)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEFEF]">
      
      <div className="flex flex-col items-center gap-6">
        
        {/* Spinner */}
        <div className="relative w-20 h-20">
          
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#D00000]/20"></div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#D00000] border-t-transparent animate-spin"></div>
          
          {/* Inner Pulse */}
          <div className="absolute inset-3 rounded-full bg-[#D00000]/10 animate-pulse"></div>
        
        </div>

        {/* Text */}
        <p className="text-sm font-semibold text-gray-600 tracking-wide animate-pulse">
          Loading dashboard...
        </p>

      </div>
    </div>
  );

  const { stats, recent } = dashboardData;

  return (
    <div className="p-6 md:p-10 bg-[#EFEFEF] min-h-screen text-black">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage the digital legacy of Dis-Hub. Monitor research velocity, student engagement and scholarly impact across departments.
          </p>
        </div>
        <Link href="/admin/uploads">
          <button className="bg-[#D00000] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#D00000]/70 transition-all shadow-lg shadow-blue-200">
            <FontAwesomeIcon icon={faPlus} />
            New Dissertation
          </button>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AdminStatCard 
          label="Total Dissertations" 
          value={stats.totalDissertations} 
          icon={faBook} 
        />
        <AdminStatCard 
          label="Total Students" 
          value={stats.totalStudents} 
          icon={faUsers} 
        />
        <AdminStatCard 
          label="Total Downloads" 
          value={stats.totalDownloads} 
          icon={faDownload} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Recent Uploads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <FontAwesomeIcon icon={faFileUpload} className="text-[#D00000]" />
              Recent Uploads
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 5 items</span>
          </div>
          
          <div className="space-y-4">
            {recent.dissertations.map((doc) => (
              <div key={doc.id} className="p-4 bg-[#EFEFEF]/50 rounded-xl hover:bg-[#EFEFEF] transition-all group">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-sm leading-tight group-hover:text-[#D00000] line-clamp-1">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{doc.author_name} • <span className="text-[#D00000]">{doc.faculty}</span></p>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 whitespace-nowrap">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Latest Scholars */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <FontAwesomeIcon icon={faUserGraduate} className="text-[#D00000]" />
              Latest Scholars
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {recent.students.map((student) => (
              <div key={student.clerkId} className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D00000] flex items-center justify-center text-white font-bold">
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none">{student.full_name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">{student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Joined {new Date(student.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔔 Floating Bell */}
      <NotificationBell />
    </div>
  );
}

// Sub-component for Admin Stats
function AdminStatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-[#D00000] transition-all">
      <div className="w-14 h-14 bg-[#EFEFEF] text-[#D00000] rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#D00000] group-hover:text-white transition-all">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-black">{value}</h3>
      </div>
    </div>
  );
}