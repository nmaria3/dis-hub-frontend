"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function CompleteProfile() {
  const { isLoaded, getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const hasFetchedProfileData = useRef(false);
  const hasSyncedWithBackend = useRef(false);

  const [stop, setStop] = useState(false)

  const [campusesData, setCampusesData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({
    registration_number: "",
    phone_number: "",
  });

  // =========================
  // SYNC USER WITH BACKEND ONCE
  // =========================
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasSyncedWithBackend.current) return;

    hasSyncedWithBackend.current = true;

    const syncUser = async () => {

      const adminRedirected = sessionStorage.getItem("adminRedirected");
      if (adminRedirected) {
        sessionStorage.removeItem("adminRedirected");
        return;
      }

      // 🚫 already executed → stop
      if (stop) {
        console.log("Already executed. Skipping...");
        return;
      }

      // if(true) return; // Stop here

      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Error syncing user.", { position: "top-center" });
          await signOut();
          return;
        }

        toast.success(data.message || "User synced successfully.", { position: "top-center" });

        // ✅ IMPORTANT: mark as executed AFTER success
        setStop(true);

        // alert("Message: " + data.message); // Debug alert for message

        if (data.message === "Admin already registered")
        {
          alert("Admin already registered. Redirecting to admin dashboard..."); // Debug alert for admin case
          setTimeout(() => {
            // Store in sessionStorage to prevent infinite loop if backend keeps responding with "Admin already registered"
            sessionStorage.setItem("adminRedirected", "true");
            if (data.redirect) window.location.href = data.redirect;
          }, 1000); // 1 seconds delay for better UX
        }

        if (data.message === "Profile complete") {
          setTimeout(() => {
            if (data.redirect) window.location.href = "/students/dashboard";
          }, 3000); // 3 seconds delay for better UX
        }

      } catch (err) {
        console.error("User sync error:", err);
        toast.error("Network error during user sync.", { position: "top-center" });
        await signOut();
      }
    };

    setTimeout(() => {
      syncUser();
    }, 5000);
  }, [isLoaded, isSignedIn, user, getToken, signOut]);

  // =========================
  // FETCH CAMPUS/FACULTY/COURSE DATA ONCE
  // =========================
  useEffect(() => {
    if (!isLoaded || !user || hasFetchedProfileData.current) return;

    hasFetchedProfileData.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/complete-profile-data");
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const result = await res.json();
        setCampusesData(result.data);
      } catch (err) {
        console.error("Profile data fetch error:", err);
        toast.error("Failed to load profile options.", { position: "top-center" });
      }
    };

    fetchData();
  }, [isLoaded, user]);

  // =========================
  // HANDLE SELECTION CHANGES
  // =========================
  const handleCampusChange = (e) => {
    const campusId = Number(e.target.value);
    setSelectedCampus(campusId);

    const campus = campusesData.find((c) => c.id === campusId);
    setFaculties(campus ? campus.faculties : []);
    setCourses([]);
    setSelectedFaculty("");
    setSelectedCourse("");
  };

  const handleFacultyChange = (e) => {
    const facultyId = Number(e.target.value);
    setSelectedFaculty(facultyId);

    const faculty = faculties.find((f) => f.id === facultyId);
    setCourses(faculty ? faculty.courses : []);
    setSelectedCourse("");
  };

  // =========================
  // SUBMIT PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not ready.", { position: "top-center" });
      return;
    }

    const finalData = {
      clerkId: user.id,
      registration_number: formData.registration_number,
      phone_number: formData.phone_number,
      campus_id: selectedCampus,
      faculty_id: selectedFaculty,
      course_id: selectedCourse,
    };

    const confirmSubmit = confirm("Are you sure you want to submit your profile?");
    if (!confirmSubmit) return;

    try {
      const res = await fetch("http://localhost:5000/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to submit profile.", { position: "top-center" });
        return;
      }

      toast.success(data.message || "Profile updated successfully!", { position: "top-center" });

      if (data.redirect) window.location.href = data.redirect;
    } catch (err) {
      console.error("Profile submit error:", err);
      toast.error("Network error. Try again later.", { position: "top-center" });
    }
  };

  return (
    <div style={{ backgroundColor: "#EFEFEF", minHeight: "100vh", padding: "40px" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          <i className="fas fa-user-graduate"></i> Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Registration Number"
            value={formData.registration_number}
            onChange={(val) => setFormData({ ...formData, registration_number: val })}
          />

          <InputField
            label="Phone Number"
            value={formData.phone_number}
            onChange={(val) => setFormData({ ...formData, phone_number: val })}
          />

          <SelectField label="Campus" value={selectedCampus} onChange={handleCampusChange} options={campusesData} />

          <SelectField label="Faculty" value={selectedFaculty} onChange={handleFacultyChange} options={faculties} />

          <SelectField label="Course" value={selectedCourse} onChange={(e) => setSelectedCourse(Number(e.target.value))} options={courses} />

          <button type="submit" style={buttonStyle}>
            <i className="fas fa-check"></i> Submit Profile
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================
// INPUT & SELECT COMPONENTS
// =========================
const InputField = ({ label, value, onChange }) => (
  <div style={{ marginBottom: "15px" }}>
    <label>{label}</label>
    <input
      type="text"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: "15px" }}>
    <label>{label}</label>
    <select required value={value} onChange={onChange} style={inputStyle}>
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

// =========================
// STYLES
// =========================
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#3772FF",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};