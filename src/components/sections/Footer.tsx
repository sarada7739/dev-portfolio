import Link from "next/link";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/ui/ContactForm";
import { site } from "@/data";

export default function Footer() {
  const socialLinks = site.social.filter((item) => item.href !== "#");
  return (
    <footer id="contact" className="section contact-section">
      <Container>
        <div className="split-section contact-panel">
          <div className="contact-heading">
            <h2 className="section-title">開発のご相談</h2>
            <p>
              開発のご依頼や技術的なご質問など、
              <br />
              お気軽にお問い合わせください。
            </p>
          </div>
          <ContactForm />
        </div>
        <div className="footer-bottom">
          <p>{site.copyright}</p>
          <div className="footer-links">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ))}
            <Link href="/versions">過去のサイト</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <a href="#top">先頭へ ↑</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
