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

    console.log("User is signed in:", user.id);

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

    // alert(`AppWrapper check for user ${user.id} on path ${pathname}`); // Debug alert
    async function profileStatus(userId) {

      const adminRedirected = sessionStorage.getItem("adminRedirected");
      const email = user.emailAddresses[0].emailAddress;
      // alert(`Checking profile for user ${userId} with email ${email}. Admin redirected: ${adminRedirected}`); // Debug alert
      if (adminRedirected || email === "maria.admin.umu@gmail.com") {
        console.log("Admin is already registered.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/auth/check-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId: userId, "page": pathname }),
        });

        const data = await res.json();
        // alert(`Profile status response: ${JSON.stringify(data)}`); // Debug alert

        // ✅ 4. If profile is complete → STOP everything
        if (data.complete === true) {
          return;
        }

        if (data.message === "Extra Request has been denied") {
          console.log(data.message || "Access denied to profile check.");
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