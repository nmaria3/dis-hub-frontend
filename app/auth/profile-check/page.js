"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfileCheck() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const hasRun = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasRun.current) return;

    hasRun.current = true;

    const handleAuth = async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://localhost:5000/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
          }),
        });

        const data = await res.json();

        // ⏳ Add delay for smooth UX
        setTimeout(() => {
          if (!res.ok) {
            router.push("/");
            return;
          }

          if (data.redirect) {
            router.push(data.redirect);
          }
        }, 3000); // 3 seconds

      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    handleAuth();
  }, [isLoaded, isSignedIn, user, getToken]);

  // =========================
  // 🔥 COOL LOADING UI
  // =========================
  return (
    <div style={container}>
      <div style={card}>
        <div style={spinner}></div>
        <h2 style={{ marginTop: "20px" }}>Setting things up...</h2>
        <p style={{ color: "#777" }}>Please wait while we prepare your account</p>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const spinner = {
  width: "50px",
  height: "50px",
  border: "5px solid #eee",
  borderTop: "5px solid #3772FF",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};