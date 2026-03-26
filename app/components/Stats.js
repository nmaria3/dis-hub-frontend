const data = [
  {
    value: "100+",
    text: "DISSERTATIONS",
  },
  {
    value: "5",
    text: "CAMPUSES",
  },
  {
    value: "1K+",
    text: "DOWNLOADS",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#3772FF] w-full py-16">
      <div className="max-w-[90%] mx-auto">

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          {data.map((item, index) => (
            <div
              key={index}
              className="bg-transparent p-6 rounded-lg"
            >
              {/* BIG NUMBER */}
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">
                {item.value}
              </h2>

              {/* LABEL */}
              <p className="font-body text-[#EFEFEF] mt-2 text-sm tracking-wide">
                {item.text}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}