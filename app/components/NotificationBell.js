"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function NotificationBell() {
  const { getToken } = useAuth();
  const [count, setCount] = useState(0);

  // =========================
  // FETCH UNREAD COUNT
  // =========================
  const fetchUnread = async () => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/admin/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCount(data.count || 0);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  // =========================
  // POLLING EVERY 30s
  // =========================
  useEffect(() => {
    fetchUnread(); // initial

    const interval = setInterval(() => {
      fetchUnread();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      onClick={() => (window.location.href = "/admin/notifications")}
    >
      <div className="relative">

        {/* Bell */}
        <div className="bg-[#3772FF] text-white p-4 rounded-full shadow-lg hover:scale-105 transition">
          🔔
        </div>

        {/* Badge */}
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
    </div>
  );
}