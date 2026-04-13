"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faCloudDownloadAlt, faUserPlus, 
  faChartBar, faArrowTrendUp, faCalendarDays,
  faCircleNotch
} from "@fortawesome/free-solid-svg-icons";

export default function AdminAnalytics() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Set default state to current month boundaries
  const [dateRange, setDateRange] = useState({
    startDate: "2026-04-01",
    endDate: "2026-04-30"
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:5000/admin/analytics/advanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dateRange)
      });
      const result = await response.json();
      console.log("Server Message:", result.message);
      setData(result);
    } catch (error) {
      console.error("Analytics Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] p-4 md:p-10 text-black">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header & Dynamic Date Selector */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black">Platform Insights</h1>
            <p className="text-gray-500 max-w-2xl mt-2 font-medium">
              Comprehensive performance metrics for the Dis-Hub digital Repository.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Start Date</label>
              <input 
                type="date" 
                name="startDate"
                value={dateRange.startDate}
                onChange={handleInputChange}
                className="bg-[#EFEFEF] border-none rounded-lg text-sm font-bold p-2 focus:ring-2 focus:ring-[#3772FF] outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">End Date</label>
              <input 
                type="date" 
                name="endDate"
                value={dateRange.endDate}
                onChange={handleInputChange}
                className="bg-[#EFEFEF] border-none rounded-lg text-sm font-bold p-2 focus:ring-2 focus:ring-[#3772FF] outline-none"
              />
            </div>
            <button 
              onClick={fetchAnalytics}
              disabled={loading}
              className="bg-[#3772FF] text-white self-end px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faCalendarDays} />
              )}
              View Range
            </button>
          </div>
        </header>

        {data && !loading ? (
          <>
            {/* 1. Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticsCard icon={faUsers} label="Active Users" value={data.stats.activeUsers} />
              <AnalyticsCard icon={faCloudDownloadAlt} label="Total Downloads" value={data.stats.totalDownloads} />
              <AnalyticsCard icon={faUserPlus} label="New Registrations" value={data.stats.totalRegistrations} />
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#3772FF]" />
                  Download Velocity
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.graphs.downloadsPerDay}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3772FF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3772FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {day:'numeric', month:'short'})}
                        tick={{fontSize: 11, fontWeight: 700}}
                        axisLine={false}
                      />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#3772FF" strokeWidth={3} fill="url(#areaGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartBar} className="text-[#3772FF]" />
                  Popular Topics
                </h2>
                <div className="space-y-6">
                  {data.insights.popularDissertations.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="truncate pr-4">{item.title}</span>
                        <span className="text-[#3772FF]">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#EFEFEF] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#3772FF] h-full transition-all duration-700" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Detailed Insight Table */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-black">Most Downloaded Dissertation</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase bg-[#EFEFEF] px-3 py-1 rounded-lg">Performance Leader</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#EFEFEF]/50 text-[10px] font-black uppercase text-gray-400">
                    <tr>
                      <th className="px-8 py-4">Title & Context</th>
                      <th className="px-8 py-4">Activity Trend</th>
                      <th className="px-8 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-50">
                      <td className="px-8 py-6">
                        <p className="font-bold text-lg leading-tight">{data.insights.mostDownloaded.title}</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">
                          {data.insights.mostDownloaded.author} • {data.insights.mostDownloaded.course}
                        </p>
                      </td>
                      <td className="px-8 py-6 w-48">
                        <div className="h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.insights.mostDownloaded.trend}>
                              <Line 
                                type="stepAfter" 
                                dataKey="count" 
                                stroke="#3772FF" 
                                strokeWidth={3} 
                                dot={{r: 4, fill: '#3772FF'}} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-4xl font-black text-[#3772FF]">{data.insights.mostDownloaded.total_downloads}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <FontAwesomeIcon icon={faCircleNotch} className={`text-4xl text-gray-200 ${loading ? 'animate-spin' : ''}`} />
            <p className="text-gray-400 font-bold mt-4 tracking-tight">
              {loading ? "Crunching the numbers..." : "Select a range to begin analysis"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsCard = ({ icon, label, value }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start group hover:border-[#3772FF] transition-all">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black mt-1">{value}</h3>
    </div>
    <div className="w-12 h-12 bg-[#EFEFEF] text-[#3772FF] rounded-2xl flex items-center justify-center text-xl group-hover:bg-[#3772FF] group-hover:text-white transition-all">
      <FontAwesomeIcon icon={icon} />
    </div>
  </div>
);
