import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Featured from "@/components/sections/Featured";
import Works from "@/components/sections/Works";
import HowIWork from "@/components/sections/HowIWork";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <a href="#works" className="skip-link">
        制作物へ移動
      </a>
      <Header />
      <main>
        <Hero />
        <Featured />
        <Works />
        <HowIWork />
      </main>
      <Footer />
    </>
  );
}
