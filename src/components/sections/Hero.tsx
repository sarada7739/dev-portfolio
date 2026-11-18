import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ParticleArtwork from "@/components/particles/ParticleArtwork";
import { site } from "@/data";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="portfolio-title">
      <Container className="hero-grid">
        <div className="hero-copy">
          <p className="signature" lang="en">
            {site.author}
          </p>
          <h1 className="hero-title" id="portfolio-title" lang="en">
            Developer
            <br />
            Portfolio<span>.</span>
          </h1>
          <p className="hero-description">
            Webアプリ、モバイルアプリ、Steam向けゲームを
            <br className="hero-break" />
            企画から実装まで個人で開発しています。
          </p>
          <div className="hero-actions">
            <Button href="#works" arrow="↓">
              制作物を見る
            </Button>
            <a className="text-link" href="#how-i-work">
              開発について<span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <ParticleArtwork />
      </Container>
    </section>
  );
}
