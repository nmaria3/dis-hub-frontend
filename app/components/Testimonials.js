import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const data = [
  {
    text: "Finding past dissertations used to take weeks in the library. This platform helped me access relevant research within minutes. It saved me so much time during my final year project",
    image:
      "https://i.pinimg.com/1200x/8c/73/cb/8c73cbf28dfb4375e8839253d04890d8.jpg",
    name: "Sarah K",
    course: "Computer Science student",
  },
  {
    text: "This platform is a valuable resource for any UMU student. I was able to download several dissertations that guided me while writing my own research paper.",
    image:
      "https://i.pinimg.com/736x/39/f4/50/39f450d3c00bab2a0b6480de07f79256.jpg",
    name: "Peter Kiwanuka",
    course: "BAM student",
  },
  {
    text: "The search system is very easy to use and the collection of dissertations is impressive. It helped me understand how previous students structured their research work.",
    image:
      "https://i.pinimg.com/736x/f6/0b/00/f60b00e3107bab7c1455927adf633dfe.jpg",
    name: "Linda Nambi",
    course: "Information Tech. student",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#EFEFEF] w-full py-16">
      <div className="max-w-[90%] mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-black">
            What Our Researchers Say About Us
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >

              {/* STARS */}
              <div className="flex gap-1 text-[#3772FF] mb-4">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>

              {/* TEXT */}
              <p className="font-body text-black italic text-sm leading-relaxed">
                "{item.text}"
              </p>

              {/* USER */}
              <div className="flex items-center gap-3 mt-6">

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
                    {item.course}
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