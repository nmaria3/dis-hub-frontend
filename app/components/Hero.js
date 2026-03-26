import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#EFEFEF] w-full">
      <div className="max-w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between py-16 gap-10">

        {/* LEFT SIDE */}
        <div className="flex-1 text-center md:text-left">
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-black leading-tight">
            Unlocking Global{" "}
            <span className="text-[#3772FF]">
              Academic Excellence
            </span>
          </h1>

          <p className="font-body text-black mt-6 text-lg max-w-xl">
            Search and access thousands of peer-reviewed dissertations and research papers from Uganda Martyrs University.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex justify-center">
          <div className="w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px]">
            <Image
              src="https://i.pinimg.com/736x/76/3f/7f/763f7f24a578fc1d7b1f04bbe3473555.jpg"
              alt="Students studying"
              width={500}
              height={500}
              priority
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </div>

      </div>
    </section>
  );
}