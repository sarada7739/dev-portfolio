import Image from "next/image";
import type { Work } from "@/data";

type WorkCardProps = {
  work: Work;
};

// 「その他の制作物」グリッドのカード1件分
export default function WorkCard({ work }: WorkCardProps) {
  return (
    <a
      href={work.href}
      className="block overflow-hidden rounded-card border border-line bg-card shadow-card"
    >
      <div className="relative aspect-thumb w-full overflow-hidden rounded-t-card">
        <Image
          src={work.thumbnail}
          alt={`${work.title} のサムネイル`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="text-balance font-serif text-h3 text-ink-soft">{work.title}</h4>
        <p className="mt-1 text-small text-gray">{work.description}</p>
        <p className="mt-2 text-caption tracking-wide text-gray-light">{work.year}</p>
      </div>
    </a>
  );
}
