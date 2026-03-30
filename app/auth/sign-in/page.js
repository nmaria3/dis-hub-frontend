"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("https://cute-crow-45.accounts.dev/sign-in");
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, [router]);

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>Redirecting to sign-in...</h1>
    </div>
  );
}