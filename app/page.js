import Hero from "./components/Hero";
import Featured from "./components/Featured";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import Quote from "./components/Quote";

export default function Home() {
  return (
    <main>
      <Hero />
      <Featured />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Quote />
    </main>
  )
}