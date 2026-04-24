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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
            <Link href="/students/dashboard" className="hover:text-[#D00000] transition">
              Dashboard
            </Link>
          </Show>

          <Link href="/search" className="hover:text-[#D00000] transition">
            Search
          </Link>

          <Link href="/about" className="hover:text-[#D00000] transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-[#D00000] transition">
            Contact
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
                👋 {user?.firstName || "User"}
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
            <Link href="/students/dashboard" className="hover:text-[#D00000] transition">
              Dashboard
            </Link>
          </Show>

          <Link href="/search" className="hover:text-[#D00000]">
            Search
          </Link>

          <Link href="/about" className="hover:text-[#D00000]">
            About
          </Link>

          <Link href="/contact" className="hover:text-[#D00000]">
            Contact
          </Link>

          {/* ❌ NOT SIGNED IN */}
          <Show when="signed-out">
            
              <button onClick={() => router.push("/auth/sign-in")} className="text-left hover:text-[#D00000]">
                Login
              </button>
            

            
              <button onClick={() => router.push("/auth/sign-up")} className="border border-[#D00000] text-white bg-[#D00000] px-4 py-2 rounded-md text-left hover:bg-white hover:text-[#D00000] transition">
                Register
              </button>
            
          </Show>

          {/* ✅ SIGNED IN */}
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span>👋 {user?.firstName || "User"}</span>
              <UserButton />
            </div>
          </Show>

        </div>
      )}
    </header>
  );
}