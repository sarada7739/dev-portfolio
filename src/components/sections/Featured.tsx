import Image from "next/image";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import { featured } from "@/data";

export default function Featured() {
  return (
    <section
      id="works"
      className="featured-section section"
      aria-labelledby="works-heading"
    >
      <Container>
        <h2 className="section-title" id="works-heading">
          制作物
        </h2>
        <div className="featured-project">
          <div className="featured-art">
            <Image
              src={featured.photo}
              alt="海辺で夕日を眺めるふたり"
              fill
              sizes="(min-width: 1440px) 700px, (min-width: 760px) 54vw, 100vw"
              className="featured-photo"
            />
            <Image
              src={featured.phoneFrame}
              alt="Nisoine のホーム画面"
              width={359}
              height={714}
              sizes="(min-width: 760px) 200px, 27vw"
              className="featured-phone"
            />
          </div>
          <div className="featured-copy">
            <h3 lang="en">Nisoine</h3>
            <p className="featured-summary">
              <span>ふたりの日常を</span>
              <span>記録するアプリ。</span>
            </p>
            <p className="muted-text">{featured.description}</p>
            <div className="tag-list">
              {featured.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            <a
              href={featured.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Nisoineを{featured.ctaLabel}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
