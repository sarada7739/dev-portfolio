import Container from "@/components/ui/Container";
import { site } from "@/data";

// ナビ文言は site.nav 由来。アンカー先は AGENTS.md の共通ルールで固定されている
const NAV_HREF: Record<string, string> = {
  制作物: "#works",
  一覧: "#works-all",
  お問い合わせ: "#contact",
};

export default function Header() {
  return (
    <header className="bg-cream">
      <Container className="flex min-h-nav sm:h-nav flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <nav aria-label="サイト内ナビゲーション" className="basis-full sm:basis-auto">
          <ul className="flex flex-wrap items-center gap-2 text-caption tracking-nav text-ink-soft sm:text-label">
            {site.nav.map((item, index) => (
              <li key={item} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <a href={NAV_HREF[item] ?? "#"}>{item}</a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
