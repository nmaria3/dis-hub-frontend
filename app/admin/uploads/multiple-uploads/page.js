"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function MultipleUploads() {
  const { getToken } = useAuth();

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Waiting...");
  const router = useRouter();
  const pollingRef = useRef(null);

  // =========================
  // 📥 FETCH FILES FROM SERVER
  // =========================
  const fetchFiles = async () => {
    const token = await getToken();

    const res = await fetch("http://localhost:5000/admin/uploads", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUploadedFiles(data.files);
  };

  let intervalId; // ✅ store interval

  const startPolling = () => {
    // 🚫 Prevent multiple intervals
    if (pollingRef.current) {
      console.log("⚠️ Polling already running");
      return;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://localhost:5000/admin/upload-status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        console.log("📡 STATUS:", data);

        setProgress(data.progress);
        setMessage(data.message);

        // ✅ STOP CONDITION
        if (data.progress === 100) {
          console.log("🛑 Stopping polling...");

          clearInterval(pollingRef.current);
          pollingRef.current = null; // 🔥 VERY IMPORTANT
        }

      } catch (err) {
        console.error("Polling error:", err);

        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 2000);
  };

  startPolling();

  useEffect(() => {
    fetchFiles();

    // =========================
    // 🧹 CLEANUP (VERY IMPORTANT)
    // =========================
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

  }, []);

  // =========================
  // 📂 HANDLE FILE SELECTION
  // =========================
  const handleFiles = (selectedFiles) => {
    const pdfs = Array.from(selectedFiles).filter(
      (file) => file.type === "application/pdf"
    );

    setFiles((prev) => [...prev, ...pdfs]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // =========================
  // 🚀 UPLOAD
  // =========================
  const handleUpload = async () => {
    if (files.length === 0) return;

    const token = await getToken();
    const form = new FormData();
    files.forEach((file) => form.append("files", file));

    const res = await fetch("http://localhost:5000/admin/multiple-upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    console.log("Uploaded:", data);

    setFiles([]); // clear selected files
    fetchFiles(); // refresh uploaded files    
  };

  // =========================
  // ❌ DELETE FILE
  // =========================
  const handleDelete = async (filename) => {
    const token = await getToken();

    await fetch(`http://localhost:5000/admin/uploads/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchFiles(); // refresh
  };

  // =========================
  // 📝 PUBLISH
  // =========================
  const handlePublish = async () => {
      console.log("Publishing files...", { files, uploadedFiles });
      // Implement your publish logic here (send to DB, Cloudinary, etc.)
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/admin/publish", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("Publish Response:", data);

      if (!res.ok) {
        alert(data.message || "Failed to start upload");
        return;
      }

      startPolling(); // start polling for status updates
      alert("🚀 Upload has started!");


    } catch (err) {
      console.error("Publish error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6">File Manager</h1>

        {/* DRAG & DROP */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`p-10 border-2 border-dashed rounded-xl text-center mb-6 transition-all ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
          }`}
        >
          <p className="font-semibold mb-2">Drag & Drop PDFs</p>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="mt-2"
          />
        </div>

        {/* SELECTED FILES */}
        {files.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Files Ready to Upload</h2>
            <div className="bg-white p-4 rounded shadow space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex justify-between">
                  <span>{file.name}</span>
                  <span className="text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              className="mt-4 w-full py-3 text-white rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Upload Selected Files
            </button>
          </div>
        )}

        <div className="w-full max-w-xl mx-auto mt-6">
          {/* Message */}
          <p className="text-center text-black mb-2 font-semibold">
            {message}
          </p>

          {/* Progress Bar Container */}
          <div
            className="w-full h-4 rounded-full overflow-hidden"
            style={{ backgroundColor: "#EFEFEF" }}
          >
            {/* Progress Fill */}
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: "#3772FF",
              }}
            ></div>
          </div>

          {/* Percentage */}
          <p className="text-center text-sm mt-2 text-gray-600">
            {progress}%
          </p>

        </div>

        {/* SERVER FILES */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6 px-4 md:px-0">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded shadow flex flex-row justify-between items-center min-w-0"
                >
                  <div className="min-w-0 mr-4">
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">{file.size}</p>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISH BUTTON */}
        {(files.length > 0 || uploadedFiles.length > 0) && (
          <button
            onClick={handlePublish}
            className="w-full py-3 text-white rounded bg-green-600 hover:bg-green-700 transition"
          >
            Publish All Files
          </button>
        )}
      </div>
    </div>
  );
}