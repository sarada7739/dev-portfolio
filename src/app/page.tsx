import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Featured from "@/components/sections/Featured";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section id="works" className="bg-cream pb-6">
          <Container>
            <SectionLabel label="制作物" />
          </Container>
        </section>
        <Featured />
      </main>
    </>
  );
}
