import Link from "next/link";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/ui/ContactForm";
import { site } from "@/data";

export default function Footer() {
  const socialLinks = site.social.filter((item) => item.href !== "#");
  return (
    <footer id="contact" className="section contact-section">
      <Container>
        <div className="contact-panel glass-panel assemble from-bottom delay-6">
          <div className="contact-heading">
            <span className="eyebrow">CONTACT</span>
            <h2>開発のご相談</h2>
            <p>
              ご依頼や技術的なご質問など、
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
            <Link href="/privacy">プライバシーポリシー</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
