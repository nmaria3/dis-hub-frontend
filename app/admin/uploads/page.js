"use client";

import { useEffect, useState, useRef } from "react";
import { useFetchImages } from "../utils/useFetchImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

export default function Uploads() {
  const { images, uniData, loading, error } = useFetchImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    methodology: "",
    abstract: "",
    campus: "",
    faculty: "",
    course: "",
    supervisor: "",
    pages: "",
    license: "",
  });

  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  // Set a random image on first load
  useEffect(() => {
    console.log("Uni Data: ", uniData)
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentIndex(randomIndex);
    }
  }, [images]);

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClickImage = () => {
    if (images.length === 0) return;
    console.log("Selected image_url:", images[currentIndex].image_url);
  };
  
  const fileInputRef = useRef(null);

  // 📂 Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      console.error("Only PDF files are allowed");
      return;
    }

    setSelectedFile(file); // ✅ store file for UI

    console.log("Selected File:", file);
    console.log("File Name:", file.name);

    const size =
      file.size / 1024 / 1024 >= 1
        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(2)} KB`;

    console.log("File Size:", size);
  };

  // 🖱️ Click button → open file picker
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 📥 File input change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // 🖐️ Drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 📦 Drop file
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleCampusChange = (e) => {
    const campusId = Number(e.target.value);
    setFormData({ ...formData, campus: campusId, faculty: "", course: "" });

    const selected = uniData.find((c) => c.id === campusId);
    setFaculties(selected ? selected.faculties : []);
    setCourses([]);
  };

  const handleFacultyChange = (e) => {
    const facultyId = Number(e.target.value);
    setFormData({ ...formData, faculty: facultyId, course: "" });

    const selected = faculties.find((f) => f.id === facultyId);
    setCourses(selected ? selected.courses : []);
  };

  const handlePublish = () => {
    if (images.length === 0) return;

    const selectedImage = images[currentIndex];

    const selectedCampus = uniData.find(
      (c) => c.id === Number(formData.campus)
    );

    const selectedFaculty = faculties.find(
      (f) => f.id === Number(formData.faculty)
    );

    const selectedCourse = courses.find(
      (c) => c.id === Number(formData.course)
    );

    const fullData = {
      ...formData,
      image_url: selectedImage?.image_url,
      file: selectedFile,
      campus_name: selectedCampus?.name,
      faculty_name: selectedFaculty?.name,
      course_name: selectedCourse?.name,
    };

    console.log("🔥 FINAL COMBINED DATA:", fullData);
  };

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error loading images: {error}</p>;
  if (images.length === 0) return <p>No images available.</p>;


  return (
    <section className="p-6 text-center">
      <h1 className="text-3xl font-heading font-bold mb-4">Upload Dissertation</h1>

     <p className="text-gray-600 mb-6">
        Welcome to the dissertation upload portal! Here you can easily share your research work with the academic community. Simply fill out the form below, upload your PDF document, and publish your dissertation for others to discover and cite. Let's contribute to the world of knowledge together! 🚀
      </p>

      <h3 className="text-3xl font-heading font-bold mb-4">Select an image</h3>
      <div className="mb-4">
        <img
          src={images[currentIndex].image_url}
          alt={`Image ${currentIndex + 1}`}
          className="mx-auto max-h-96 cursor-pointer rounded shadow-lg"
          onClick={handleClickImage}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      <p className="mt-2 text-gray-500">
        Image {currentIndex + 1} of {images.length}
      </p>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mt-10 p-8 w-[90%] border-2 border-dashed border-gray-300 rounded-lg text-center bg-white shadow-md mx-auto"
      >
        {/* 📄 ICON */}
        <div className="text-6xl text-gray-400 mb-4">
          <FontAwesomeIcon icon={faFile} />
        </div>

        {/* 📝 TITLE */}
        <h2 className="text-xl font-semibold mb-2">
          Upload PDF Document
        </h2>

        {/* 📌 DESCRIPTION */}
        <p className="text-gray-500 mb-4">
          Drag and drop your PDF document here.
        </p>

        {/* 📂 BUTTON */}
        <button
          onClick={handleButtonClick}
          className="px-6 py-2 text-white rounded-md"
          style={{ backgroundColor: "#3772FF" }}
        >
          SELECT FILE
        </button>

        {/* 🔒 HIDDEN INPUT */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg max-w-md mx-auto text-left">
          <h3 className="text-green-700 font-semibold mb-2">
            ✅ File Selected Successfully
          </h3>

          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {selectedFile.name}
          </p>

          <p className="text-sm text-gray-700">
            <strong>Size:</strong>{" "}
            {selectedFile.size / 1024 / 1024 >= 1
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
              : `${(selectedFile.size / 1024).toFixed(2)} KB`}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Ready for upload 🚀
          </p>
        </div>
      )}

      <div className="bg-[#EFEFEF] p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">

          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">
            Upload Dissertation
          </h1>

          {/* TITLE */}
          <input
            type="text"
            placeholder="Dissertation Title"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3772FF]"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* AUTHOR */}
          <input
            type="text"
            placeholder="Author Name"
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />

          {/* METHODOLOGY */}
          <textarea
            placeholder="Research Methodology..."
            rows={5}
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
          />

          {/* ABSTRACT */}
          <textarea
            placeholder="Abstract..."
            rows={5}
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
          />

          {/* CAMPUS */}
          <select
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={handleCampusChange}
          >
            <option value="">Select Campus</option>
            {uniData.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>

          {/* FACULTY */}
          <select
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={handleFacultyChange}
          >
            <option value="">Select Faculty</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* COURSE */}
          <select
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, course: Number(e.target.value) })
            }
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* SUPERVISOR */}
          <input
            type="text"
            placeholder="Supervisor"
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
          />

          {/* PAGES */}
          <input
            type="number"
            placeholder="Number of Pages"
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
          />

        {/* LICENSES & USAGE RIGHTS */}
          <textarea
            placeholder="Licenses and Usage Rights..."
            rows={5}
            className="w-full mb-6 p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
          />

          {/* BUTTON */}
          <button
            onClick={handlePublish}
            className="w-full bg-[#3772FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Publish Dissertation
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6 p-4 border rounded border-[#3772FF]">
          <h2 className="text-xl font-bold mb-2">Preview</h2>

          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>Author:</strong> {formData.author}</p>

          <p><strong>Campus:</strong> {
            uniData.find(c => c.id == formData.campus)?.name
          }</p>

          <p><strong>Faculty:</strong> {
            faculties.find(f => f.id == formData.faculty)?.name
          }</p>

          <p><strong>Course:</strong> {
            courses.find(c => c.id == formData.course)?.name
          }</p>

          <p><strong>File:</strong> {selectedFile?.name || "No file selected"}</p>

          <div className="flex justify-center items-center">
            <img
              src={images[currentIndex]?.image_url}
              alt="preview"
              className="mt-4 w-40 rounded"
            />
          </div>
        </div>
      )}
    </section>
  );
}