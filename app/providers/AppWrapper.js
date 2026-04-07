"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export default function AppWrapper({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const pathname = usePathname();

  const hasChecked = useRef(false);

  // =========================
  // 🚫 ROUTE CHECKS
  // =========================
  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/profile-check");

  const isAdminRoute = pathname.startsWith("/admin");

  // =========================
  // 👤 USER ROLE CHECK
  // =========================
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = email === "maria.admin.umu@gmail.com";

  // =========================
  // 🔐 PROFILE CHECK (STUDENT ONLY)
  // =========================
  useEffect(() => {
    // ✅ Wait until Clerk fully loads
    if (!isLoaded || !isSignedIn || !user) return;

    // 🚫 Prevent multiple executions
    if (hasChecked.current) return;

    async function getActivity(){
      const token = await getToken();

      const res = await fetch("http://localhost:5000/student/api/activity", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok)
      {
        alert("Unable to update Student Activity. Contact Admin Immediately...");
      }
    }
    if (!isAdmin){
      getActivity()
      setInterval(async () => {
        getActivity()
      }, 60000);
    }


    // 🚫 Skip auth + profile pages
    const skipRoutes = [
      "/sign-in",
      "/sign-up",
      "/profile-check",
      "/student/complete-profile",
    ];

    if (skipRoutes.includes(pathname)) return;

    // 🚫 Skip admin completely
    if (isAdmin) {
      console.log("Admin detected → skipping profile check");
      return;
    }

    hasChecked.current = true;

    async function checkProfile() {
      try {
        const res = await fetch("http://localhost:5000/auth/check-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            page: pathname,
          }),
        });

        const data = await res.json();

        // ✅ Profile complete → do nothing
        if (data.complete === true) {
          return;
        }

        // 🚫 Backend denied request
        if (data.message === "Extra Request has been denied") {
          console.log("Profile check skipped by backend");
          return;
        }

        // 🔁 Redirect if needed (avoid loop)
        if (data.redirect && pathname !== data.redirect) {
          window.location.href = data.redirect;
        }

      } catch (err) {
        console.error("Profile check failed:", err);
      }
    }

    checkProfile();
  }, [isLoaded, isSignedIn, user, pathname, isAdmin]);

  // =========================
  // 🎯 HEADER LOGIC
  // =========================
  const renderHeader = () => {
    // ❌ No header on auth pages
    if (isAuthPage) return null;

    // ✅ Admin gets AdminHeader ALWAYS
    if (isAdmin) return <AdminHeader />;

    // ✅ Students / guests get normal header
    return <Header />;
  };

  return (
    <>
      {/* 🔝 HEADER */}
      {renderHeader()}

      {/* 🔔 TOASTS */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* 📄 PAGE CONTENT */}
      {children}

      {/* 🔻 FOOTER (hidden on auth pages) */}
      {!isAuthPage && <Footer />}
    </>
  );
}