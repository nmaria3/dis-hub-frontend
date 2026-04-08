"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    async function fetchCampuses() {
      try {
        const res = await fetch("http://localhost:5000/campuses");
        const data = await res.json();

        if (data.success) {
          setCampuses(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCampuses();
  }, []);

  return (
    <section className="bg-[#EFEFEF] text-black">

      {/* ================= HERO SECTION ================= */}
      <div className="bg-[#3772FF]/20 py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

          {/* LEFT */}
          <div className="flex-1">
            <span className="inline-block px-3 py-1 text-sm rounded-md bg-[#3772FF]/35 text-[#3772FF] mb-4">
              Our Mission
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Democratizing Access to Academic Research
            </h1>

            <p className="text-gray-700">
              A central repository for university dissertations, bridging the gap between students and global knowledge. We believe research should be a public good.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex-1">
            <img
              src="https://i.pinimg.com/736x/49/ee/67/49ee67e90e9fe483b93810610525a034.jpg"
              alt="mission"
              className="w-full h-auto rounded-xl shadow-md object-cover"
            />
          </div>
        </div>
      </div>

      {/* ================= OUR STORY ================= */}
      <div className="py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">

          {/* LEFT (GALLERY) */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              "https://i.pinimg.com/736x/84/be/39/84be398b8719f168d3d858a2f667851b.jpg",
              "https://i.pinimg.com/736x/12/8a/e1/128ae1fd2b81d9b12b3814fa2f160e90.jpg",
              "https://i.pinimg.com/736x/2e/14/13/2e1413d4b3d23a3ab681ea34b669c85b.jpg",
              "https://i.pinimg.com/736x/e6/63/d2/e663d2db79febddbcd7ec8ea81648796.jpg",
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="gallery"
                className="w-full h-32 md:h-40 object-cover rounded-lg shadow"
              />
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Our Story
            </h2>

            <p className="text-gray-700 mb-4">
              Dis-Hub was founded with a single vision to ensure that groundbreaking academic research isn’t confined to dusty shelves or expensive paywalls.
            </p>

            <p className="text-gray-700 mb-6">
              We exist to empower students and researchers by providing a seamless open-access platform for university dissertations from around the world. Founded by a team of libraries and developers, we saw the friction in academic publishing and decided to build a bridge.
            </p>

            {/* STATS */}
            <div className="flex gap-4">
              <div className="flex-1 p-4 rounded-lg text-center bg-white shadow">
                <span className="block text-2xl font-bold text-[#3772FF]">
                  50k+
                </span>
                <p className="text-sm text-gray-600">DISSERTATIONS</p>
              </div>

              <div className="flex-1 p-4 rounded-lg text-center bg-white shadow">
                <span className="block text-2xl font-bold text-[#3772FF]">
                  100+
                </span>
                <p className="text-sm text-gray-600">PARTNERS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CAMPUSES ================= */}
      <div className="py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our Campuses
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {campuses.map((campus) => (
              <div
                key={campus.id}
                className="p-6 rounded-xl text-center bg-white shadow transition-all duration-300 hover:bg-[#3772FF] hover:text-white hover:scale-105 cursor-pointer"
              >
                <h3 className="text-lg font-semibold">
                  {campus.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CEO SECTION ================= */}
        <div className="py-16 px-4 md:px-10 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">

            {/* IMAGE */}
            <div className="flex-1">
            <img
                src="https://i.pinimg.com/736x/dc/88/cf/dc88cfc787a46f8987fa9b00d111746b.jpg"
                alt="CEO"
                className="w-full max-w-sm mx-auto rounded-xl shadow-md object-cover"
            />
            </div>

            {/* TEXT */}
            <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                A Word from Our CEO
            </h2>

            <p className="text-gray-700 mb-4">
                At Uganda Martyrs University, we have always believed that education is not only about acquiring knowledge, but about sharing it for the greater good of society. Every dissertation written by our students carries ideas, solutions, and innovations that can shape communities and transform lives.
            </p>

            <p className="text-gray-700 mb-4">
                For too long, valuable academic work has remained hidden in shelves and archives, accessible to only a few. With Dis-Hub, we are changing that narrative. We are opening doors, giving visibility to student research, and ensuring that the hard work of our scholars reaches beyond campus walls.
            </p>

            <p className="text-gray-700 mb-4">
                This platform represents our commitment to academic excellence, collaboration, and digital transformation. It is a step toward making Uganda Martyrs University not just a center of learning, but a global contributor to knowledge.
            </p>

            <div>
                <p className="font-semibold text-[#3772FF]">— Maria Nankinga</p>
                <p className="text-sm text-gray-500">Chief Executive Officer, Dis-Hub</p>
            </div>

            {/* subtle accent line */}
            <div className="mt-4 w-16 h-1 bg-[#3772FF]"></div>
            </div>

        </div>
        </div>

    </section>
  );
}