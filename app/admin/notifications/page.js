"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function NotificationsPage() {
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data.data || []);
      setFiltered(data.data || []);

      // ✅ Mark as read immediately
      await fetch("http://localhost:5000/admin/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    fetchNotifications();
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
  useEffect(() => {
    let temp = [...notifications];

    if (category !== "all") {
      temp = temp.filter((n) => n.category === category);
    }

    if (type !== "all") {
      temp = temp.filter((n) => n.type === type);
    }

    setFiltered(temp);
  }, [category, type, notifications]);

  // =========================
  // UI HELPERS
  // =========================
  const getTypeColor = (type) => {
    switch (type) {
      case "created":
        return "#16a34a";
      case "updated":
        return "#eab308";
      case "deleted":
        return "#dc2626";
      case "danger":
        return "#dc2626";
      default:
        return "#3772FF";
    }
  };

  return (
    <div style={{ backgroundColor: "#EFEFEF", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>

        {/* HEADER */}
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
          Notifications
        </h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Stay updated with system activities and events.
        </p>

        {/* FILTERS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            <option value="all">All Categories</option>
            <option value="dissertation">Dissertation</option>
            <option value="user">User</option>
            <option value="system">System</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            <option value="all">All Types</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="danger">Danger</option>
          </select>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div style={{ display: "grid", gap: "15px" }}>
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#777" }}>
              No notifications found.
            </p>
          )}

          {filtered.map((n) => (
            <div key={n.id} style={cardStyle}>

              {/* LEFT STRIP */}
              <div
                style={{
                  width: "5px",
                  backgroundColor: getTypeColor(n.type),
                  borderRadius: "5px 0 0 5px",
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "15px", flex: 1 }}>

                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0 }}>{n.title}</h3>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                <p style={{ margin: "8px 0", color: "#444" }}>{n.message}</p>

                {/* TAGS */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span style={tagStyle}>{n.category}</span>
                  <span style={{ ...tagStyle, backgroundColor: getTypeColor(n.type), color: "#fff" }}>
                    {n.type}
                  </span>
                </div>

                {/* PAYLOAD */}
                {n.payload && (
                  <div style={payloadStyle}>
                    {Object.entries(n.payload).map(([key, value]) => (
                      <p key={key} style={{ margin: "2px 0" }}>
                        <strong>{key}:</strong> {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const selectStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "white",
};

const cardStyle = {
  display: "flex",
  background: "white",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const tagStyle = {
  padding: "4px 10px",
  fontSize: "12px",
  backgroundColor: "#EFEFEF",
  borderRadius: "20px",
};

const payloadStyle = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  fontSize: "13px",
};