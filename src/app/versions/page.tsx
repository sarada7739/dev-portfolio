import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/sections/Header";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "過去のサイト | sarada7739",
  description: "個人開発ポートフォリオのネオン版とクラシック版を閲覧できます。",
  alternates: { canonical: "/versions" },
};

const editions = [
  {
    slug: "neon",
    title: "ネオン版",
    date: "2026-11-13",
    cover: "/editions/media/neon-cover.webp",
  },
  {
    slug: "classic",
    title: "クラシック版",
    date: "2026-11-12",
    cover: "/editions/media/classic-cover.webp",
  },
];

export default function Versions() {
  return (
    <>
      <a href="#versions" className="skip-link">
        過去のサイト一覧へ移動
      </a>
      <Header home={false} />
      <main id="versions" className="versions-main">
        <Container>
          <h1 className="section-title">過去のサイト</h1>
          <div className="edition-list">
            {editions.map((edition) => (
              <a
                className="edition-link"
                key={edition.slug}
                href={`/editions/${edition.slug}`}
              >
                <span className="edition-cover">
                  <Image
                    src={edition.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 610px, (min-width: 640px) 46vw, 90vw"
                  />
                </span>
                <time dateTime={edition.date}>
                  {edition.date.replaceAll("-", ".")} 時点
                </time>
                <h2>
                  {edition.title} <span aria-hidden="true">↗</span>
                </h2>
              </a>
            ))}
          </div>
          <Link href="/" className="text-link">
            ← 最新版へ戻る
          </Link>
        </Container>
      </main>
    </>
  );
}
