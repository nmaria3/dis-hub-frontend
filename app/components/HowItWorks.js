import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFileArrowDown,
  faQuoteLeft,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";

const data = [
  {
    icon: faMagnifyingGlass,
    heading: "1. Search",
    paragraph:
      "Use our powerful filters to find dissertations by topic, author or campus.",
  },
  {
    icon: faFileArrowDown,
    heading: "2. Download",
    paragraph:
      "Access the full PDF of the research paper instantly upon authentication",
  },
  {
    icon: [faQuoteLeft, faQuoteRight],
    heading: "3. Cite",
    paragraph:
      "Get pre-formatted citations for your own work in APA, MLA or even Harvard Style",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#EFEFEF] w-full py-16">
      <div className="max-w-[90%] mx-auto text-center">

        {/* HEADER */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-black">
          How it Works
        </h2>

        <p className="font-body text-black mt-3 max-w-2xl mx-auto">
          Simple steps to access global research for your academic journey.
        </p>

        {/* CARDS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="bg-transparent p-6 rounded-lg text-center"
            >

              {/* ICON */}
              <div className="text-[#3772FF] text-4xl mb-4 flex justify-center gap-2">
                {Array.isArray(item.icon) ? (
                  item.icon.map((ic, i) => (
                    <FontAwesomeIcon key={i} icon={ic} />
                  ))
                ) : (
                  <FontAwesomeIcon icon={item.icon} />
                )}
              </div>

              {/* TITLE */}
              <h3 className="font-heading text-xl font-bold text-black">
                {item.heading}
              </h3>

              {/* TEXT */}
              <p className="font-body text-black mt-3 text-sm max-w-xs mx-auto">
                {item.paragraph}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}