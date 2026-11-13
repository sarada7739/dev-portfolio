import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <Container className="hero-grid">
        <div className="hero-copy assemble from-left delay-1">
          <p className="eyebrow">個人開発ポートフォリオ</p>
          <h1 className="sr-only">sarada7739 の個人開発ポートフォリオ</h1>
          <p className="hero-intro">
            <span className="text-chunk">Webアプリ、</span>
            <span className="text-chunk">モバイルアプリ、</span>
            <br />
            <span className="text-chunk">Steam向けゲーム。</span>
          </p>
          <p className="hero-description">
            企画から実装まで個人で開発しています。
          </p>
          <div className="hero-actions">
            <Button href="#works" arrow="↓">
              制作物を見る
            </Button>
            <Button href="#contact" tone="secondary" arrow="→">
              お問い合わせ
            </Button>
          </div>
        </div>
        <div className="hero-visual assemble from-right" aria-hidden="true">
          <Image
            src="/images/neon-hero.png"
            alt=""
            width={1536}
            height={1024}
            priority
            fetchPriority="high"
            sizes="(min-width: 1296px) 796px, (min-width: 1024px) calc(66.3vw - 64px), (min-width: 768px) calc(62.5vw - 40px), (min-width: 584px) 544px, calc(100vw - 40px)"
          />
        </div>
      </Container>
    </section>
  );
}
