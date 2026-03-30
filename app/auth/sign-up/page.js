"use client";

// app/sign-up/page.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("https://cute-crow-45.accounts.dev/sign-up");
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, [router]);

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>Redirecting to sign-up...</h1>
    </div>
  );
}