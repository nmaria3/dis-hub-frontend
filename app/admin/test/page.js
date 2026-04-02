"use client";

import { useState } from "react";

export default function TestPage() {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:5000/admin/test-extract", {
      method: "POST",
      body: form,
    });

    const result = await res.json();
    console.log(result);
    setData(result);
  };

  const handleLocalUpload = async () => {
        if (!file2) return;

        console.log("📄 File2:", file2);

        const form = new FormData();
        form.append("file", file2);

        console.log("📄 FormData:", form);
        try {

            const res = await fetch("http://localhost:5000/admin/local-pdf-test-extract", {
            method: "POST",
            body: form,
            });

            const result = await res.json();

            console.log("📄 Extracted (LOCAL):", result);

            // Optional → store it
            setData2(result.extracted);

        } catch (err) {
            console.error("Upload failed:", err);
        }
    };
  return (
    <div style={{ padding: "40px" }}>
      <h1>PDF Test Extract</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} className="p-2 bg-amber-700">Upload & Extract</button>

            {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}

        <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile2(e.target.files[0])}
        />
        <button
            onClick={handleLocalUpload}
            className="mt-4 px-6 py-2 bg-[#3772FF] text-white rounded"
        >
            Test Local Extract
        </button>

            {data2 && (
        <pre>{JSON.stringify(data2, null, 2)}</pre>
      )}

    </div>
  );
}