import Image from "next/image";

const data = [
  {
    course: "COMPUTER SCIENCE",
    heading: "Scalable Neural Architectures for Edge Computing Devices",
    paragraph:
      "This research explores the effiency of light-weight neural networks in low-power...",
    date: "03/10/2023",
    image:
      "https://i.pinimg.com/1200x/0b/2e/98/0b2e988dcec7af0209aa42d919c6967b.jpg",
    name: "Dr. Nankinga Maria",
    campus: "Nkozi",
  },
  {
    course: "AGRICULTURE",
    heading: "The Importance of Irrigation in Modern Agriculture",
    paragraph:
      "Irrigation is the practice of supplying water to crops when there is not enough rain. It helps pl...",
    date: "08/12/2025",
    image:
      "https://i.pinimg.com/736x/6b/c3/ff/6bc3ff27cfac1303e584089abf391605.jpg",
    name: "Kiboja Peter",
    campus: "Lubaga",
  },
  {
    course: "SOCIOLOGY",
    heading: "The Digital Divide in Post-Pandemic Urban Education",
    paragraph:
      "Analyzing the economic barriers to remote learning accessibility in metropolitan districts...",
    date: "21/11/2024",
    image:
      "https://i.pinimg.com/736x/6e/1c/c4/6e1cc4cc72a5cef35be0eda605c8e46b.jpg",
    name: "Magezi Mary Jane",
    campus: "Masaka",
  },
];

export default function Featured() {
  return (
    <section className="bg-[#EFEFEF] w-full py-16">
      <div className="max-w-[90%] mx-auto">

        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-black">
            Featured dissertations
          </h2>
          <p className="font-body text-black mt-2">
            Curated high-impact research from the last month
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* COURSE TAG */}
              <span className="text-[#3772FF] bg-[#3772FF4D] px-3 py-1 text-sm font-bold rounded-sm">
                {item.course}
              </span>

              {/* TITLE */}
              <h3 className="font-heading text-xl font-bold text-black mt-4">
                {item.heading}
              </h3>

              {/* DESCRIPTION */}
              <p className="font-body text-black mt-3 text-sm">
                {item.paragraph}
              </p>

              {/* DATE */}
              <p className="text-xs text-gray-600 mt-3">
                Posted On: {item.date}
              </p>

              {/* AUTHOR */}
              <div className="flex items-center gap-3 mt-4">

                {/* IMAGE */}
                <div className="w-10 h-10 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div>
                  <p className="font-body font-bold text-black text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.campus}
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}