"use client";

import { useState } from "react";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      category: "General",
      question: "What is Dis-Hub?",
      answer:
        "Dis-Hub is a digital platform by Uganda Martyrs University that provides open access to student dissertations, making academic research accessible to a wider audience.",
    },
    {
      category: "General",
      question: "Who can use Dis-Hub?",
      answer:
        "Students, lecturers, researchers, and anyone interested in academic research can explore dissertations on Dis-Hub.",
    },
    {
      category: "Uploads",
      question: "Who is allowed to upload dissertations?",
      answer:
        "Only authorized administrators can upload and manage dissertations to ensure quality and authenticity of academic content.",
    },
    {
      category: "Uploads",
      question: "Why do I need to fill in dissertation details?",
      answer:
        "Metadata such as title, author, and methodology helps make research searchable and easier to discover globally.",
    },
    {
      category: "Access",
      question: "Are dissertations free to access?",
      answer:
        "Yes. Dis-Hub promotes open access to knowledge, allowing users to view and download dissertations freely for academic purposes.",
    },
    {
      category: "Access",
      question: "Can I download dissertations?",
      answer:
        "Yes, provided the dissertation license allows it. Some may have restrictions depending on usage rights.",
    },
    {
      category: "Security",
      question: "How is my data protected?",
      answer:
        "We use secure authentication powered by Clerk and follow best practices to protect user data and prevent unauthorized access.",
    },
    {
      category: "Academic",
      question: "Can I cite dissertations from Dis-Hub?",
      answer:
        "Absolutely. Each dissertation includes citation formats to support academic referencing.",
    },
    {
      category: "Academic",
      question: "Does Dis-Hub verify uploaded research?",
      answer:
        "Yes. All uploads are reviewed and managed by administrators to maintain academic integrity.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#EFEFEF] min-h-screen px-4 md:px-10 py-10 text-black">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600">
          Find answers to common questions about Dis-Hub and how it works.
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#3772FF]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ LIST */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredFAQs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 transition"
          >
            {/* QUESTION */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggle(index)}
            >
              <div>
                <p className="text-xs text-[#3772FF] font-semibold mb-1">
                  {faq.category}
                </p>
                <h3 className="font-medium text-lg">
                  {faq.question}
                </h3>
              </div>

              <span className="text-[#3772FF] text-xl">
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>

            {/* ANSWER */}
            {activeIndex === index && (
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredFAQs.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No questions found.
        </p>
      )}

    </section>
  );
}