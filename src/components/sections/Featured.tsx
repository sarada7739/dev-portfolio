import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { featured } from "@/data";

// 主力プロダクト Nisoine の紹介ブロック
export default function Featured() {
  const headingLines = featured.heading.split("\n");

  return (
    <section className="border-b border-blush-edge bg-blush pb-8 pt-7">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="relative lg:z-10 lg:col-start-1 lg:col-span-6 lg:row-start-1">
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
          <div className="mt-4 flex flex-wrap gap-4">
            {featured.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <div className="mt-6">
            <Button href={featured.ctaHref} arrow="→" tone="coral" external>
              {featured.ctaLabel}
            </Button>
          </div>
        </div>
        <div className="lg:col-start-5 lg:col-span-8 lg:row-start-1 lg:flex lg:items-center">
          <div className="relative aspect-photo w-full overflow-hidden rounded-card fade-x lg:flex-1">
            <Image
              src={featured.photo}
              alt="海辺で夕日を眺めるふたり"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* モバイル: 写真の下に中央 */}
          <div className="relative mx-auto mt-6 w-48 lg:hidden">
            <Image
              src={featured.phoneFrame}
              alt="Nisoine のホーム画面（スマホ）"
              width={359}
              height={714}
              className="h-auto w-full"
            />
          </div>
          {/* lg 以上: 写真の右に隣接・上下中央（重ねない） */}
          <div className="hidden lg:block lg:w-1/3 lg:shrink-0 lg:self-center">
            <Image
              src={featured.phoneFrame}
              alt="Nisoine のホーム画面（スマホ）"
              width={359}
              height={714}
              sizes="15vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
