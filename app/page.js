"use client";

import Hero from "./components/Hero";
import Featured from "./components/Featured";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import Quote from "./components/Quote";
// import { useAuth } from "@clerk/nextjs";
// import { useEffect } from "react";

export default function Home() {
  // const { getToken, isLoaded, isSignedIn } = useAuth();

  // useEffect(() => {
  //   if (!isLoaded || !isSignedIn) return;

  //   const sendToBackend = async () => {
  //     try {
  //       const token = await getToken();

  //       console.log("Token:", token);

  //       const res = await fetch("http://localhost:5000/protected", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`, // 🔥 send token
  //         },
  //       });

  //       const data = await res.json();

  //       console.log("Backend response:", data);
  //     } catch (err) {
  //       console.error("Error:", err);
  //     }
  //   };

  //   sendToBackend();
  //   console.log("User is signed in, token sent to backend.");
  // }, [getToken, isLoaded, isSignedIn]);

  return (
    <main>
      <Hero />
      <Featured />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Quote />
    </main>
  )
}
