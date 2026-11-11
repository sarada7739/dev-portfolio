import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { featured } from "@/data";

export default function Featured() {
  return (
    <section id="works" className="section featured-section">
      <Container>
        <div className="section-heading assemble from-left delay-2">
          <h2>制作物</h2>
          <span className="section-note">個人開発のプロジェクト</span>
        </div>
        <div className="featured-panel glass-panel assemble from-right delay-3">
          <div className="featured-art">
            <Image
              src={featured.photo}
              alt="海辺で夕日を眺めるふたり"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="featured-photo"
            />
            <Image
              src={featured.phoneFrame}
              alt="Nisoine のホーム画面"
              width={359}
              height={714}
              sizes="200px"
              className="featured-phone"
            />
          </div>
          <div className="featured-copy">
            <p className="eyebrow">{featured.label}</p>
            <h3>Nisoine</h3>
            <p className="featured-summary">
              <span className="text-chunk">ふたりの日常を</span>
              <span className="text-chunk">記録するアプリ。</span>
            </p>
            <p className="muted-text">{featured.description}</p>
            <div className="tag-list">
              {featured.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            <Button href={featured.ctaHref} arrow="→" external>
              {featured.ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
