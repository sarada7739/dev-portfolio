import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { site } from "@/data";

export default function Hero() {
  const taglineLines = site.tagline.split("\n");

  return (
    <section className="bg-cream pb-16 pt-12">
      <Container>
        <h1 className="font-serif text-display text-ink">
          {taglineLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < taglineLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <p className="mt-4 text-small text-gray">{site.sub}</p>
        <div className="mt-8">
          <Button href="#works" arrow="↓">
            制作物を見る
          </Button>
        </div>
      </Container>
    </section>
  );
}
