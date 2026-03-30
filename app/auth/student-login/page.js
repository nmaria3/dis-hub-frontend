"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function StudentLogin() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const hasRun = useRef(false); // 🧠 prevents multiple executions

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleLogin = async () => {
    if (!isLoaded || !user) return;

    try {
      setLoading(true);

      // ⏳ Artificial delay (3–5 seconds)
      const delay = Math.floor(Math.random() * 2000) + 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const res = await fetch("http://localhost:5000/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      const data = await res.json();
      

      if (data.message === "User not found. Please sign up first.") {
          try {
            // 🔥 call delete endpoint
            await fetch("http://localhost:5000/delete-user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                clerkId: user.id,
              }),
            });

            await signOut();

            router.push("/auth/sign-up");
            return;
          } catch (err) {
            console.error("Delete failed:", err);
          }
        }


      toast.success(data.message || "Login successful");

      // Redirect
      if (data.redirect) {
        window.location.href = data.redirect;
      }

    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  // =========================
  // AUTO RUN ON LOAD
  // =========================
  useEffect(() => {
    if (!isLoaded || !user || hasRun.current) return;

    hasRun.current = true; // 🚫 prevent double execution
    handleLogin();
  }, [isLoaded, user]);

  // =========================
  // LOADING SCREEN
  // =========================
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <div className="text-center">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: "#3772FF", borderTopColor: "transparent" }}
        ></div>

        <p className="mt-4 text-black font-semibold">
          Signing you in...
        </p>

        {user && (
          <p className="text-xs text-gray-500 mt-2">
            {user.emailAddresses[0].emailAddress}
          </p>
        )}
      </div>
    </div>
  );
}