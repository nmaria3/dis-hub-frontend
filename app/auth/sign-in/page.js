"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignInPage() {
  const { openSignIn } = useClerk();

  useEffect(() => {
    openSignIn();
    // openSignIn({
    //   redirectUrl: "/auth/profile-check",
    // });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Redirecting to sign-in...</h1>
    </div>
  );
}