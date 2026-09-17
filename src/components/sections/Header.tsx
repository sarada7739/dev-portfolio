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
      <Container className="flex h-nav flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="relative inline-flex font-serif text-h2 text-ink">
          {site.name}
          <svg
            aria-hidden="true"
            viewBox="0 0 8 8"
            className="absolute -right-2 -top-1 h-2 w-2 text-coral"
          >
            <path
              fill="currentColor"
              d="M4 7.2S.5 4.9.5 2.7A1.7 1.7 0 0 1 4 2a1.7 1.7 0 0 1 3.5.7C7.5 4.9 4 7.2 4 7.2Z"
            />
          </svg>
        </span>
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
