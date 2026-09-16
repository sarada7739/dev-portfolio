import Container from "@/components/ui/Container";
import ContactForm from "@/components/ui/ContactForm";
import { site } from "@/data";

export default function Footer() {
  return (
    <footer id="contact" className="bg-cream-deep py-section-sm lg:py-section">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-serif text-h2 text-ink-soft">ご一緒に、ものづくりを。</h2>
        <ContactForm />
        <a
          href={`mailto:${site.email}`}
          className="text-small text-ink underline underline-offset-4"
        >
          {site.email}
        </a>
        <ul className="flex flex-wrap items-center justify-center gap-2 text-caption tracking-wide text-gray-light">
          {site.social.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              <a href={item.href} rel="noopener noreferrer" target="_blank">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-caption text-gray-faint">{site.copyright}</p>
      </Container>
    </footer>
  );
}
