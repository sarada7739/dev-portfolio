import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { site } from "@/data";

export default function Hero() {
  const taglineLines = site.tagline.split("\n");

  return (
    <section className="bg-cream pb-9.25 pt-10">
      <Container>
        <h1 className="text-balance font-serif text-display text-ink">
          {taglineLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < taglineLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <p className="mt-7 text-lead text-ink-soft">{site.sub}</p>
        <div className="mt-7">
          <Button href="#works" arrow="↓">
            制作物を見る
          </Button>
        </div>
      </Container>
    </section>
  );
}
