import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import WorkCard from "@/components/ui/WorkCard";
import { works } from "@/data";

// 「その他の制作物」一覧グリッド
export default function Works() {
  return (
    <section id="works-all" className="bg-cream pb-6.5 pt-3.25">
      <Container>
        <SectionLabel label="その他の制作物" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {works.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </Container>
    </section>
  );
}
