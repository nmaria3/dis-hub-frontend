"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignUpPage() {
  const { openSignUp } = useClerk();

  useEffect(() => {
    openSignUp();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Redirecting to sign-up...</h1>
    </div>
  );
}