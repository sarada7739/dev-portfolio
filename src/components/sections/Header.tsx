import Container from "@/components/ui/Container";
import { site } from "@/data";

const NAV_HREF: Record<string, string> = {
  制作物: "#works",
  一覧: "#works-all",
  開発について: "#how-i-work",
  お問い合わせ: "#contact",
};

export default function Header() {
  return (
    <header className="site-header assemble from-top">
      <Container className="header-inner">
        <a href="#top" className="brand" aria-label="sarada7739 のページ先頭へ">
          <span className="brand-symbol" aria-hidden="true">
            /
          </span>
          <span>
            sarada7739<span className="brand-sub"> / Portfolio</span>
          </span>
        </a>
        <nav aria-label="サイト内ナビゲーション">
          <ul className="header-nav">
            {site.nav.map((item) => (
              <li key={item}>
                <a href={NAV_HREF[item] ?? "#works"}>{item}</a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
