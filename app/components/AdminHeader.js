"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import {
  Show,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser
} from "@clerk/nextjs";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // 🔐 AUTH STATE
  const { isSignedIn, isLoaded, user } = useUser();

  // loading state (prevents flicker)
  if (!isLoaded) {
    return null;
  }

  return (
    <header className="bg-white w-full shadow-sm">
      <div className="max-w-[90%] mx-auto flex justify-between items-center px-6 py-4">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-2" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faGraduationCap} className="text-[#D00000] text-2xl" />
          <h1 className="text-2xl font-heading font-bold text-[#D00000]">
            Dis-Hub
          </h1>
        </div>

        {/* RIGHT: NAV (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-6 font-body text-black">
            {/* ✅ SIGNED IN */}
          <Show when="signed-in">
            <Link href="/admin/dashboard" className="hover:text-[#D00000] transition">
              Dashboard
            </Link>
          </Show>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-[#D00000] transition flex items-center gap-1"
            >
              Dissertations <i className="fas fa-chevron-down text-xs"></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-8 left-0 bg-white shadow-md rounded-md w-48 z-50">
                <Link href="/admin/uploads" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  Uploads
                </Link>
                <Link href="/admin/uploads/multiple-uploads" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  Multiple Uploads
                </Link>
                <Link href="/admin/uploads/view" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  View Dissertations
                </Link>
              </div>
            )}
          </div>

          <Link href="/admin/analytics" className="hover:text-[#D00000] transition">
            Analytics
          </Link>

          <Link href="/admin/students" className="hover:text-[#D00000] transition">
            Students
          </Link>

          {/* ❌ NOT SIGNED IN */}
          <Show when="signed-out">
            
              <button onClick={() => router.push("/auth/sign-in")} className="hover:text-[#D00000] transition">
                Login
              </button>
            
              <button onClick={() => router.push("/auth/sign-up")} className="border border-[#D00000] text-white bg-[#D00000] px-4 py-2 rounded-md transition hover:bg-white hover:text-[#D00000]">
                Register
              </button>
            
          </Show>

          {/* ✅ SIGNED IN */}
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              {/* Optional: show user name */}
              <span className="text-sm">
                👋 {user?.lastName || "Admin"}
              </span>

              <UserButton />
            </div>
          </Show>

        </nav>

        {/* HAMBURGER */}
        <div
          className="md:hidden text-2xl text-black cursor-pointer hover:text-[#D00000]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 font-body text-black bg-white">

          {/* ✅ SIGNED IN */}
          <Show when="signed-in">
            <Link href="/admin/dashboard" className="hover:text-[#D00000] transition">
              Dashboard
            </Link>
          </Show>

          {/* 🔽 DROPDOWN (MOBILE VERSION) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-[#D00000] transition flex items-center gap-1"
            >
              Dissertations <i className="fas fa-chevron-down text-xs"></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-8 left-0 bg-white shadow-md rounded-md w-48 z-50">
                <Link href="/admin/uploads" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  Uploads
                </Link>
                <Link href="/admin/uploads/multiple-uploads" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  Multiple Uploads
                </Link>
                <Link href="/admin/uploads/view" className="block px-4 py-2 hover:bg-[#EFEFEF]">
                  View Dissertations
                </Link>
              </div>
            )}
          </div>

          <Link href="/admin/analytics" className="hover:text-[#D00000]">
            Analytics
          </Link>

          <Link href="/admin/students" className="hover:text-[#D00000]">
            Students
          </Link>

          {/* ❌ NOT SIGNED IN */}
          <Show when="signed-out">
            <button onClick={() => router.push("/auth/sign-in")} className="text-left hover:text-[#D00000]">
              Login
            </button>

            <button
              onClick={() => router.push("/auth/sign-up")}
              className="border border-[#D00000] text-white bg-[#D00000] px-4 py-2 rounded-md text-left hover:bg-white hover:text-[#D00000] transition"
            >
              Register
            </button>
          </Show>

          {/* ✅ SIGNED IN */}
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span>👋 {user?.lastName || "Admin"}</span>
              <UserButton />
            </div>
          </Show>

        </div>
      )}
    </header>
  );
}