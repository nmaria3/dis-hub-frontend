"use client";

import { useEffect } from "react";
import { useFetchImages } from "../utils/useFetchImages";
import Image from "next/image";

export default function Uploads() {
    const { images, loading, error } = useFetchImages();
    
    useEffect(() => {
        console.log("Component mounted, fetching images...");
        
            console.log("Fetched images:", images);
    }, [images]);

  return (
    <section className="p-6">
      <h1 className="text-3xl font-heading">Uploads</h1>

      {/* ✅ Loading */}
      {loading && <p className="mt-4">Loading images...</p>}

      {/* ❌ Error */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* ⚠️ Empty */}
      {!loading && images.length === 0 && (
        <p className="mt-4">No images found</p>
      )}

      {/* ✅ Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {Array.isArray(images) &&
          images.map((img) => (
            <div key={img.id} className="relative w-full h-48">
              <Image
                src={img.image_url}
                alt="Uploaded image"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
      </div>
    </section>
  );
}