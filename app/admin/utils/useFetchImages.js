"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

export function useFetchImages() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();

  const hasRun = useRef(false);
  const [images, setImages] = useState([]);
  const [uniData, setUniData] = useState([]);

  useEffect(() => {
    if (!userLoaded || !authLoaded) return;

    if (!isSignedIn || !user) return;

    if (hasRun.current) return;
    hasRun.current = true;

    async function fetchImages() {
      try {
        const token = await getToken();

        if (!token) return;

        const res = await fetch("http://localhost:5000/admin/get-images", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setImages(data.data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchUniversityData() {
      try {
        const res = await fetch("http://localhost:5000/auth/complete-profile-data");

        if (!res.ok) {
          throw new Error("Failed to fetch university data");
        }

        const data = await res.json();

        console.log("University Data:", data.data);

        setUniData(data.data);
      } catch (err) {
        console.error("University data error:", err);
      }
    }

    fetchImages();
    fetchUniversityData();
  }, [userLoaded, authLoaded, isSignedIn, user, getToken]);

  return { images, uniData };
}