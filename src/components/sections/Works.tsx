import Container from "@/components/ui/Container";
import WorkCard from "@/components/ui/WorkCard";
import { works } from "@/data";

export default function Works() {
  return (
    <section
      id="works-all"
      className="section works-section"
      aria-label="その他の制作物"
    >
      <Container>
        <div className="works-grid">
          {works.map((work, index) => (
            <div
              key={work.slug}
              className={`work-entry assemble ${index % 2 === 0 ? "from-left" : "from-right"} delay-${Math.min(index + 2, 6)}`}
            >
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
