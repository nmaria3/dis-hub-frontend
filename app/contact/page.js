"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Message sent successfully 🎉");
        setSuccess(data.message || "Message sent successfully 🎉");
        setForm({
          full_name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSuccess(data.message || "Failed to send message ❌");
        toast.error(data.message || "Failed to send message ❌")
    }
} catch (err) {
    console.error(err);
    setSuccess("Something went wrong ❌");
    toast.error("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <section className="bg-[#EFEFEF] min-h-screen px-4 md:px-10 py-10 text-black">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600">
          Have questions or feedback? Reach out to us and we’ll get back to you.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT INFO */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Get in Touch
          </h2>

          <p className="text-gray-600 mb-4">
            Whether you have a question about dissertations, access, or anything else, our team is ready to help.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Email:</strong> maria.admin.umu@gmail.com</p>
            <p><strong>Location:</strong> Uganda Martyrs University, Nkozi</p>
            <p><strong>Support:</strong> Mon - Fri, 8:00 AM - 5:00 PM</p>
          </div>

          <div className="mt-6 w-16 h-1 bg-[#3772FF]"></div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3772FF]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            name="message"
            placeholder="Your Message..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold"
            style={{ backgroundColor: "#3772FF" }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {success}
            </p>
          )}
        </form>

      </div>

      {/* ================= QUICK HELP ================= */}
        <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
            Before You Reach Out
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
            {[
            {
                title: "Uploading Issues",
                desc: "Ensure your file is a PDF and under 10MB before uploading.",
            },
            {
                title: "Access Problems",
                desc: "Make sure you're signed in to access dissertations.",
            },
            {
                title: "Incorrect Data",
                desc: "Contact admin if any dissertation details are inaccurate.",
            },
            ].map((item, i) => (
            <div
                key={i}
                className="bg-white p-4 rounded-lg shadow text-center"
            >
                <h3 className="font-semibold text-[#3772FF] mb-2">
                {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                {item.desc}
                </p>
            </div>
            ))}
        </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16 bg-white p-6 rounded-xl shadow text-center">
        <h2 className="text-xl font-bold mb-2">
            What Happens Next?
        </h2>

        <p className="text-gray-600">
            Once you send your message, our team will review it and respond within 24–48 hours during working days. 
            For urgent academic matters, we recommend contacting your faculty directly.
        </p>

        <div className="mt-4 w-16 h-1 bg-[#3772FF] mx-auto"></div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
            Uganda Martyrs University
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
            Dis-Hub is proudly built within Uganda Martyrs University, Nkozi — a center of academic excellence committed to research, innovation, and knowledge sharing across Uganda and beyond.
        </p>

        <div className="mt-4 w-16 h-1 bg-[#3772FF] mx-auto"></div>
        </div>
    </section>
  );
}