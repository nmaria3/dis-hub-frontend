"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function AppWrapper({ children }) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  const hasChecked = useRef(false);

  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/profile-check");

  useEffect(() => {
    // ✅ 1. Wait for user
    if (!isSignedIn || !user) return;

    // ✅ 2. Prevent multiple runs
    if (hasChecked.current) return;

    // ✅ 3. Skip pages that should NEVER trigger this
    const skipRoutes = [
      "/sign-in",
      "/sign-up",
      "/profile-check",
      "/student/complete-profile",
    ];

    if (skipRoutes.includes(pathname)) return;

    hasChecked.current = true;

    async function profileStatus(userId) {
      try {
        const res = await fetch("http://localhost:5000/auth/check-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId: userId }),
        });

        const data = await res.json();

        // ✅ 4. If profile is complete → STOP everything
        if (data.complete === true) {
          return;
        }

        // ✅ 5. Redirect ONLY if not already there
        if (data.redirect && pathname !== data.redirect) {
          window.location.href = data.redirect;
        }
      } catch (err) {
        console.error("Profile check failed:", err);
      }
    }

    profileStatus(user.id);
  }, [user, isSignedIn, pathname]);

  return (
    <>
      {!isAuthPage && <Header />}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {children}

      {!isAuthPage && <Footer />}
    </>
  );
}