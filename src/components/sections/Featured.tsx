import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { featured } from "@/data";

// 主力プロダクト Nisoine の紹介ブロック
export default function Featured() {
  const headingLines = featured.heading.split("\n");

  return (
    <section className="border-b border-blush-edge bg-blush py-section-sm md:py-section">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="text-label tracking-label text-coral">{featured.label}</p>
          <h3 className="mt-3 font-serif text-h1 text-ink">
            {headingLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < headingLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h3>
          <p className="mt-4 text-small text-gray">{featured.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {featured.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <div className="mt-6">
            <Button href={featured.ctaHref} arrow="→">
              {featured.ctaLabel}
            </Button>
          </div>
        </div>
        <div className="lg:relative">
          <div className="relative aspect-photo w-full overflow-hidden rounded-card">
            <Image
              src={featured.photo}
              alt="海辺で夕日を眺めるふたり"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* スマホ枠は phone-frame.png を使わず bg-button の CSS 枠で描く */}
          <div className="relative mx-auto mt-6 w-32 sm:w-36 lg:absolute lg:right-0 lg:bottom-0 lg:mx-0 lg:mt-0 lg:w-40 lg:translate-x-6 lg:translate-y-6">
            <div className="rounded-phone bg-button p-2 shadow-card">
              <div className="overflow-hidden rounded-panel">
                <Image
                  src={featured.screen}
                  alt="Nisoine のホーム画面"
                  width={300}
                  height={650}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
