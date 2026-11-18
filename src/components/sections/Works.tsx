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
          {works.map((work) => (
            <div key={work.slug} className="work-entry">
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
