import Container from "@/components/ui/Container";
import WorkGallery from "@/components/ui/WorkGallery";
import { works } from "@/data";

export default function Works() {
  if (!works.length) return null;
  return (
    <section
      id="works-all"
      className="section works-section"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <WorkGallery items={works} />
      </Container>
    </section>
  );
}
